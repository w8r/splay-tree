import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("bulk-load", () => {
  it("should allow bulk-insert", () => {
    const tree = new Tree();
    const keys = [1, 2, 3, 4];
    const values = [4, 3, 2, 1];
    tree.load(keys, values);

    expect(tree.keys()).toEqual(keys);
    expect(tree.values()).toEqual(values);
  });

  it("should allow bulk-insert without values", () => {
    const tree = new Tree();
    const keys = [1, 2, 3, 4];
    tree.load(keys);

    expect(tree.keys()).toEqual(keys);
    expect(tree.values()).toEqual(keys.map(() => undefined));
  });

  it("should be able to load into a tree with contents", () => {
    const t = new Tree();
    t.load([22, 56, 0, -10, 12], undefined, true);

    t.load([100, 500, -400, 20, 10], undefined, true);
    expect(t.keys()).toEqual([-400, -10, 0, 10, 12, 20, 22, 56, 100, 500]);
  });

  it("should be able to load less contents into a tree with contents", () => {
    const t = new Tree();
    t.load([100, 500, -400, 20, 10], undefined, true);

    t.load([22], undefined, true);
    expect(t.keys()).toEqual([-400, 10, 20, 22, 100, 500]);
  });

  it("should be able to load more contents into a tree with less contents", () => {
    const t = new Tree();
    t.load([22], undefined, true);

    t.load([100, 500, -400, 20, 10], undefined, true);
    expect(t.keys()).toEqual([-400, 10, 20, 22, 100, 500]);
  });

  it("should be able to load into a tree with contents (interleave)", () => {
    const t = new Tree();
    t.load(Array.from({ length: 10 }, (_, i) => i * 10));
    t.load(Array.from({ length: 10 }, (_, i) => 5 + 10 * i));
    expect(t.keys()).toEqual(Array.from({ length: 20 }, (_, i) => 5 * i));
  });
});
