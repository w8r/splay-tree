import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../src/index';

describe ('printing', () => {

  it ('should print the tree', () => {
    const tree = new Tree();
    for (let i = 0; i < 3; i++) tree.insert(i);

    //tree.find(2);
    assert.equal(tree.toString(), `└── 2
    ├── 1
    │   ├── 0
`);
  });
});
