export type Node<Key extends any, Value extends any> = {
  parent?:       Node<Key, Value>,
  left?:         Node<Key, Value>,
  right?:        Node<Key, Value>,
  balanceFactor: number,
  key?:          Key,
  data?:         Value
};

export type Comparator<Key> = (a: Key, b: Key) => number;
export type TraverseCallback<Key, Value> = (node: Node<Key, Value>) => (void | boolean);
export type PrintNode<Key, Value> = (node: Node<Key, Value>) => string;

export default class SplayTree<Key extends any, Value extends any> {
  constructor (comparator?: Comparator<Key>);
  size: number;
  insert (key: Key, data?: Value): Node<Key, Value>;
  add (key: Key, data?: Value): Node<Key, Value>;
  remove (key: Key): boolean;
  find (key: Key): Node<Key, Value>;
  at (index: number): Node<Key, Value>;
  contains (key: Key): boolean;
  isEmpty (): boolean;
  keys (): Array<Key>;
  values (): Array<Value>;
  range (minKey:Key, maxKey:Key, visit:TraverseCallback<Key, Value>, context?:any);
  pop (): Node<Key, Value>;
  min (): Key;
  max (): Key;
  minNode (): Node<Key, Value>;
  maxNode (): Node<Key, Value>;
  forEach (callback: TraverseCallback<Key, Value>): SplayTree<Key, Value>;
  load (keys: Array<Key>, values?:Array<Value>, presort?:Boolean): SplayTree<Key, Value>;
  update (key: Key, newKey:Key, newData?: Value):void;
  prev (node: Node<Key, Value>): Node<Key, Value>;
  next (node: Node<Key, Value>): Node<Key, Value>;
  toString (printNode?: PrintNode<Key,Value>): string;
  destroy (): SplayTree<Key, Value>;
}
