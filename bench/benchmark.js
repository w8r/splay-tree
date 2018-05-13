const Benchmark = require('benchmark');
const AVLTree   = require('avl');
const RBTree    = require('bintrees').RBTree;
const Splay     = require('../dist/splay');


function generateRValues(N, min = 0, max = N) {
  const map = {};
  const res = [];
  let i = 0;
  while (i < N) {
    const v = min + Math.floor(Math.random() * max);
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
const values = new Array(N).fill(0).map((n, i) => i);

const comparator = (a, b) => a - b;

const prefilledAVL = new AVLTree();
rvalues.forEach((v) => prefilledAVL.insert(v));

const prefilledRB = new RBTree(comparator);
rvalues.forEach((v) => prefilledRB.insert(v));

const prefilledSplay = new Splay(comparator);
rvalues.forEach((v) => prefilledSplay.insert(v));

const options = {
  onStart (event) { console.log(this.name); },
  onError (event) { console.log(event.target.error); },
  onCycle (event) {
    console.log(' -', String(event.target), `mean ${(event.target.stats.mean * 1000).toFixed(3)}ms`);
  },
  onComplete() {
    console.log('- Fastest is ' + this.filter('fastest').map('name') + '\n');
  }
};

new Benchmark.Suite(`Insert (x${N})`, options)
  .add('Bintrees RB', () => {
    let rb = new RBTree(comparator);
    for (let i = 0; i < N; i++) rb.insert(rvalues[i]);
  })
  .add('Splay (current)', () => {
    let splay = new Splay(comparator);
    for (let i = 0; i < N; i++) splay.insert(rvalues[i]);
  })
  .add('AVL', () => {
    const tree = new AVLTree();
    for (let i = 0; i < N; i++) tree.insert(rvalues[i]);
  })
  .run();


new Benchmark.Suite(`Random read (x${N})`, options)
  .add('Bintrees RB', () => {
    for (let i = N - 1; i; i--) prefilledRB.find(rvalues[i]);
  })
  .add('Splay (current)', () => {
    for (let i = N - 1; i; i--) prefilledSplay.find(rvalues[i]);
  })
  .add('Splay (current) - static', () => {
    for (let i = N - 1; i; i--) prefilledSplay.findStatic(rvalues[i]);
  })
  .add('AVL', () => {
    for (let i = N - 1; i; i--) prefilledAVL.find(rvalues[i]);
  })
  .run();


new Benchmark.Suite(`Remove (x${N})`, options)
  .add('Bintrees RB', () => {
    for (let i = 0; i < N; i++) prefilledRB.remove(rvalues[i]);
  })
  .add('Splay (current)', () => {
    for (let i = 0; i < N; i++) prefilledSplay.remove(rvalues[i]);
  })
  .add('AVL', () => {
    for (let i = N - 1; i; i--) prefilledAVL.remove(values[i]);
  })
  .run();

const M = 10000;
const arr = generateRValues(M);
new Benchmark.Suite(`Bulk-load (x${M})`, options)
  .add('1 by 1', () => {
    const t = new Splay();
    for (let i = 0; i < M; i++) t.insert(arr[i]);
  })
  .add('bulk load (build)', () => {
    const t = new Splay();
    const data = arr.slice();

    t.load(data, [], true);
  })
  .run();

const L = 1000, K = 1000;
const batch1 = new Array(L).fill(0).map((_, i) => i);
const batch2 = generateRValues(K, L);

new Benchmark.Suite(`Bulk-add (x${K}) to ${L}`, options)
  .add('1 by 1', () => {
    const t = new Splay();
    t.load(batch1);
    for (let i = 0; i < K; i++) t.insert(batch2[i]);
  })
  .add('bulk add (rebuild)', () => {
    const t = new Splay();
    t.load(batch1);
    t.load(batch2);
  })
  .run();

const G = 10000;
const P = 0.1;
const F = Math.round(G * P);
const data = generateRValues(G).sort(comparator);
const toUpdate = generateRValues(F, 0, G).map((id) => data[id]).sort(comparator);


new Benchmark.Suite(`Bulk-remove-insert (${P*100}%) of ${G}`, options)
  .add('1 by 1', () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      t.remove(toUpdate[i]);
      t.insert(toUpdate[i]);
    }
  })
  .add('bulk add (rebuild)', () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      t.remove(toUpdate[i]);
    }
    t.load(toUpdate);
  })
  .run();

new Benchmark.Suite(`Bulk-update (${P*100}%) of ${G}`, options)
  .add('1 by 1', () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      const offset = ((i & 1) ? 1 : -1) * 5000;
      t.remove(toUpdate[i]);
      t.insert(toUpdate[i] + offset);
    }
  })
  .add('split-merge', () => {
    const t = new Splay();
    t.load(data);
    for (let i = 0; i < F; i++) {
      const offset = ((i & 1) ? 1 : -1) * 5000;
      t.update(toUpdate[i], toUpdate[i] + offset);
    }
  })
  .run();




