import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../dist/splay';


describe('find min and max', () => {

  it('should return the maximum key in the tree', () => {
    const tree = new Tree();
    tree.insert(3);
    tree.insert(5);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    assert.equal(tree.max(), 5);
  });

  it ('should return null for max if the tree is empty', () => {
    const tree = new Tree();
    assert.isNull(tree.max());
  });

  it('should return the minimum key in the tree', () => {
    const tree = new Tree();
    tree.insert(5);
    tree.insert(3);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    assert.equal(tree.min(), 1);
  });

  it ('should return the max node', () => {
    const tree = new Tree();
    tree.insert(3);
    tree.insert(5, 10);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    const node = tree.maxNode();
    assert.equal(node.key, 5);
    assert.equal(node.data, 10);
  });

  it ('should return null for maxNode if the tree is empty', () => {
    const tree = new Tree();
    assert.isNull(tree.maxNode());
  });

  it ('should return the min node', () => {
    const tree = new Tree();
    tree.insert(5);
    tree.insert(3);
    tree.insert(1, 20);
    tree.insert(4);
    tree.insert(2);
    const node = tree.minNode();
    assert.equal(node.key, 1);
    assert.equal(node.data, 20);
  });

  it ('should return null for min if the tree is empty', () => {
    const tree = new Tree();
    assert.isNull(tree.min());
  });

  it ('should support removing min node', () => {
    const tree = new Tree();
    tree.insert(5);
    tree.insert(3);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    assert.equal(tree.pop().key, 1);
  });

  it ('should return null for minNode if the tree is empty', () => {
    const tree = new Tree();
    assert.isNull(tree.minNode());
  });

});
