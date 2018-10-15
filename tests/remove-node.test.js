import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../index';

describe('remove node', () => {
  it ('should remove a node', () => {
    const tree = new Tree();
    const n1 = tree.insert(1);

    tree.removeNode(n1)
    assert.isTrue(tree.isEmpty());
    assert.equal(tree.findStatic(1), null);
  })

  it ('should leave nodes with duplicate keys', () => {
    const tree = new Tree();
    const n1 = tree.insert(1, 'a');
    const n2 = tree.insert(1, 'b');
    const n3 = tree.insert(1, 'c');
    const n4 = tree.insert(1, 'd');
    const n5 = tree.insert(1, 'e');

    tree.removeNode(n3);
    const range = [];
    tree.range(1, 1, node => {
      range.push(node.data);
    })
    range.sort();
    assert.equal(range.join(''), 'abde');
  })
  it ('should remove leaf node', () => {
    const tree = new Tree();
    const n1 = tree.insert(1);
    const n2 = tree.insert(2);
    const n3 = tree.insert(3);

    tree.removeNode(n1);
    const range = [];
    tree.range(1, 3, node => {
      range.push('' + node.key);
    })
    range.sort();
    assert.equal(range.join(''), '23');
  })
  it ('should remove a sub-node', () => {
    const tree = new Tree();
    const n1 = tree.insert(1);
    const n2 = tree.insert(2);
    const n3 = tree.insert(3);
    const n4 = tree.insert(4);
    const n5 = tree.insert(5);

    tree.removeNode(n4);
    const range = [];
    tree.range(1, 5, node => {
      range.push('' + node.key);
    })
    range.sort();
    assert.equal(range.join(''), '1235');
  })
  it ('should remove in tree with duplicates', () => {
    const tree = new Tree();
    const values = [2, 12, 1, 1, -6, 1, 1, 2, 0, 2];

    values.forEach((v) => tree.insert(v));
    let size = values.length
    for (const value of values) {
      const node = tree.findStatic(value)
      assert.exists(node, `didn't find ${value}`)
      assert.equal(node.key, value)
      tree.removeNode(node);
      assert.equal(tree.size, --size);
    }
  })
  it ('should remove in tree with multiple duplicates', () => {
    const tree = new Tree();
    const values = [2, 3, 3, 1, 2, 2, 1, 3, 2, 1, 3, 4, 2, 3, 2, 3, 2];

    values.forEach((v) => tree.insert(v));
    let count = 1
    for (const value of values) {
      const node = tree.findStatic(value)
      assert.exists(node, `didn't find ${value} (at ${count})`)
      assert.equal(node.key, value)
      tree.removeNode(node);
      assert.equal(tree.size, values.length - count);
      const keys = tree.keys()
      keys.sort()
      const expectedKeys = values.slice(count)
      expectedKeys.sort()
      assert.deepEqual(keys, expectedKeys)
      count += 1
    }
  })
})
