export default class Node<Key, Value> {
  public key: Key;
  public data: Value;
  public left: Node<Key, Value> | null = null;
  public right: Node<Key, Value> | null = null;
  public next: Node<Key, Value> | null = null;

  constructor(key: Key, data?: Value) {
    this.key = key;
    // insert(key) without data leaves it undefined, as before
    this.data = data as Value;
  }
}
