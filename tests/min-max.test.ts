import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("find min and max", () => {
  it("should return the maximum key in the tree", () => {
    const tree = new Tree();
    tree.insert(3);
    tree.insert(5);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    expect(tree.max()).toBe(5);
  });

  it("should return null for max if the tree is empty", () => {
    const tree = new Tree();
    expect(tree.max()).toBeNull();
  });

  it("should return the minimum key in the tree", () => {
    const tree = new Tree();
    tree.insert(5);
    tree.insert(3);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    expect(tree.min()).toBe(1);
  });

  it("should return the max node", () => {
    const tree = new Tree();
    tree.insert(3);
    tree.insert(5, 10);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    const node = tree.maxNode();
    expect(node!.key).toBe(5);
    expect(node!.data).toBe(10);
  });

  it("should return null for maxNode if the tree is empty", () => {
    const tree = new Tree();
    expect(tree.maxNode()).toBeNull();
  });

  it("should return the min node", () => {
    const tree = new Tree();
    tree.insert(5);
    tree.insert(3);
    tree.insert(1, 20);
    tree.insert(4);
    tree.insert(2);
    const node = tree.minNode();
    expect(node!.key).toBe(1);
    expect(node!.data).toBe(20);
  });

  it("should return null for min if the tree is empty", () => {
    const tree = new Tree();
    expect(tree.min()).toBeNull();
  });

  it("should support removing min node", () => {
    const tree = new Tree();
    tree.insert(5);
    tree.insert(3);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    expect(tree.pop()!.key).toBe(1);
  });

  it("should return null for minNode if the tree is empty", () => {
    const tree = new Tree();
    expect(tree.minNode()).toBeNull();
  });
});
