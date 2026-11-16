// bintrees ships no types; the benchmark only uses insert, find and remove
declare module "bintrees" {
  export class RBTree<T> {
    constructor(comparator: (a: T, b: T) => number);
    insert(item: T): boolean;
    remove(item: T): boolean;
    find(item: T): T | null;
  }
}
