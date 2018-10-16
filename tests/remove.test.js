import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../index';


describe('remove', () => {

  it ('should not change the size of empty tree', () => {
    const tree = new Tree();
    const result = tree.remove(1);
    assert.equal(result, false);
    assert.equal(tree.size, 0);
    assert.equal(tree.findStatic(1), null);
  });


  it ('should remove a single key', () => {
    const tree = new Tree();
    tree.insert(1);
    const result = tree.remove(1);
    assert.equal(result, true);
    assert.isTrue(tree.isEmpty());
    assert.equal(tree.findStatic(1), null);
  });


  it ('should take the right child if the left does not exist', () => {
    const tree = new Tree();
    tree.insert(1);
    tree.insert(2);
    tree.remove(1);
    assert.equal(tree._root.key, 2);
    assert.equal(tree.findStatic(1), null);
    assert.equal(tree.findStatic(2).key, 2);
  });


  it ('should take the left child if the right does not exist', () => {
    const tree = new Tree();
    tree.insert(2);
    tree.insert(1);
    tree.remove(2);
    assert.equal(tree._root.key, 1);
    assert.equal(tree.findStatic(2), null);
    assert.equal(tree.findStatic(1).key, 1);
  });


  it ('should not break the existing pointers to nodes', () => {
    const tree = new Tree();

    const n1 = tree.insert(1);
    const n2 = tree.insert(2);
    const n3 = tree.insert(3);

    tree.remove(2);

    assert.equal(tree.findStatic(1).key, 1);
    assert.equal(tree.findStatic(2), null);
    assert.equal(tree.findStatic(3).key, 3);
  });

  it ('pop()', () => {
    const tree = new Tree();
    tree.insert(2);
    tree.insert(1);
    tree.remove(2);

    const removed = tree.pop();
    assert.deepEqual(removed, { key: 1, data: undefined });
  });
});
