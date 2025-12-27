import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("remove", () => {
  it("should not change the size of empty tree", () => {
    const tree = new Tree();
    tree.remove(1);
    expect(tree.size).toBe(0);
  });

  it("should remove a single key", () => {
    const tree = new Tree();
    tree.insert(1);
    tree.remove(1);
    expect(tree.isEmpty()).toBe(true);
  });

  it("should ignore a single key which is not there", () => {
    const tree = new Tree();
    tree.insert(1);
    tree.remove(2);
    expect(tree.size).toBe(1);
  });

  it("should take the right child if the left does not exist", () => {
    const tree = new Tree();
    tree.insert(1);
    tree.insert(2);
    tree.remove(1);
    expect(tree.root!.key).toBe(2);
  });

  it("should take the left child if the right does not exist", () => {
    const tree = new Tree();
    tree.insert(2);
    tree.insert(1);
    tree.remove(2);
    expect(tree.root!.key).toBe(1);
  });

  it("should not break the existing pointers to nodes", () => {
    const tree = new Tree();

    tree.insert(1);
    const n2 = tree.insert(2);
    const n3 = tree.insert(3);

    tree.remove(2);

    expect(n2.key).toBe(2);
    expect(n3.key).toBe(3);
  });

  it("pop()", () => {
    const tree = new Tree();
    tree.insert(2);
    tree.insert(1);
    tree.remove(2);

    const removed = tree.pop();
    expect(removed).toEqual({ key: 1, data: undefined });
    expect(tree.pop()).toBeNull();
  });

  it("should support clear operation", () => {
    const tree = new Tree();
    tree.insert(2);
    tree.insert(1);
    tree.remove(2);

    tree.clear();

    expect(tree.root).toBeNull();
    expect(tree.size).toBe(0);
  });
});
