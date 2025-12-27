import { describe, it, expect } from "vitest";
import Tree from "../src/index";

function shuffle(array: any[]) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

declare type Obj = { value: number };

describe("custom comparator", () => {
  it("should function correctly given a non-reverse customCompare", () => {
    const tree = new Tree((a, b) => b - a);
    tree.insert(2);
    tree.insert(1);
    tree.insert(3);
    expect(tree.size).toBe(3);
    expect(tree.min()).toBe(3);
    expect(tree.max()).toBe(1);
    tree.remove(3);
    expect(tree.size).toBe(2);
    expect(tree.root!.key).toBe(2);
    expect(tree.root!.left).toBeNull();
    expect(tree.root!.right!.key).toBe(1);
  });

  it("should support custom keys", () => {
    const comparator = (a: Obj, b: Obj) => a.value - b.value;
    const tree = new Tree<Obj>(comparator);
    const objects = Array.from({ length: 10 })
      .fill(0)
      .map((n, i) => {
        return { value: i, data: Math.pow(i, 2) };
      });
    shuffle(objects);

    objects.forEach((o) => tree.insert(o));

    expect(tree.keys().map((k) => k.value)).toEqual(
      objects
        .slice()
        .sort(comparator)
        .map((k) => k.value)
    );
  });
});
