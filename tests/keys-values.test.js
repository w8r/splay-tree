import { describe, it } from 'mocha';
import { assert }       from 'chai';

import Tree from '../index';

describe('Keys and values', () => {

  it ('should return sorted keys', () => {
    const t = new Tree((a, b) => b - a);
    t.insert(5);
    t.insert(-10);
    t.insert(0);
    t.insert(33);
    t.insert(2);

    assert.deepEqual(t.keys(), [33, 5, 2, 0, -10]);
  });

  it ('should return sorted keys', () => {
    const t = new Tree();
    t.insert(5);
    t.insert(-10);
    t.insert(0);
    t.insert(33);
    t.insert(2);

    assert.deepEqual(t.keys(), [-10, 0, 2, 5, 33]);
  });

  it ('should return sorted values', () => {
    const t = new Tree();
    t.insert(5,   'D');
    t.insert(-10, 'A');
    t.insert(0,   'B');
    t.insert(33,  'E');
    t.insert(2,   'C');

    assert.deepEqual(t.keys(), [-10, 0, 2, 5, 33]);
    assert.deepEqual(t.values(), ['A', 'B', 'C', 'D', 'E']);
  });

  it ('should return sorted values', () => {
    const t = new Tree((a, b) => b - a);
    t.insert(5,   'D');
    t.insert(-10, 'A');
    t.insert(0,   'B');
    t.insert(33,  'E');
    t.insert(2,   'C');

    assert.deepEqual(t.keys(), [33, 5, 2, 0, -10]);
    assert.deepEqual(t.values(), ['E', 'D', 'C', 'B', 'A']);
  });

  it ('should return sorted values after bulk insert', () => {
    const t = new Tree();
    t.load([5, -10, 0, 33, 2], ['D', 'A', 'B', 'E', 'C'], true);

    assert.deepEqual(t.keys(), [-10, 0, 2, 5, 33]);
    assert.deepEqual(t.values(), ['A', 'B', 'C', 'D', 'E']);
  });


  // here we are testing recursion approach
  it ('should be able to bulk-load 10000 items', () => {
    const t = new Tree();
    const N = 1e4;

    const keys = new Array(N);
    for (let i = 0; i < N; i++) {
      keys[i] = i;
    }

    //console.time('load');
    t.load(keys, undefined);
    //console.timeEnd('load');

    assert.deepEqual(t.keys().slice(0,20), keys.slice(0, 20));
  });

});
