import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("empty check", () => {
  it("should return whether the tree is empty", () => {
    const tree = new Tree<number, any>();

    expect(tree.isEmpty()).toBe(true);
    tree.insert(1);
    expect(tree.isEmpty()).toBe(false);
    tree.remove(1);
    expect(tree.isEmpty()).toBe(true);
  });
});
