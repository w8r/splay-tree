import Node from './node';
import { Key } from './types';
export declare type Comparator<Key> = (a: Key, b: Key) => number;
export declare type Visitor<Key, Value> = (node: Node<Key, Value>) => void;
export declare type NodePrinter<Key, Value> = (node: Node<Key, Value>) => string;
declare function DEFAULT_COMPARE(a: Key, b: Key): number;
export default class Tree<Key = number, Value = any> {
    private _comparator;
    private _root;
    private _size;
    constructor(comparator?: typeof DEFAULT_COMPARE);
    /**
     * Inserts a key, allows duplicates
     */
    insert(key: Key, data?: Value): Node<Key, Value>;
    /**
     * Adds a key, if it is not present in the tree
     */
    add(key: Key, data?: Value): Node<Key, Value>;
    /**
     * @param  {Key} key
     * @return {Node|null}
     */
    remove(key: Key): void;
    /**
     * Deletes i from the tree if it's there
     */
    private _remove;
    /**
     * Removes and returns the node with smallest key
     */
    pop(): {
        key: Key;
        data: Value;
    } | null;
    /**
     * Find without splaying
     */
    findStatic(key: Key): Node<Key, Value> | null;
    find(key: Key): Node<Key, Value> | null;
    contains(key: Key): boolean;
    forEach(visitor: Visitor<Key, Value>, ctx?: any): Tree<Key, Value>;
    /**
     * Walk key range from `low` to `high`. Stops if `fn` returns a value.
     */
    range(low: Key, high: Key, fn: Visitor<Key, Value>, ctx?: any): Tree<Key, Value>;
    /**
     * Returns array of keys
     */
    keys(): Key[];
    /**
     * Returns array of all the data in the nodes
     */
    values(): Value[];
    min(): Key | null;
    max(): Key | null;
    minNode(t?: Node<Key, Value>): Node<Key, Value>;
    maxNode(t?: Node<Key, Value>): Node<Key, Value>;
    /**
     * Returns node at given index
     */
    at(index: number): Node<Key, Value> | null;
    next(d: Node<Key, Value>): Node<Key, Value> | null;
    prev(d: Node<Key, Value>): Node<Key, Value> | null;
    clear(): Tree<Key, Value>;
    toList(): Node<any, any>;
    /**
     * Bulk-load items. Both array have to be same size
     */
    load(keys: Key[], values?: Value[], presort?: boolean): this;
    isEmpty(): boolean;
    readonly size: number;
    readonly root: Node<Key, Value> | null;
    toString(printNode?: NodePrinter<Key, Value>): string;
    update(key: Key, newKey: Key, newData?: Value): void;
    split(key: Key): {
        left: Node<any, any>;
        right: Node<any, any>;
    };
}
export {};
