import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../src/index';

function shuffle(array:any[]) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

declare type Obj = { value: number };

describe('custom comparator', () => {

  it ('should function correctly given a non-reverse customCompare', () => {
    const tree = new Tree((a, b) => b - a);
    tree.insert(2);
    tree.insert(1);
    tree.insert(3);
    assert.equal(tree.size, 3);
    assert.equal(tree.min(), 3);
    assert.equal(tree.max(), 1);
    tree.remove(3);
    assert.equal(tree.size, 2);
    assert.equal(tree.root.key, 2);
    assert.equal(tree.root.left, null);
    assert.equal(tree.root.right.key, 1);
  });


  it ('should support custom keys', () => {
    
    const comparator = (a:Obj, b:Obj) => a.value - b.value;
    const tree = new Tree<Obj>(comparator);
    const objects = new Array(10).fill(0).map((n, i) => {
      return { value: i, data: Math.pow(i, 2) };
    });
    shuffle(objects);

    objects.forEach((o) => tree.insert(o));

    assert.deepEqual(
      tree.keys().map(k => k.value),
      objects.slice().sort(comparator).map(k => k.value)
    );
  });

});
