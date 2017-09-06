const Benchmark = require('benchmark');
const Tree      = require('avl');
const FRB       = require('functional-red-black-tree');
const RBTree    = require('bintrees').RBTree;
const Splay     = require('../dist/splay');

require('google-closure-library');
goog.require('goog.structs.AvlTree');


const N = 1000;
const rvalues = new Array(N).fill(0).map((n, i) => Math.floor(Math.random() * N));
const values = new Array(N).fill(0).map((n, i) => i);

const prefilledAVL = new Tree();
rvalues.forEach((v) => prefilledAVL.insert(v));
const prefilledRB = new RBTree((a, b) => a - b);
rvalues.forEach((v) => prefilledRB.insert(v));
let prefilledFRB = new FRB();
rvalues.forEach((v) => { prefilledFRB = prefilledFRB.insert(v); });
const prefilledGCAVL = new goog.structs.AvlTree((a, b) => a - b);
rvalues.forEach((v) => prefilledGCAVL.add(v));

const prefilledSplay = new Splay((a, b) => a - b);
rvalues.forEach((v) => prefilledSplay.insert(v));

const options = {
  onStart (event) { console.log(this.name); },
  onError (event) { console.log(event.target.error); },
  onCycle (event) { console.log(String(event.target)); },
  onComplete() {
    console.log('- Fastest is ' + this.filter('fastest').map('name') + '\n');
  }
};

new Benchmark.Suite(`Insert (x${N})`, options)
  .add('Bintrees', () => {
    let rb = new RBTree((a, b) => a - b);
    for (let i = 0; i < N; i++) rb.insert(rvalues[i]);
  })
  .add('Functional red black tree', () => {
    let frb = new FRB();
    for (let i = 0; i < N; i++) frb = frb.insert(rvalues[i]);
  })
  .add('Google Closure library AVL', () => {
    let gcavl = new goog.structs.AvlTree((a, b) => a - b);
    for (let i = 0; i < N; i++) gcavl.add(rvalues[i]);
  })
  .add('Splay (current)', () => {
    let splay = new Splay((a, b) => a - b);
    for (let i = 0; i < N; i++) splay.insert(rvalues[i]);
  })
  .add('AVL', () => {
    const tree = new Tree();
    for (let i = 0; i < N; i++) tree.insert(rvalues[i]);
  })
  .run();


new Benchmark.Suite(`Random read (x${N})`, options)
  .add('Bintrees', () => {
    for (let i = N - 1; i; i--) prefilledRB.find(rvalues[i]);
  })
  .add('Functional red black tree', () => {
    for (let i = N - 1; i; i--) prefilledFRB.get(rvalues[i]);
  })
  .add('Google Closure library AVL', () => {
    for (let i = 0; i < N; i++) prefilledGCAVL.inOrderTraverse((v) => v === rvalues[i]);
  })
  .add('Splay (current)', () => {
    for (let i = N - 1; i; i--) prefilledSplay.find(rvalues[i]);
  })
  .add('AVL', () => {
    for (let i = N - 1; i; i--) prefilledAVL.find(rvalues[i]);
  })
  .run();


new Benchmark.Suite(`Remove (x${N})`, options)
  .add('Bintrees', () => {
    for (let i = 0; i < N; i++) prefilledRB.remove(rvalues[i]);
  })
  .add('Functional red black tree', () => {
    for (let i = 0; i < N; i++) prefilledFRB = prefilledFRB.remove(rvalues[i]);
  })
  .add('Splay (current)', () => {
    for (let i = 0; i < N; i++) prefilledSplay.remove(rvalues[i]);
  })
  .add('Google Closure library AVL', () => {
    for (let i = 0; i < N; i++) prefilledGCAVL.remove(rvalues[i]);
  })
  .add('AVL', () => {
    for (let i = N - 1; i; i--) prefilledAVL.remove(values[i]);
  })
  .run();
