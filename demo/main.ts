import { initHero } from "./hero";

// Operations per second from `npm run bench` (Apple M3, Node 24.21). The
// first value of each row is splaytree, which gets the accent color.
const BENCHMARKS: [string, string, [string, string][]][] = [
  [
    "Insert",
    "1,000 keys",
    [
      ["splaytree", "28,139"],
      ["avl", "25,957"],
      ["bintrees RB", "20,084"],
    ],
  ],
  [
    "Insert, then remove",
    "1,000 keys",
    [
      ["splaytree", "12,120"],
      ["avl", "12,442"],
      ["bintrees RB", "9,355"],
    ],
  ],
  [
    "Uniformly random reads",
    "1,000 of 1,000 keys",
    [
      ["splaytree find", "24,587"],
      ["splaytree findStatic", "25,836"],
      ["avl", "48,480"],
      ["bintrees RB", "80,655"],
    ],
  ],
  [
    "Build a tree",
    "10,000 keys",
    [
      ["load(), presorted", "678"],
      ["insert() one by one", "434"],
    ],
  ],
  [
    "Add to a tree",
    "1,000 keys to 1,000",
    [
      ["load()", "20,129"],
      ["insert() one by one", "6,745"],
    ],
  ],
];

// The public API, as in dist/index.d.ts. `Node` stands for Node<Key, Value>.
const TYPES = `class SplayTree<Key = number, Value = unknown> {
  constructor(comparator?: Comparator<Key>);
}

interface Node<Key, Value> {
  key: Key;
  data: Value;
  left: Node<Key, Value> | null;
  right: Node<Key, Value> | null;
}

type Comparator<Key> = (a: Key, b: Key) => number;  // < 0, 0 or > 0
type Visitor<Key, Value> = (node: Node<Key, Value>) => boolean | void;

// Below, Node and Visitor stand for Node<Key, Value> and Visitor<Key, Value>`;

// [signature, description, splays]
const API: [string, [string, string, boolean?][]][] = [
  [
    "Insert and remove",
    [
      ["insert(key: Key, data?: Value): Node", "Adds a node, duplicate keys allowed.", true],
      [
        "add(key: Key, data?: Value): Node",
        "Adds a node only if the key is not in the tree yet. Returns the node with that key.",
        true,
      ],
      ["remove(key: Key): void", "Removes one node with this key, if there is one.", true],
      ["pop(): { key: Key; data: Value } | null", "Removes the node with the smallest key.", true],
      [
        "update(key: Key, newKey: Key, newData?: Value): void",
        "Moves a node to a new key, by split and merge.",
        true,
      ],
      [
        "load(keys: Key[], values?: Value[], presort?: boolean): this",
        "Bulk-loads sorted keys: builds a balanced tree, or merges them into a non-empty one. With <code>presort</code>, sorts both arrays in place first.",
      ],
      ["clear(): SplayTree<Key, Value>", "Removes every node."],
    ],
  ],
  [
    "Lookup",
    [
      ["find(key: Key): Node | null", "The node with this key. Moves it to the root.", true],
      ["findStatic(key: Key): Node | null", "The same lookup without splaying."],
      ["contains(key: Key): boolean", "Whether the key is in the tree."],
      ["at(index: number): Node | null", "The node at this position in key order."],
      ["min(): Key | null\nmax(): Key | null", "The smallest and the largest key."],
      [
        "minNode(): Node | null\nmaxNode(): Node | null",
        "The nodes with the smallest and the largest key.",
      ],
      [
        "prev(node: Node): Node | null\nnext(node: Node): Node | null",
        "The neighbours of a node in key order.",
      ],
    ],
  ],
  [
    "Walk and inspect",
    [
      [
        "forEach(fn: Visitor, ctx?: unknown): SplayTree<Key, Value>",
        "Visits every node in key order.",
      ],
      [
        "range(low: Key, high: Key, fn: Visitor, ctx?: unknown): SplayTree<Key, Value>",
        "Visits the nodes with keys from <code>low</code> to <code>high</code>, inclusive. Stops when <code>fn</code> returns a truthy value.",
      ],
      [
        "[Symbol.iterator](): Generator<Node>",
        "<code>for (const node of tree)</code> walks the nodes in key order.",
      ],
      ["keys(): Key[]\nvalues(): Value[]", "Keys and data, in key order."],
      [
        "split(key: Key): { left: Node | null; right: Node | null }",
        "Splits into the subtrees with smaller and larger keys.",
        true,
      ],
      [
        "readonly size: number\nreadonly root: Node | null\nisEmpty(): boolean",
        "Node count, root node, and whether the tree is empty.",
      ],
      [
        "toString(printNode?: (node: Node) => string): string",
        "The tree drawn as text, for debugging.",
      ],
    ],
  ],
];

const TYPE_WORDS =
  /\b(number|boolean|string|void|null|any|this|readonly|class|interface|type|constructor)\b|\b([A-Z]\w*)\b/g;

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Colors keywords and type names, and the member name at the start of a line
function highlight(code: string, members: boolean): string {
  return code
    .split("\n")
    .map((line) => {
      const comment = line.indexOf("//");
      const body = comment < 0 ? line : line.slice(0, comment);
      const rest = comment < 0 ? "" : `<span class="c">${escape(line.slice(comment))}</span>`;
      const types = (s: string) =>
        escape(s).replace(TYPE_WORDS, (m, keyword) =>
          keyword ? `<span class="k">${m}</span>` : `<span class="t">${m}</span>`,
        );
      const name = members ? /^(readonly )?(\[Symbol\.iterator\]|\w+)/.exec(body) : null;
      if (!name) return types(body) + rest;
      return (
        (name[1] ? `<span class="k">readonly</span> ` : "") +
        `<span class="fn">${name[2]}</span>` +
        types(body.slice(name[0].length)) +
        rest
      );
    })
    .join("\n");
}

function renderApi() {
  document.getElementById("api-types")!.innerHTML = highlight(TYPES, false);
  document.getElementById("api-list")!.innerHTML = API.map(
    ([group, rows]) =>
      `<h3>${group}</h3><dl>` +
      rows
        .map(
          ([signature, description, splays]) =>
            `<div class="row"><dt>${highlight(signature, true).replace(/\n/g, "<br>")}</dt>` +
            `<dd>${description}${splays ? '<span class="splays">splays</span>' : ""}</dd></div>`,
        )
        .join("") +
      "</dl>",
  ).join("");
}

function renderBench() {
  const container = document.getElementById("bench")!;
  container.innerHTML = BENCHMARKS.map(([name, size, rows]) => {
    const numbers = rows.map(([, v]) => Number(v.replace(/,/g, "")));
    const max = Math.max(...numbers);
    const bars = rows
      .map(
        ([label, v], i) =>
          `<div class="bar${label.startsWith("splaytree") || i === 0 ? " me" : ""}">` +
          `<span>${label}</span>` +
          `<i style="width:${((numbers[i] / max) * 100).toFixed(1)}%"></i>` +
          `<b>${v}</b></div>`,
      )
      .join("");
    return `<div><h3>${name}<span>${size}</span></h3>${bars}</div>`;
  }).join("");
}

function initCopy() {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy!);
        button.textContent = "copied";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = "copy";
          button.classList.remove("copied");
        }, 1500);
      } catch {
        button.textContent = "press ⌘C";
      }
    });
  }
}

initHero();
renderApi();
renderBench();
initCopy();
