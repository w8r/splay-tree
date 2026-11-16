#!/usr/bin/env node
// Compares `vitest bench --outputJson` results of a base and a head checkout
// over several rounds, writes a markdown report, and exits with code 1 if any
// benchmark is slower than the threshold in *every* round.
//
// Usage:
//   node bench/compare.mjs --base <dir> --head <dir> [--threshold 0.10] [--out report.md]
//
// Run the same bench files on both sides (CI copies the head's bench/ into the
// base checkout), so differences come from the library code, not the benchmarks.
//
// <dir> holds one JSON file per round (e.g. round-1.json, round-2.json). Base
// and head round files are paired by sorted file name, so run them in pairs on
// the same machine.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const threshold = Number(args.threshold ?? 0.1);
if (!args.base || !args.head || !(threshold > 0 && threshold < 1)) {
  console.error("usage: compare.mjs --base <dir> --head <dir> [--threshold 0.10] [--out file]");
  process.exit(2);
}

/** @returns {Map<string, number>[]} one map of "group > name" -> hz per round */
function loadRounds(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const map = new Map();
      for (const file of JSON.parse(readFileSync(join(dir, f), "utf8")).files) {
        for (const group of file.groups) {
          const suite = group.fullName.split(" > ").slice(1).join(" > ");
          // A bench that throws (e.g. it calls an API the base doesn't have yet)
          // reports hz = NaN; leave it out so it shows as measured on one side only.
          for (const b of group.benchmarks) {
            if (Number.isFinite(b.hz) && b.hz > 0) map.set(`${suite}\u0000${b.name}`, b.hz);
          }
        }
      }
      return map;
    });
}

const base = loadRounds(args.base);
const head = loadRounds(args.head);
if (base.length === 0 || base.length !== head.length) {
  console.error(`need the same, non-zero number of rounds (base: ${base.length}, head: ${head.length})`);
  process.exit(2);
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const pct = (r) => `${r >= 1 ? "+" : ""}${((r - 1) * 100).toFixed(1)}%`;
const ops = (hz) => Math.round(hz).toLocaleString("en-US");

const keys = [...new Set([...base[0].keys(), ...head[0].keys()])];
const rows = [];
const regressions = [];
const onlyIn = { base: [], head: [] };

for (const key of keys) {
  const [suite, name] = key.split("\u0000");
  const label = `${suite} › ${name}`;
  if (!head.every((r) => r.has(key))) { onlyIn.base.push(label); continue; }
  if (!base.every((r) => r.has(key))) { onlyIn.head.push(label); continue; }

  const ratios = base.map((r, i) => head[i].get(key) / r.get(key));
  const ratio = median(ratios);
  // Fail only when every round agrees, so one noisy round can't fail the check.
  const regressed = Math.max(...ratios) < 1 - threshold;
  const improved = Math.min(...ratios) > 1 + threshold;
  if (regressed) regressions.push(label);

  rows.push(
    `| ${suite} | ${name} | ${ops(median(base.map((r) => r.get(key))))} | ` +
      `${ops(median(head.map((r) => r.get(key))))} | ${pct(ratio)} | ` +
      `${ratios.map(pct).join(" / ")} | ${regressed ? "🔴" : improved ? "🟢" : "⚪"} |`,
  );
}

const limit = `${Math.round(threshold * 100)}%`;
const lines = [
  "<!-- bench-report -->",
  "## Benchmark comparison",
  "",
  regressions.length
    ? `🔴 **${regressions.length} benchmark(s) slower than ${limit} in every round.**`
    : `✅ No benchmark is slower than ${limit} in every round.`,
  "",
  `Base and head ran alternately on the same runner, ${base.length} rounds each. ` +
    "ops/s is the median across rounds; Δ is the median per-round change. " +
    `A case is flagged only if all rounds agree. Differences under ~${limit} are noise on shared CI runners.`,
  "",
  "| Suite | Case | base (ops/s) | head (ops/s) | Δ | per round | |",
  "|---|---|--:|--:|--:|--:|:-:|",
  ...rows,
];
if (onlyIn.head.length) lines.push("", `Only measured on head (new, or failed on base): ${onlyIn.head.join(", ")}`);
if (onlyIn.base.length) lines.push("", `Only measured on base (removed, or failed on head): ${onlyIn.base.join(", ")}`);

const report = lines.join("\n") + "\n";
if (args.out) writeFileSync(args.out, report);
process.stdout.write(report);
process.exit(regressions.length ? 1 : 0);
