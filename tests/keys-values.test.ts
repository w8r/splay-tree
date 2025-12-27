import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("Keys and values", () => {
  it("should return sorted keys", () => {
    const t = new Tree((a, b) => b - a);
    t.insert(5);
    t.insert(-10);
    t.insert(0);
    t.insert(33);
    t.insert(2);

    expect(t.keys()).toEqual([33, 5, 2, 0, -10]);
  });

  it("should return sorted keys", () => {
    const t = new Tree();
    t.insert(5);
    t.insert(-10);
    t.insert(0);
    t.insert(33);
    t.insert(2);

    expect(t.keys()).toEqual([-10, 0, 2, 5, 33]);
  });

  it("should return sorted values", () => {
    const t = new Tree();
    t.insert(5, "D");
    t.insert(-10, "A");
    t.insert(0, "B");
    t.insert(33, "E");
    t.insert(2, "C");

    expect(t.keys()).toEqual([-10, 0, 2, 5, 33]);
    expect(t.values()).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("should return sorted values", () => {
    const t = new Tree((a, b) => b - a);
    t.insert(5, "D");
    t.insert(-10, "A");
    t.insert(0, "B");
    t.insert(33, "E");
    t.insert(2, "C");

    expect(t.keys()).toEqual([33, 5, 2, 0, -10]);
    expect(t.values()).toEqual(["E", "D", "C", "B", "A"]);
  });

  it("should return sorted values after bulk insert", () => {
    const t = new Tree();
    t.load([5, -10, 0, 33, 2], ["D", "A", "B", "E", "C"], true);

    expect(t.keys()).toEqual([-10, 0, 2, 5, 33]);
    expect(t.values()).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("should be able to bulk-load 10000 items", () => {
    const t = new Tree();
    const N = 1e4;

    const keys = Array.from({ length: N }, (_, i) => i);

    t.load(keys, undefined);
    expect(t.keys().slice(0, 20)).toEqual(keys.slice(0, 20));
  });
});
