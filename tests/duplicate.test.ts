import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("Duplicate keys", () => {
  it("should allow inserting of duplicate key", () => {
    const tree = new Tree<number, any>();
    const values = [2, 12, 1, -6, 1];

    values.forEach((v) => {
      tree.insert(v);
    });

    expect(tree.keys()).toEqual([-6, 1, 1, 2, 12]);
    expect(tree.size).toBe(5);
  });

  it("should allow multiple duplicate keys in a row", () => {
    const tree = new Tree();
    const values = [2, 12, 1, 1, -6, 2, 1, 1, 13];

    values.forEach((v) => {
      tree.insert(v);
    });

    expect(tree.keys()).toEqual([-6, 1, 1, 1, 1, 2, 2, 12, 13]);
    expect(tree.size).toBe(9);
  });

  it("should remove from a tree with duplicate keys correctly", () => {
    const tree = new Tree();
    const values = [2, 12, 1, 1, -6, 1, 1];

    values.forEach((v) => tree.insert(v));

    let size = tree.size;
    for (let i = 0; i < 4; i++) {
      tree.remove(1);

      if (i < 3) expect(tree.contains(1)).toBe(true);
      expect(tree.size).toBe(--size);
    }

    expect(tree.contains(1)).toBe(false);
  });

  it("should remove from a tree with multiple duplicate keys correctly", () => {
    const tree = new Tree();
    const values = [2, 12, 1, 1, -6, 1, 1, 2, 0, 2];

    values.forEach((v) => tree.insert(v));

    let size = tree.size;
    while (!tree.isEmpty()) {
      tree.pop();
      expect(tree.size).toBe(--size);
    }
  });

  it("should remove only one node when the key has duplicates (#43)", () => {
    const tree = new Tree<number, string>();
    [2, 2, 2, 1, 3].forEach((k, i) => tree.insert(k, `d${i}`));

    tree.remove(2);
    expect(tree.keys()).toEqual([1, 2, 2, 3]);
    expect(tree.size).toBe(4);
  });

  it("should keep size and keys in sync when removing shuffled duplicates", () => {
    const tree = new Tree();
    const keys: number[] = [];
    for (let k = 0; k < 200; k++) {
      for (let i = 0; i < 3; i++) {
        tree.insert(k);
        keys.push(k);
      }
    }
    // deterministic shuffle
    let seed = 1;
    for (let i = keys.length - 1; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    const expected = keys.slice().sort((a, b) => a - b);
    for (const k of keys) {
      tree.remove(k);
      expected.splice(expected.indexOf(k), 1);
      expect(tree.keys()).toEqual(expected);
      expect(tree.size).toBe(expected.length);
    }
  });

  it("should pop every node once when keys have duplicates", () => {
    const tree = new Tree<number, string>();
    tree.insert(4, "a");
    tree.insert(4, "b");
    tree.insert(5, "c");
    tree.insert(4, "d");

    const popped: string[] = [];
    let node;
    while ((node = tree.pop())) popped.push(`${node.key}${node.data}`);
    expect(popped.sort()).toEqual(["4a", "4b", "4d", "5c"]);
    expect(tree.size).toBe(0);
  });

  it("should not lose nodes when updating a key that has duplicates", () => {
    const tree = new Tree<number, string>();
    [3, 3, 3, 3, 2].forEach((k, i) => tree.insert(k, `d${i}`));

    tree.update(3, 3, "new");
    expect(tree.keys()).toEqual([2, 3, 3, 3, 3]);
    expect(tree.values()).toContain("new");
    expect(tree.size).toBe(5);
  });

  it("should disallow duplicates if noDuplicates is set", () => {
    const tree = new Tree();
    const values = [2, 12, 1, -6, 1];

    values.forEach((v) => {
      tree.add(v);
    });

    expect(tree.keys()).toEqual([-6, 1, 2, 12]);
    expect(tree.size).toBe(4);
  });

  it("should add only if the key is not there", () => {
    const tree = new Tree();
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);

    const s = tree.size;
    tree.add(1);
    expect(tree.size).toBe(s);
  });
});
