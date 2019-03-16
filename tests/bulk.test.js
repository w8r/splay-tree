import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../dist/splay';


describe ('bulk-load', () => {

  it ('should allow bulk-insert', () => {
    const tree = new Tree();
    const keys = [1,2,3,4];
    const values = [4,3,2,1];
    tree.load(keys, values);

    assert.deepEqual(tree.keys(), keys);
    assert.deepEqual(tree.values(), values);
  });


  it ('should allow bulk-insert without values', () => {
    const tree = new Tree();
    const keys = [1,2,3,4];
    tree.load(keys);

    assert.deepEqual(tree.keys(), keys);
    assert.deepEqual(tree.values(), keys.map(k => undefined));
  });


  it ('should be able to load into a tree with contents', () => {
    const t = new Tree();
    t.load([22, 56, 0, -10, 12], undefined, true);

    t.load([100,500, -400, 20, 10], undefined, true);
    assert.deepEqual(t.keys(), [ -400, -10, 0, 10, 12, 20, 22, 56, 100, 500 ]);
  });


  it ('should be able to load into a tree with contents (interleave)', () => {
    const t = new Tree();
    t.load(new Array(10).fill(0).map((_, i) => i * 10));
    t.load(new Array(10).fill(0).map((_, i) => 5 + 10 * i));
    assert.deepEqual(t.keys(), new Array(20).fill(0).map((_, i) => 5 * i));
  });

});
