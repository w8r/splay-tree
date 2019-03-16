import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../dist/splay';

describe ('find', () => {

  it('should return key as the result of search', () => {
    const tree = new Tree();
    assert.equal(tree.find(1), null);
    assert.equal(tree.find(2), null);
    assert.equal(tree.find(3), null);
    tree.insert(1, 4);
    tree.insert(2, 5);
    tree.insert(3, 6);
    assert.equal(tree.find(1).data, 4);
    assert.equal(tree.find(2).data, 5);
    assert.equal(tree.find(3).data, 6);
    assert.isNull(tree.find(8));
  });
});
