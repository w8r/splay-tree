import { describe, it, expect } from "vitest";
import Tree from "../src/index";
import Node from "../src/node";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function count(tree: Node<number, any>, size = 0) {
  if (tree)
    size += count(tree.left as any, size) + count(tree.right as any, size);
  return size;
}

function toArray(tree: Node<number, any>, arr: number[] = []) {
  if (tree) {
    toArray(tree.left as any, arr);
    arr.push(tree.key);
    toArray(tree.right as any, arr);
  }
  return arr;
}

function createTree(values: any[]) {
  const t = new Tree();
  values.forEach((v) => t.insert(v));
  return t;
}

describe("update", () => {
  it("split", () => {
    let t, split;

    t = createTree([1, 2, 3]);
    split = t.split(0);
    expect(split.left).toBeNull();
    expect(toArray(split.right!)).toEqual([1, 2, 3]);

    t = createTree([1, 2, 3]);
    split = t.split(2.5);
    expect(toArray(split.left!)).toEqual([1, 2]);
    expect(toArray(split.right!)).toEqual([3]);

    t = createTree([1, 2, 3]);
    split = t.split(2);
    expect(toArray(split.left!)).toEqual([1]);
    expect(toArray(split.right!)).toEqual([3]);

    t = createTree([1, 2, 3]);
    split = t.split(1);
    expect(toArray(split.left!)).toEqual([]);
    expect(toArray(split.right!)).toEqual([2, 3]);

    t = createTree([1, 2, 3]);
    split = t.split(3);
    expect(toArray(split.left!)).toEqual([1, 2]);
    expect(toArray(split.right!)).toEqual([]);
  });

  it("merge", () => {
    const t = createTree([1, 2, 3, 4, 5]);
    t.update(3, 6);
    expect(t.keys()).toEqual([1, 2, 4, 5, 6]);
    t.update(2, 0);
    expect(t.keys()).toEqual([0, 1, 4, 5, 6]);
    t.update(0, 7);
    expect(t.keys()).toEqual([1, 4, 5, 6, 7]);
    t.update(7, -3);
    expect(t.keys()).toEqual([-3, 1, 4, 5, 6]);
  });
});
