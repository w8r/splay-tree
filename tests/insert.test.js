import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../index';


describe('insert', () => {

  it('should return the size of the tree', () => {
    const tree = new Tree();
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);
    assert.equal(tree.size, 5);
  });

  it('should return the pointer', () => {
    const tree = new Tree();
    const n1 = tree.insert(1);
    const n2 = tree.insert(2);
    const n3 = tree.insert(3);

    assert.equal(n1.key, 1);
    assert.equal(n2.key, 2);
    assert.equal(n3.key, 3);
  });


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
});
