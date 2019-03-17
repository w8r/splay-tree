import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../src/index';

describe ('Duplicate keys', () => {

  it ('should allow inserting of duplicate key', () => {
    const tree = new Tree<Number,any>();
    const values = [2, 12, 1, -6, 1];

    values.forEach((v) => {
      tree.insert(v);
    });

    assert.deepEqual(tree.keys(), [-6, 1, 1, 2, 12]);
    assert.equal(tree.size, 5);
  });


  it ('should allow multiple duplicate keys in a row', () => {
    const tree = new Tree();
    const values = [2, 12, 1, 1, -6, 2, 1, 1, 13];

    values.forEach((v) => {
      tree.insert(v);
    });


    assert.deepEqual(tree.keys(), [ -6, 1, 1, 1, 1, 2, 2, 12, 13 ]);
    assert.equal(tree.size, 9);
  });

  it ('should remove from a tree with duplicate keys correctly', () => {
    const tree = new Tree();
    const values = [2, 12, 1, 1, -6, 1, 1];

    values.forEach((v) => tree.insert(v));

    let size = tree.size;
    for (let i = 0; i < 4; i++) {
      tree.remove(1);

      if (i < 3) assert.isTrue(tree.contains(1));
      assert.equal(tree.size, --size);
    }

    assert.isFalse(tree.contains(1));
  });

  it ('should remove from a tree with multiple duplicate keys correctly', () => {
    const tree = new Tree();
    const values = [2, 12, 1, 1, -6, 1, 1, 2, 0, 2];

    values.forEach((v) => tree.insert(v));

    let size = tree.size;
    while (!tree.isEmpty()) {
      tree.pop();
      assert.equal(tree.size, --size);
    }
  });

  it ('should disallow duplicates if noDuplicates is set', () => {
    const tree = new Tree();
    const values = [2, 12, 1, -6, 1];

    values.forEach((v) => {
      tree.add(v);
    });

    assert.deepEqual(tree.keys(), [-6, 1, 2, 12]);
    assert.equal(tree.size, 4);
  });


  it ('should add only if the key is not there', () => {
    const tree = new Tree();
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);

    const s = tree.size;
    tree.add(1);
    assert.equal(tree.size, s);
  });
});
