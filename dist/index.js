"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("./node");
/* follows "An implementation of top-down splaying"
 * by D. Sleator <sleator@cs.cmu.edu> March 1992
 */
function DEFAULT_COMPARE(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
/**
 * Simple top down splay, not requiring i to be in the tree t.
 */
function splay(i, t, comparator) {
    if (t === null)
        return t;
    var l, r, y;
    var N = new node_1.default(null, null);
    l = r = N;
    while (true) {
        var cmp = comparator(i, t.key);
        //if (i < t.key) {
        if (cmp < 0) {
            if (t.left === null)
                break;
            //if (i < t.left.key) {
            if (comparator(i, t.left.key) < 0) {
                y = t.left; /* rotate right */
                t.left = y.right;
                y.right = t;
                t = y;
                if (t.left === null)
                    break;
            }
            r.left = t; /* link right */
            r = t;
            t = t.left;
            //} else if (i > t.key) {
        }
        else if (cmp > 0) {
            if (t.right === null)
                break;
            //if (i > t.right.key) {
            if (comparator(i, t.right.key) > 0) {
                y = t.right; /* rotate left */
                t.right = y.left;
                y.left = t;
                t = y;
                if (t.right === null)
                    break;
            }
            l.right = t; /* link left */
            l = t;
            t = t.right;
        }
        else {
            break;
        }
    }
    /* assemble */
    l.right = t.left;
    r.left = t.right;
    t.left = N.right;
    t.right = N.left;
    return t;
}
function insert(i, data, t, comparator, tree) {
    var node = new node_1.default(i, data);
    tree._size++;
    if (t === null) {
        node.left = node.right = null;
        return node;
    }
    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);
    if (cmp < 0) {
        node.left = t.left;
        node.right = t;
        t.left = null;
    }
    else if (cmp >= 0) {
        node.right = t.right;
        node.left = t;
        t.right = null;
    }
    return node;
}
/**
 * Insert i into the tree t, unless it's already there.
 */
function add(i, data, t, comparator, tree) {
    var node = new node_1.default(i, data);
    if (t === null) {
        node.left = node.right = null;
        tree._size++;
        return node;
    }
    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);
    if (cmp === 0)
        return t;
    else {
        if (cmp < 0) {
            node.left = t.left;
            node.right = t;
            t.left = null;
        }
        else if (cmp > 0) {
            node.right = t.right;
            node.left = t;
            t.right = null;
        }
        tree._size++;
        return node;
    }
}
/**
 * Deletes i from the tree if it's there
 */
function remove(i, t, comparator, tree) {
    var x;
    if (t === null)
        return null;
    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);
    if (cmp === 0) { /* found it */
        if (t.left === null) {
            x = t.right;
        }
        else {
            x = splay(i, t.left, comparator);
            x.right = t.right;
        }
        tree._size--;
        return x;
    }
    return t; /* It wasn't there */
}
function split(key, v, comparator) {
    var left, right;
    if (v === null) {
        left = right = null;
    }
    else {
        v = splay(key, v, comparator);
        var cmp = comparator(v.key, key);
        if (cmp === 0) {
            left = v.left;
            right = v.right;
        }
        else if (cmp < 0) {
            right = v.right;
            v.right = null;
            left = v;
        }
        else {
            left = v.left;
            v.left = null;
            right = v;
        }
    }
    return { left: left, right: right };
}
function merge(left, right, comparator) {
    if (right === null)
        return left;
    if (left === null)
        return right;
    right = splay(left.key, right, comparator);
    right.left = left;
    return right;
}
/**
 * Prints level of the tree
 */
