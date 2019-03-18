export default class Node<Key, Value> {
    key: Key;
    data: any;
    left: Node<Key, Value> | null;
    right: Node<Key, Value> | null;
    next: Node<Key, Value> | null;
    constructor(key: Key, data?: any);
}
