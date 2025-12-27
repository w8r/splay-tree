import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("iterate check", () => {
  it("should iterate the tree in order", () => {
    const tree = new Tree();
    tree.insert(3);
    tree.insert(1);
    tree.insert(0);
    tree.insert(2);

    let i = 0;
    for (const n of tree) {
      expect(n.key).toBe(i++);
    }
    expect(i).toBe(4);
  });

  it("should should support empty tree", () => {
    const tree = new Tree();

    let i = 0;
    for (const n of tree) {
      expect(n.key).toBe(i++);
    }
    expect(i).toBe(0);
  });
});
