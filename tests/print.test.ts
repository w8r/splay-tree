import { describe, it, expect } from "vitest";
import Tree from "../src/index";

describe("printing", () => {
  it("should print the tree", () => {
    const tree = new Tree();
    for (let i = 0; i < 3; i++) tree.insert(i);

    tree.find(2);
    expect(tree.toString()).toBe(`└── 2
    ├── 1
    │   ├── 0
`);
  });

  it("should print the balanced tree", () => {
    const tree = new Tree();
    for (let i = 0; i < 3; i++) tree.insert(i);

    tree.find(1);
    expect(tree.toString()).toBe(`└── 1
    ├── 0
    └── 2
`);
  });

  it("should print an empty tree as an empty string", () => {
    expect(new Tree().toString()).toBe("");
  });
});
