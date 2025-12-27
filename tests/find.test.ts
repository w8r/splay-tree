import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("find", () => {
  it("should return key as the result of search", () => {
    const tree = new Tree<number, any>();
    expect(tree.find(1)).toBeNull();
    expect(tree.find(2)).toBeNull();
    expect(tree.find(3)).toBeNull();
    tree.insert(1, 4);
    tree.insert(2, 5);
    tree.insert(3, 6);

    let root = tree.root;
    expect(tree.find(1)!.data).toBe(4);
    expect(root).not.toBe(tree.root);
    root = tree.root;

    expect(tree.find(2)!.data).toBe(5);
    expect(root).not.toBe(tree.root);
    root = tree.root;

    expect(tree.find(3)!.data).toBe(6);
    expect(root).not.toBe(tree.root);
    root = tree.root;

    expect(tree.find(8)).toBeNull();
    expect(root).toBe(tree.root);
  });

  it("should allow finding node without splaying", () => {
    const tree = new Tree<number, any>();
    expect(tree.findStatic(1)).toBeNull();
    expect(tree.findStatic(2)).toBeNull();
    expect(tree.findStatic(3)).toBeNull();
    tree.insert(-2, 8);
    tree.insert(1, 4);
    tree.insert(2, 5);
    tree.insert(3, 6);

    tree.find(2);
    const root = tree.root;
    expect(tree.findStatic(1)!.data).toBe(4);
    expect(root).toBe(tree.root);

    expect(tree.findStatic(2)!.data).toBe(5);
    expect(root).toBe(tree.root);

    expect(tree.findStatic(3)!.data).toBe(6);
    expect(root).toBe(tree.root);

    expect(tree.findStatic(-2)!.data).toBe(8);

    expect(tree.find(2)).toBe(tree.root);
  });
});