function printRow(root, prefix, isTail, out, printNode) {
    if (root) {
        out("" + prefix + (isTail ? '└── ' : '├── ') + printNode(root) + "\n");
        var indent = prefix + (isTail ? '    ' : '│   ');
        if (root.left)
            printRow(root.left, indent, false, out, printNode);
        if (root.right)
            printRow(root.right, indent, true, out, printNode);
    }
}
var Tree = /** @class */ (function () {
    function Tree(comparator) {
        if (comparator === void 0) { comparator = DEFAULT_COMPARE; }
        this._comparator = comparator;
        this._root = null;
        this._size = 0;
    }
    /**
     * Inserts a key, allows duplicates
     */
    Tree.prototype.insert = function (key, data) {
        return this._root = insert(key, data, this._root, this._comparator, this);
    };
    /**
     * Adds a key, if it is not present in the tree
     */
    Tree.prototype.add = function (key, data) {
        return this._root = add(key, data, this._root, this._comparator, this);
    };
    /**
     * @param  {Key} key
     * @return {Node|null}
     */
    Tree.prototype.remove = function (key) {
        this._root = remove(key, this._root, this._comparator, this);
    };
    /**
     * Removes and returns the node with smallest key
     */
    Tree.prototype.pop = function () {
        var node = this._root;
        if (node) {
            while (node.left)
                node = node.left;
            this._root = splay(node.key, this._root, this._comparator);
            this._root = remove(node.key, this._root, this._comparator, this);
            return { key: node.key, data: node.data };
        }
        return null;
    };
    /**
     * Find without splaying
     */
    Tree.prototype.findStatic = function (key) {
        var current = this._root;
        var compare = this._comparator;
        while (current) {
            var cmp = compare(key, current.key);
            if (cmp === 0)
                return current;
            else if (cmp < 0)
                current = current.left;
            else
                current = current.right;
        }
        return null;
    };
    Tree.prototype.find = function (key) {
        if (this._root) {
            this._root = splay(key, this._root, this._comparator);
            if (this._comparator(key, this._root.key) !== 0)
                return null;
        }
        return this._root;
    };
    Tree.prototype.contains = function (key) {
        var current = this._root;
        var compare = this._comparator;
        while (current) {
            var cmp = compare(key, current.key);
            if (cmp === 0)
                return true;
            else if (cmp < 0)
                current = current.left;
            else
                current = current.right;
        }
        return false;
    };
    Tree.prototype.forEach = function (visitor, ctx) {
        var current = this._root;
        var Q = []; /* Initialize stack s */
        var done = false;
        while (!done) {
            if (current !== null) {
                Q.push(current);
                current = current.left;
            }
            else {
                if (Q.length !== 0) {
                    current = Q.pop();
                    visitor.call(ctx, current);
                    current = current.right;
                }
                else
                    done = true;
            }
        }
        return this;
    };
    /**
     * Walk key range from `low` to `high`. Stops if `fn` returns a value.
     */
    Tree.prototype.range = function (low, high, fn, ctx) {
        var Q = [];
        var compare = this._comparator;
        var node = this._root, cmp;
        while (Q.length !== 0 || node) {
            if (node) {
                Q.push(node);
                node = node.left;
            }
            else {
                node = Q.pop();
                cmp = compare(node.key, high);
                if (cmp > 0) {
                    break;
                }
                else if (compare(node.key, low) >= 0) {
                    if (fn.call(ctx, node))
                        return this; // stop if smth is returned
                }
                node = node.right;
            }
        }
        return this;
    };
    /**
     * Returns array of keys
     */
    Tree.prototype.keys = function () {
        var keys = [];
        this.forEach(function (_a) {
            var key = _a.key;
            return keys.push(key);
        });
        return keys;
    };
    /**
     * Returns array of all the data in the nodes
     */
    Tree.prototype.values = function () {
        var values = [];
        this.forEach(function (_a) {
            var data = _a.data;
            return values.push(data);
        });
        return values;
    };
    Tree.prototype.min = function () {
        if (this._root)
            return this.minNode(this._root).key;
        return null;
    };
    Tree.prototype.max = function () {
        if (this._root)
            return this.maxNode(this._root).key;
        return null;
    };
    Tree.prototype.minNode = function (t) {
        if (t === void 0) { t = this._root; }
        if (t)
            while (t.left)
                t = t.left;
        return t;
    };
    Tree.prototype.maxNode = function (t) {
        if (t === void 0) { t = this._root; }
        if (t)
            while (t.right)
                t = t.right;
        return t;
    };
    /**
     * Returns node at given index
     */
    Tree.prototype.at = function (index) {
        var current = this._root, done = false, i = 0;
        var Q = [];
        while (!done) {
            if (current) {
                Q.push(current);
                current = current.left;
            }
            else {
                if (Q.length > 0) {
                    current = Q.pop();
                    if (i === index)
                        return current;
                    i++;
                    current = current.right;
                }
                else
                    done = true;
            }
        }
        return null;
    };
    Tree.prototype.next = function (d) {
        var root = this._root;
        var successor = null;
        if (d.right) {
            successor = d.right;
            while (successor.left)
                successor = successor.left;
            return successor;
        }
        var comparator = this._comparator;
        while (root) {
            var cmp = comparator(d.key, root.key);
            if (cmp === 0)
                break;
            else if (cmp < 0) {
                successor = root;
                root = root.left;
            }
            else
                root = root.right;
        }
        return successor;
    };
    Tree.prototype.prev = function (d) {
        var root = this._root;
        var predecessor = null;
        if (d.left !== null) {
            predecessor = d.left;
            while (predecessor.right)
                predecessor = predecessor.right;
            return predecessor;
        }
        var comparator = this._comparator;
        while (root) {
            var cmp = comparator(d.key, root.key);
            if (cmp === 0)
                break;
            else if (cmp < 0)
                root = root.left;
            else {
                predecessor = root;
                root = root.right;
            }
        }
        return predecessor;
    };
    Tree.prototype.clear = function () {
        this._root = null;
        this._size = 0;
        return this;
    };
    Tree.prototype.toList = function () {
        return toList(this._root);
    };
    /**
     * Bulk-load items. Both array have to be same size
     */
    Tree.prototype.load = function (keys, values, presort) {
        if (keys === void 0) { keys = []; }
        if (values === void 0) { values = []; }
        if (presort === void 0) { presort = false; }
        var size = keys.length;
        var comparator = this._comparator;
        // sort if needed
        if (presort)
            sort(keys, values, 0, size - 1, comparator);
        if (this._root === null) { // empty tree
            this._root = loadRecursive(keys, values, 0, size);
            this._size = size;
        }
        else { // that re-builds the whole tree from two in-order traversals
            var mergedList = mergeLists(this.toList(), createList(keys, values), comparator);
            size = this._size + size;
            this._root = sortedListToBST({ head: mergedList }, 0, size);
        }
        return this;
    };
    Tree.prototype.isEmpty = function () { return this._root === null; };
    Object.defineProperty(Tree.prototype, "size", {
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "root", {
        get: function () { return this._root; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param  {NodePrinter=} printNode
     * @return {String}
     */
    Tree.prototype.toString = function (printNode) {
        if (printNode === void 0) { printNode = function (n) { return String(n.key); }; }
        var out = [];
        printRow(this._root, '', true, function (v) { return out.push(v); }, printNode);
        return out.join('');
    };
    Tree.prototype.update = function (key, newKey, newData) {
        var comparator = this._comparator;
        var _a = split(key, this._root, comparator), left = _a.left, right = _a.right;
        this._size--;
        if (comparator(key, newKey) < 0) {
            right = insert(newKey, newData, right, comparator, this);
        }
        else {
            left = insert(newKey, newData, left, comparator, this);
        }
        this._root = merge(left, right, comparator);
    };
    Tree.prototype.split = function (key) {
        return split(key, this._root, this._comparator);
    };
    return Tree;
}());
exports.default = Tree;
function loadRecursive(keys, values, start, end) {
    var size = end - start;
    if (size > 0) {
        var middle = start + Math.floor(size / 2);
        var key = keys[middle];
        var data = values[middle];
        var node = new node_1.default(key, data);
        node.left = loadRecursive(keys, values, start, middle);
        node.right = loadRecursive(keys, values, middle + 1, end);
        return node;
    }
    return null;
}
function createList(keys, values) {
    var head = new node_1.default(null, null);
    var p = head;
    for (var i = 0; i < keys.length; i++) {
        p = p.next = new node_1.default(keys[i], values[i]);
    }
    p.next = null;
    return head.next;
}
function toList(root) {
    var current = root;
    var Q = [], done = false;
    var head = new node_1.default(null, null);
    var p = head;
    while (!done) {
        if (current) {
            Q.push(current);
            current = current.left;
        }
        else {
            if (Q.length > 0) {
                current = p = p.next = Q.pop();
                current = current.right;
            }
            else
                done = true;
        }
    }
    p.next = null; // that'll work even if the tree was empty
    return head.next;
}
function sortedListToBST(list, start, end) {
    var size = end - start;
    if (size > 0) {
        var middle = start + Math.floor(size / 2);
        var left = sortedListToBST(list, start, middle);
        var root = list.head;
        root.left = left;
        list.head = list.head.next;
        root.right = sortedListToBST(list, middle + 1, end);
        return root;
    }
    return null;
}
function mergeLists(l1, l2, compare) {
    if (compare === void 0) { compare = DEFAULT_COMPARE; }
    var head = new node_1.default(null, null); // dummy
    var p = head;
    var p1 = l1;
    var p2 = l2;
    while (p1 !== null && p2 !== null) {
        if (compare(p1.key, p2.key) < 0) {
            p.next = p1;
            p1 = p1.next;
        }
        else {
            p.next = p2;
            p2 = p2.next;
        }
        p = p.next;
    }
    if (p1 !== null)
        p.next = p1;
    else if (p2 !== null)
        p.next = p2;
    return head.next;
}
function sort(keys, values, left, right, compare) {
    if (left >= right)
        return;
    var pivot = keys[(left + right) >> 1];
    var i = left - 1;
    var j = right + 1;
    while (true) {
        do
            i++;
        while (compare(keys[i], pivot) < 0);
        do
            j--;
        while (compare(keys[j], pivot) > 0);
        if (i >= j)
            break;
        var tmp = keys[i];
        keys[i] = keys[j];
        keys[j] = tmp;
        tmp = values[i];
        values[i] = values[j];
        values[j] = tmp;
    }
    sort(keys, values, left, j, compare);
    sort(keys, values, j + 1, right, compare);
}
