export type Node<Key extends any, Value extends any> = {
  parent?:       Node<Key, Value>,
  left?:         Node<Key, Value>,
  right?:        Node<Key, Value>,
  balanceFactor: number,
  key?:          Key,
  data?:         Value
};
export type Comparator<Key> = (a: Key, b: Key) => number
export type ForEachCallback<Key, Value> = (node: Node<Key, Value>, index: number) => void

export default class SplayTree<Key extends any, Value extends any> {
  constructor (comparator?: Comparator<Key>, noDuplicates?: boolean);
  size: number;
  insert(key: Key, data?: Value): void;
  remove(key: Key): Node<Key, Value>;
  find(key: Key): Node<Key, Value>;
  at(index: number): Node<Key, Value>;
  contains(key: Key): boolean;
  isEmpty(): boolean;
  keys(): Array<Key>;
  values(): Array<Value>;
  pop(): Node<Key, Value>;
  min(): Key;
  max(): Key;
  minNode(): Node<Key, Value>;
  maxNode(): Node<Key, Value>;
  forEach(callback: ForEachCallback<Key, Value>): SplayTree<Key, Value>;
  load(keys: Array<Key>, values?:Array<Value>): SplayTree<Key, Value>;
  prev(node: Node<Key, Value>): Node<Key, Value>;
  next(node: Node<Key, Value>): Node<Key, Value>;
  isBalanced(): boolean;
  toString(): string;
  destroy(): SplayTree<Key, Value>;
}
