import SplayTree from "../src/index";
import type Node from "../src/node";

// A live splay tree drawn on the hero canvas. Nodes are laid out by key order
// (x) and depth (y); every node keeps its object through splays, so animating
// each one towards its new position shows the rotations as they happen.

type TreeNode = Node<number, undefined>;
type Op = "find" | "findStatic" | "remove";

interface Sprite {
  key: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  alpha: number;
  talpha: number;
}

const KEY_RANGE = 99; // keys are integers in [1, KEY_RANGE]
const HOT_KEYS = 4; // keys that auto mode looks up most of the time
const RECENT = 20; // lookups the mean depth is taken over
const AUTO_MS = 1000;

type RGB = [number, number, number];

function cssColor(name: string): RGB {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const rgba = ([r, g, b]: RGB, alpha = 1) =>
  `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha.toFixed(3)})`;

const randomInt = (max: number) => Math.floor(Math.random() * max);

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function initHero() {
  const hero = document.getElementById("hero")!;
  const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const copy = document.getElementById("hero-copy")!;
  const controls = document.getElementById("hero-controls")!;
  const statsOut = document.getElementById("hero-stats")!;
  const lastOut = document.getElementById("hero-last")!;
  const autoButton = document.getElementById("hero-auto")!;
  const insertButton = document.getElementById("hero-insert")!;
  const resetButton = document.getElementById("hero-reset")!;
  const opButtons = [...controls.querySelectorAll<HTMLButtonElement>("[data-op]")];

  const colors = {
    bg: cssColor("--bg"),
    panel: cssColor("--panel"),
    edge: cssColor("--edge"),
    text: cssColor("--text"),
    muted: cssColor("--muted"),
    accent: cssColor("--accent"),
    path: cssColor("--path"),
  };

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let auto = !reducedMotion;
  let op: Op = "find";

  // The comparator counts its calls for the readout. findStatic() calls it
  // once per node it visits, as compare(key, node.key), so while `trace` is
  // set it also records the search path.
  let comparisons = 0;
  let trace: number[] | null = null;
  const tree = new SplayTree<number, undefined>((a: number, b: number) => {
    comparisons++;
    trace?.push(b);
    return a - b;
  });

  const sprites = new Map<TreeNode, Sprite>();
  const glow = new Map<TreeNode, number>(); // search path highlight, 1 → 0
  const heat = new Map<number, number>(); // how often a key was looked up lately
  let hot: number[] = [];
  let recentDepths: number[] = [];
  let hover: TreeNode | null = null;
  let targetSize = 20;

  // Layout box, in CSS pixels
  let box = { left: 0, right: 0, top: 0, bottom: 0 };
  let radius = 12;

  // ── Tree helpers ──────────────────────────────────────────
  // Keys on the way from the root to `key`, both included
  function pathTo(key: number): number[] {
    const saved = comparisons;
    trace = [];
    tree.findStatic(key);
    const path = trace;
    trace = null;
    comparisons = saved;
    return path;
  }

  // Nodes in key order, with their depth
  function inOrder(): { node: TreeNode; depth: number }[] {
    return Array.from(tree, (node) => ({ node, depth: pathTo(node.key).length - 1 }));
  }

  function searchPath(key: number): TreeNode[] {
    return pathTo(key).map((k) => tree.findStatic(k)!);
  }

  function missingKey(): number | null {
    if (tree.size >= KEY_RANGE) return null;
    let key: number;
    do key = 1 + randomInt(KEY_RANGE);
    while (tree.contains(key));
    return key;
  }

  // ── Layout ────────────────────────────────────────────────
  function measure() {
    const heroBox = hero.getBoundingClientRect();
    const copyBox = copy.getBoundingClientRect();
    const width = Math.min(heroBox.width - 48, 1200);
    box = {
      left: (heroBox.width - width) / 2,
      right: (heroBox.width + width) / 2,
      top: copyBox.bottom - heroBox.top + 40,
      bottom: controls.getBoundingClientRect().top - heroBox.top - 20,
    };
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(heroBox.width * dpr);
    canvas.height = Math.round(heroBox.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function relayout(snap = false) {
    const nodes = inOrder();
    const height = nodes.reduce((h, { depth }) => Math.max(h, depth), 0);
    const slot = (box.right - box.left) / Math.max(nodes.length, 1);
    radius = Math.max(5, Math.min(13, slot * 0.36));
    const level = Math.min(54, (box.bottom - box.top - 2 * radius) / Math.max(height, 1));

    const live = new Set<TreeNode>();
    nodes.forEach(({ node, depth }, i) => {
      live.add(node);
      const tx = box.left + (i + 0.5) * slot;
      const ty = box.top + radius + depth * level;
      let s = sprites.get(node);
      if (!s) {
        s = { key: node.key, x: tx, y: ty, tx, ty, alpha: 0, talpha: 1 };
        sprites.set(node, s);
      }
      s.tx = tx;
      s.ty = ty;
      s.talpha = 1;
      if (snap) {
        s.x = tx;
        s.y = ty;
      }
    });
    // Removed nodes fade out where they are
    for (const [node, s] of sprites) if (!live.has(node)) s.talpha = 0;

    statsOut.innerHTML =
      `size <code>${tree.size}</code> · height <code>${height}</code>` +
      (recentDepths.length
        ? ` · mean lookup depth, last ${recentDepths.length}: <code>${(
            recentDepths.reduce((a, b) => a + b, 0) / recentDepths.length
          ).toFixed(1)}</code>`
        : "");
  }

  // ── Operations ────────────────────────────────────────────
  function access(key: number, what: Op) {
    const path = searchPath(key);
    const depth = path.length - 1;
    comparisons = 0;

    if (what === "remove") {
      tree.remove(key);
      heat.delete(key);
      hot = hot.filter((k) => k !== key);
      lastOut.innerHTML = `<code>remove(${key})</code>: ${comparisons} comparisons`;
    } else {
      if (what === "find") tree.find(key);
      else tree.findStatic(key);
      for (const [k, h] of heat) heat.set(k, h * 0.9);
      heat.set(key, (heat.get(key) ?? 0) + 1);
      recentDepths = [...recentDepths, depth].slice(-RECENT);
      lastOut.innerHTML =
        what === "find"
          ? `<code>find(${key})</code>: depth ${depth} → 0, ${comparisons} comparisons`
          : `<code>findStatic(${key})</code>: depth ${depth}, ${comparisons} comparisons, tree unchanged`;
    }
    for (const node of path) glow.set(node, 1);
    relayout();
  }

  function insertRandom() {
    const key = missingKey();
    if (key === null) return;
    comparisons = 0;
    const node = tree.insert(key) as TreeNode;
    glow.set(node, 1);
    lastOut.innerHTML = `<code>insert(${key})</code>: ${comparisons} comparisons, new root`;
    relayout();
  }

  function reset() {
    measure();
    targetSize = Math.max(10, Math.min(31, Math.floor((box.right - box.left) / 36)));
    tree.clear();
    sprites.clear();
    glow.clear();
    heat.clear();
    recentDepths = [];
    const keys = shuffle(Array.from({ length: KEY_RANGE }, (_, i) => i + 1)).slice(0, targetSize);
    for (const key of keys) tree.insert(key);
    hot = shuffle(keys.slice()).slice(0, HOT_KEYS);
    lastOut.innerHTML = "&nbsp;";
    relayout(true);
  }

  // Auto mode: mostly look up a few hot keys, sometimes any key, now and then
  // insert or remove one, so that the hot keys gather near the root
  function autoStep() {
    const r = Math.random();
    if (r < 0.07 && tree.size < targetSize + 4) return insertRandom();
    const keys = tree.keys();
    if (!keys.length) return insertRandom();
    if (r < 0.14 && tree.size > targetSize - 4) {
      const cold = keys.filter((k) => !hot.includes(k));
      if (cold.length) return access(cold[randomInt(cold.length)], "remove");
    }
    const pool = hot.length && Math.random() < 0.75 ? hot : keys;
    access(pool[randomInt(pool.length)], "find");
  }

  function setAuto(on: boolean) {
    auto = on;
    autoButton.setAttribute("aria-pressed", String(on));
  }

  // ── Drawing ───────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Edges of the live tree
    ctx.lineWidth = 1.5;
    for (const [node, s] of sprites) {
      if (s.talpha === 0) continue;
      for (const child of [node.left, node.right]) {
        const c = child && sprites.get(child);
        if (!c) continue;
        const g = Math.max(glow.get(node) ?? 0, 0) * Math.max(glow.get(child!) ?? 0, 0);
        ctx.strokeStyle = rgba(mix(colors.edge, colors.path, g), Math.min(s.alpha, c.alpha));
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
      }
    }

    // Nodes
    const font = Math.round(Math.min(12, radius * 0.95));
    ctx.font = `${font}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const [node, s] of sprites) {
      const g = Math.max(glow.get(node) ?? 0, 0);
      const h = Math.min(1, (heat.get(s.key) ?? 0) / 2.5);
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = rgba(mix(colors.panel, colors.accent, h * 0.85));
      ctx.strokeStyle =
        node === hover
          ? rgba(colors.text)
          : rgba(mix(mix(colors.edge, colors.accent, h), colors.path, g));
      ctx.lineWidth = 1.5 + g * 1.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (radius >= 8) {
        ctx.fillStyle = rgba(h > 0.55 ? colors.bg : colors.text);
        ctx.fillText(String(s.key), s.x, s.y + 0.5);
      }
    }
    ctx.globalAlpha = 1;

    const root = tree.root && sprites.get(tree.root as TreeNode);
    ctx.font = `12px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
    ctx.fillStyle = rgba(colors.muted);
    if (root) ctx.fillText("root", root.x, root.y - radius - 12);
    else ctx.fillText("empty tree: insert a key", (box.left + box.right) / 2, box.top + 40);
  }

  // ── Loop ──────────────────────────────────────────────────
  let visible = true;
  let last = performance.now();
  let sinceAuto = 0;

  function frame(now: number) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    const f = reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
    for (const [node, s] of sprites) {
      s.x += (s.tx - s.x) * f;
      s.y += (s.ty - s.y) * f;
      s.alpha += (s.talpha - s.alpha) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 6));
      if (s.talpha === 0 && s.alpha < 0.02) {
        sprites.delete(node);
        glow.delete(node);
      }
    }
    for (const [node, g] of glow) {
      if (g - dt / 1.6 <= 0) glow.delete(node);
      else glow.set(node, g - dt / 1.6);
    }

    if (auto && !document.hidden) {
      sinceAuto += dt * 1000;
      if (sinceAuto > AUTO_MS) {
        sinceAuto = 0;
        autoStep();
      }
    }

    draw();
    if (visible) requestAnimationFrame(frame);
  }

  // ── Input ─────────────────────────────────────────────────
  function nodeAt(event: PointerEvent): TreeNode | null {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let best: TreeNode | null = null;
    let bestDist = (radius + 6) ** 2;
    for (const [node, s] of sprites) {
      if (s.talpha === 0) continue;
      const d = (s.x - x) ** 2 + (s.y - y) ** 2;
      if (d < bestDist) {
        bestDist = d;
        best = node;
      }
    }
    return best;
  }

  canvas.addEventListener("pointermove", (event) => {
    hover = nodeAt(event);
    canvas.style.cursor = hover ? "pointer" : "";
  });
  canvas.addEventListener("pointerleave", () => {
    hover = null;
  });
  canvas.addEventListener("click", (event) => {
    const node = nodeAt(event as PointerEvent);
    if (!node) return;
    setAuto(false);
    access(node.key, op);
    hover = op === "remove" ? null : hover;
  });

  for (const button of opButtons) {
    button.addEventListener("click", () => {
      op = button.dataset.op as Op;
      for (const b of opButtons) b.setAttribute("aria-pressed", String(b === button));
    });
  }
  autoButton.addEventListener("click", () => setAuto(!auto));
  insertButton.addEventListener("click", () => {
    setAuto(false);
    insertRandom();
  });
  resetButton.addEventListener("click", reset);

  addEventListener("resize", () => {
    measure();
    relayout(true);
  });

  new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  }).observe(hero);

  setAuto(auto);
  reset();
  requestAnimationFrame(frame);
  hero.classList.add("ready");
}
