import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("contains check", () => {
  it("should return false if the tree is empty", () => {
    const tree = new Tree();
    expect(tree.contains(1)).toBe(false);
  });

  it("should return whether the tree contains a node", () => {
    const tree = new Tree();
    expect(tree.contains(1)).toBe(false);
    expect(tree.contains(2)).toBe(false);
    expect(tree.contains(3)).toBe(false);
    tree.insert(3);
    tree.insert(1);
    tree.insert(2);
    expect(tree.contains(1)).toBe(true);
    expect(tree.contains(2)).toBe(true);
    expect(tree.contains(3)).toBe(true);
  });

  it("should return false when the expected parent has no children", () => {
    const tree = new Tree();
    tree.insert(2);
    expect(tree.contains(1)).toBe(false);
    expect(tree.contains(3)).toBe(false);
  });
});
