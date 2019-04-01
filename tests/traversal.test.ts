import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../src/index';

describe('traversal check', () => {

  it ('should traverse the tree in order', () => {
    const tree = new Tree();
    tree.insert(3);
    tree.insert(1);
    tree.insert(0);
    tree.insert(2);

    let i = 0;
    tree.forEach((n) => assert.equal(n.key, i++));
  });

  it('should find predecessor for the node', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    for (let i = 1; i < 10; i++) {
      assert.strictEqual(tree.prev(tree.find(i)).key, tree.find(i - 1).key);
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


  it ('should reach end in walking', () => {
    const tree = new Tree();
    const keys = [
      49153, 49154, 49156, 49157, 49158, 49159, 49160, 49161,
      49163, 49165, 49191, 49199, 49201, 49202, 49203, 49204,
      49206, 49207, 49208, 49209, 49210, 49212
    ];

    keys.forEach((k) => tree.insert(k));

    let min = tree.minNode();

    keys.forEach((key, i) => {
      assert.equal(min.key, key);
      min = tree.next(min);
    });

    assert.isNull(min);
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
  });


  it ('should support range walking', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    const arr:number[] = [];
    tree.range(3, 8, (n) => {
      arr.push(n.key);
    });
    assert.deepEqual(arr, [3,4,5,6,7,8]);
  });

  it ('should support range walking with non-existent low key', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    const arr:number[] = [];
    tree.range(-3,5, (n) => {
      arr.push(n.key);
    });

    assert.deepEqual(arr, [0,1,2,3,4,5]);
  });

  it ('should support range walking with non-existent high key', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    const arr:number[] = [];
    tree.range(3,15, (n) => {
      arr.push(n.key);
    });

    assert.deepEqual(arr, [3,4,5,6,7,8,9]);
  });

  it ('should support range walking with both keys out of range', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    const arr:number[] = [];
    tree.range(10, 20, (n) => {
      arr.push(n.key);
    });

    assert.equal(arr.length, 0);

    tree.range(-10, 20, (n) => {
      arr.push(n.key);
    });
    assert.deepEqual(arr, tree.keys());
  });

  it ('should support range walking with interruption', () => {
    const tree = new Tree();
    for (let i = 0; i < 10; i++) tree.insert(i);

    const arr:number[] = [];
    tree.range(2,8, (n) => {
      arr.push(n.key);
      if (n.key === 5) return true;
    });

    assert.deepEqual(arr, [2,3,4,5]);
  });
});
