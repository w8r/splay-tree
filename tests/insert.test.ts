import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("insert", () => {
  it("should return the size of the tree", () => {
    const tree = new Tree<number, any>();
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);
    expect(tree.size).toBe(5);
  });

  it("should return the pointer", () => {
    const tree = new Tree();
    const n1 = tree.insert(1);
    const n2 = tree.insert(2);
    const n3 = tree.insert(3);

    expect(n1.key).toBe(1);
    expect(n2.key).toBe(2);
    expect(n3.key).toBe(3);
  });
});
