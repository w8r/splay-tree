import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../index';

function count(tree, size = 0) {
  if (tree) size += count(tree.left, size) + count(tree.right, size);
  return size;
}

function toArray(tree, arr = []) {
  if (tree) {
    toArray(tree.left, arr);
    arr.push(tree.key);
    toArray(tree.right, arr);
  }
  return arr;
}

function createTree(values) {
  const t = new Tree();
  values.forEach((v) => t.insert(v));
  return t;
}

describe ('update', () => {

  it('split', () => {
    let t, split;

    t = createTree([1,2,3]);
    split = t.split(0);
    assert.deepEqual(split.left, null);
    assert.deepEqual(toArray(split.right), [1,2,3]);


    t = createTree([1,2,3]);
    split = t.split(2);
    assert.deepEqual(toArray(split.left), [1]);
    assert.deepEqual(toArray(split.right), [3]);

    t = createTree([1,2,3]);
    split = t.split(1);
    assert.deepEqual(toArray(split.left), []);
    assert.deepEqual(toArray(split.right), [2, 3]);

    t = createTree([1,2,3]);
    split = t.split(3);
    assert.deepEqual(toArray(split.left), [1, 2]);
    assert.deepEqual(toArray(split.right), []);
  });

  it('merge', () => {
    const t = createTree([1,2,3,4,5]);
    t.update(3, 6);
    assert.deepEqual(t.keys(), [1,2,4,5,6]);
    t.update(2, 0);
    assert.deepEqual(t.keys(), [0,1,4,5,6]);
    t.update(0, 7);
    assert.deepEqual(t.keys(), [1,4,5,6,7]);
  });
});
