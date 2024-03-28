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

    tree.find(2);
    const root = tree.root;
    assert.equal(tree.findStatic(1).data, 4);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findStatic(2).data, 5);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findStatic(3).data, 6);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findStatic(-2).data, 8);

    assert.strictEqual(tree.find(2), tree.root);
  });

  it('should return previous key as result of search', () => {
    const tree = new Tree<Number,any>();
    assert.equal(tree.findAtOrNeighbor(10), null);
    assert.equal(tree.findAtOrNeighbor(20), null);
    assert.equal(tree.findAtOrNeighbor(30), null);
    tree.insert(10, 40);
    tree.insert(20, 50);
    tree.insert(30, 60);

    let root = tree.root;
    assert.equal(tree.findAtOrNeighbor(10).data, 40);
    assert.notStrictEqual(root, tree.root);
    root = tree.root;

    const found_around_15 = tree.findAtOrNeighbor(15);
    assert.equal(found_around_15.data === 40 || found_around_15.data === 50, true);

    assert.equal(tree.findAtOrNeighbor(20).data, 50);
    assert.notStrictEqual(root, tree.root);
    root = tree.root;

    assert.equal(tree.findAtOrNeighbor(30).data, 60);
    assert.notStrictEqual(root, tree.root);
    root = tree.root;

    assert.equal(tree.findAtOrNeighbor(80).data, 60);
    assert.strictEqual(root, tree.root);
  });

  it ('should allow finding node by approximate key without splaying', () => {
    const tree = new Tree<Number,any>();
    assert.equal(tree.findAtOrNeighborStatic(10), null);
    assert.equal(tree.findAtOrNeighborStatic(20), null);
    assert.equal(tree.findAtOrNeighborStatic(30), null);
    tree.insert(-20, 80);
    tree.insert(10, 40);
    tree.insert(20, 50);
    tree.insert(30, 60);

    tree.find(20);
    const root = tree.root;
    assert.equal(tree.findAtOrNeighborStatic(10).data, 40);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findAtOrNeighborStatic(15).data === 40 || tree.findAtOrNeighborStatic(15).data === 50, true);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findAtOrNeighborStatic(20).data, 50);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findAtOrNeighborStatic(30).data, 60);
    assert.strictEqual(root, tree.root);

    assert.equal(tree.findAtOrNeighborStatic(80).data, 60);

    assert.equal(tree.findAtOrNeighborStatic(-20).data, 80);
    assert.equal(tree.findAtOrNeighborStatic(-30).data, 80);

    assert.strictEqual(tree.find(20), tree.root);
  });
});
