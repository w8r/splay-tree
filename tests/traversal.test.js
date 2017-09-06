import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../index';

describe('traversal check', () => {

  it ('should traverse the tree in order', () => {
    const tree = new Tree();
    tree.insert(3);
    tree.insert(1);
    tree.insert(0);
    tree.insert(2);

    tree.forEach((n, i) => assert.equal(n.key, i));
  });

  it('should find predecessor for the node', () => {
    const tree = new Tree();
    const keys = [];
    for (let i = 0; i < 10; i++) tree.insert(i);

    for (let i = 1; i < 10; i++) {
      assert.strictEqual(tree.prev(tree.find(i)), tree.find(i - 1));
    }
  });

  it('should find successor for a node', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    for (let i = 0; i < 9; i++) {
      assert.strictEqual(tree.next(tree.find(i)), tree.find(i + 1));
    }
  });

  it('should return null for predecessor of the min node', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    let min = tree.minNode();
    assert.isNull(tree.prev(min));
    tree.remove(min.key);
    min = tree.minNode();
    assert.isNull(tree.prev(min));
  });

  it('should return null for successor of the max node', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    let max = tree.maxNode();
    assert.isNull(tree.next(max));
    tree.remove(max.key);
    max = tree.maxNode();
    assert.isNull(tree.next(max));
  });

  it ('should find successor and predecessor for 2-nodes tree', () => {
    const tree = new Tree();
    tree.insert(5); tree.insert(10);

    let min = tree.minNode();
    assert.equal(min.key, 5);
    assert.isNull(tree.prev(min));
    assert.equal(tree.next(min).key, 10);

    let max = tree.maxNode();
    assert.equal(max.key, 10);
    assert.isNull(tree.next(max));
    assert.equal(tree.prev(max).key, 5);
  });

  it ('should be able to get a node by its index', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    for (let i = 0; i < 10; i++) assert.equal(tree.at(i).key, i);

    assert.isNull(tree.at(10));
    assert.isNull(tree.at(-1));
    assert.isNull(tree.at('a'));
  });
});
