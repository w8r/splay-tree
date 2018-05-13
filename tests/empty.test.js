import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../index';

describe ('empty check', () => {

  it ('should return whether the tree is empty', () => {
    const tree = new Tree();

    assert.isTrue(tree.isEmpty());
    tree.insert(1);
    assert.isFalse(tree.isEmpty());
    tree.remove(1);
    assert.isTrue(tree.isEmpty());
  });
});
