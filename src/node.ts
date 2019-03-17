
export default class Node<Key, Value> {
  public key:Key;
  public data:any;
  public left:Node<Key, Value>|null;
  public right:Node<Key, Value>|null;
  public next:Node<Key, Value>|null = null;

  constructor (key:Key, data?:any) {
    this.key    = key;
    this.data   = data;
    this.left   = null;
    this.right  = null;
  }
}