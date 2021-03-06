import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../src/index';
import Node from '../src/node';

function count(tree:Node<number,any>, size = 0) {
  if (tree) size += count(tree.left, size) + count(tree.right, size);
  return size;
}

function toArray(tree:Node<number,any>, arr:number[] = []) {
  if (tree) {
    toArray(tree.left, arr);
    arr.push(tree.key);
    toArray(tree.right, arr);
  }
  return arr;
}

function createTree(values:any[]) {
  const t = new Tree();
  values.forEach((v) => t.insert(v));
  return t;
}

describe ('update', () => {

  it ('split', () => {
    let t, split;

    t = createTree([1,2,3]);
    split = t.split(0);
    assert.deepEqual(split.left, null);
    assert.deepEqual(toArray(split.right), [1,2,3]);

    t = createTree([1,2,3]);
    split = t.split(2.5);
    assert.deepEqual(toArray(split.left), [1,2]);
    assert.deepEqual(toArray(split.right), [3]);

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

  it ('merge', () => {
    const t = createTree([1,2,3,4,5]);
    t.update(3, 6);
    assert.deepEqual(t.keys(), [1,2,4,5,6]);
    t.update(2, 0);
    assert.deepEqual(t.keys(), [0,1,4,5,6]);
    t.update(0, 7);
    assert.deepEqual(t.keys(), [1,4,5,6,7]);
    t.update(7, -3);
    assert.deepEqual(t.keys(), [-3,1,4,5,6]);
  });
});
