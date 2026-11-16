import { bench, describe } from "vitest";
import { AVLTree } from "avl";
import { RBTree } from "bintrees";
import Splay from "../src/index";

// Seeded PRNG (mulberry32) so every run, on every branch, uses the same data.
// Splay tree shape depends on insertion order, so random data made runs
// incomparable.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(0x5eed);

function generateRValues(N: number, min = 0, max = N): number[] {
  const map: Record<number, boolean> = {};
  const res: number[] = [];
  let i = 0;
  while (i < N) {
    const v = min + Math.floor(random() * max);
    if (!map[v]) {
      map[v] = true;
      res.push(v);
      i++;
    }
  }
  return res;
}

const N = 1000;
const rvalues = generateRValues(N);

const comparator = (a: number, b: number) => a - b;

const prefilledAVL = new AVLTree();
rvalues.forEach((v) => prefilledAVL.insert(v));

const prefilledRB = new RBTree(comparator);
rvalues.forEach((v) => prefilledRB.insert(v));

function prefillSplay() {
  const t = new Splay(comparator);
  rvalues.forEach((v) => t.insert(v));
  return t;
}
// Separate trees: find() splays and reshapes the tree, which would otherwise
// change the input of the findStatic() bench.
const splayForFind = prefillSplay();
const splayForFindStatic = prefillSplay();

describe(`Insert (x${N})`, () => {
  bench("Bintrees RB", () => {
    let rb = new RBTree(comparator);
    for (let i = 0; i < N; i++) rb.insert(rvalues[i]);
  });

  bench("Splay (current)", () => {
    let splay = new Splay(comparator);
    for (let i = 0; i < N; i++) splay.insert(rvalues[i]);
  });

  bench("AVL", () => {
    const tree = new AVLTree();
    for (let i = 0; i < N; i++) tree.insert(rvalues[i]);
  });
});

describe(`Random read (x${N})`, () => {
  bench("Bintrees RB", () => {
    for (let i = N - 1; i; i--) prefilledRB.find(rvalues[i]);
  });

  bench("Splay (current)", () => {
    for (let i = N - 1; i; i--) splayForFind.find(rvalues[i]);
  });

  bench("Splay (current) - static", () => {
    for (let i = N - 1; i; i--) splayForFindStatic.findStatic(rvalues[i]);
  });

  bench("AVL", () => {
    for (let i = N - 1; i; i--) prefilledAVL.find(rvalues[i]);
  });
});

// Removing from a shared prefilled tree empties it on the first iteration, so
// every later iteration measured removes on an empty tree. Build the tree in
// each iteration instead; subtract the Insert suite to estimate remove cost.
describe(`Insert + remove (x${N})`, () => {
  bench("Bintrees RB", () => {
    const t = new RBTree(comparator);
    for (let i = 0; i < N; i++) t.insert(rvalues[i]);
    for (let i = 0; i < N; i++) t.remove(rvalues[i]);
  });

  bench("Splay (current)", () => {
    const t = new Splay(comparator);
    for (let i = 0; i < N; i++) t.insert(rvalues[i]);
    for (let i = 0; i < N; i++) t.remove(rvalues[i]);
  });

  bench("AVL", () => {
    const t = new AVLTree();
    for (let i = 0; i < N; i++) t.insert(rvalues[i]);
    for (let i = 0; i < N; i++) t.remove(rvalues[i]);
  });
});

const M = 10000;
const arr = generateRValues(M);

describe(`Bulk-load (x${M})`, () => {
  bench("1 by 1", () => {
    const t = new Splay();
    for (let i = 0; i < M; i++) t.insert(arr[i]);
  });

  bench("bulk load (build)", () => {
    const t = new Splay();
    const data = arr.slice();
    t.load(data, [], true);
  });
});

const L = 1000;
const K = 1000;
const batch1 = Array.from({ length: L }, (_, i) => i);
const batch2 = generateRValues(K, L);

describe(`Bulk-add (x${K}) to ${L}`, () => {
  bench("1 by 1", () => {
    const t = new Splay();
    t.load(batch1);
    for (let i = 0; i < K; i++) t.insert(batch2[i]);
  });

  bench("bulk add (rebuild)", () => {
    const t = new Splay();
    t.load(batch1);
    t.load(batch2);
  });
});

const G = 10000;
const P = 0.1;
const F = Math.round(G * P);
const data = generateRValues(G).sort(comparator);
const toUpdate = generateRValues(F, 0, G)
  .map((id) => data[id])
  .sort(comparator);

describe(`Bulk-remove-insert (${P * 100}%) of ${G}`, () => {
  bench("1 by 1", () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      t.remove(toUpdate[i]);
      t.insert(toUpdate[i]);
    }
  });

  bench("bulk add (rebuild)", () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      t.remove(toUpdate[i]);
    }
    t.load(toUpdate);
  });
});

describe(`Bulk-update (${P * 100}%) of ${G}`, () => {
  bench("1 by 1", () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      const offset = (i & 1 ? 1 : -1) * 5000;
      t.remove(toUpdate[i]);
      t.insert(toUpdate[i] + offset);
    }
  });

  bench("split-merge", () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      const offset = (i & 1 ? 1 : -1) * 5000;
      t.update(toUpdate[i], toUpdate[i] + offset);
    }
  });
});
