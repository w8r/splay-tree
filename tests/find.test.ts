import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../src/index';

describe ('find', () => {

  it('should return key as the result of search', () => {
    const tree = new Tree<Number,any>();
    assert.equal(tree.find(1), null);
    assert.equal(tree.find(2), null);
    assert.equal(tree.find(3), null);
    tree.insert(1, 4);
    tree.insert(2, 5);
    tree.insert(3, 6);

    let root = tree.root;
    assert.equal(tree.find(1).data, 4);
    assert.notStrictEqual(root, tree.root);
    root = tree.root;

    assert.equal(tree.find(2).data, 5);
    assert.notStrictEqual(root, tree.root);
    root = tree.root;

    assert.equal(tree.find(3).data, 6);
    assert.notStrictEqual(root, tree.root);
    root = tree.root;

    assert.isNull(tree.find(8));
    assert.strictEqual(root, tree.root);
  });

  it ('should allow finding node without splaying', () => {
    const tree = new Tree<Number,any>();
    assert.equal(tree.findStatic(1), null);
    assert.equal(tree.findStatic(2), null);
    assert.equal(tree.findStatic(3), null);
    tree.insert(-2, 8);
    tree.insert(1, 4);
    tree.insert(2, 5);
    tree.insert(3, 6);

    const root = tree.root;
    assert.equal(tree.findStatic(1).data, 4);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findStatic(2).data, 5);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findStatic(3).data, 6);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findStatic(-2).data, 8);

    assert.isNull(tree.find(8));
    assert.strictEqual(root, tree.root);
  });
});
