/**
 * splaytree v2.0.3
 * Fast Splay tree for Node and browser
 *
 * @author Alexander Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.SplayTree = factory());
}(this, (function () { 'use strict';

  /* follows "An implementation of top-down splaying"
   * by D. Sleator <sleator@cs.cmu.edu> March 1992
   */

  /**
   * @typedef {*} Key
   */


  /**
   * @typedef {*} Value
   */


  /**
   * @typedef {function(node:Node):void} Visitor
   */


  /**
   * @typedef {function(a:Key, b:Key):number} Comparator
   */


  /**
   * @param {function(node:Node):string} NodePrinter
   */


  /**
   * @typedef {Object}  Node
   * @property {Key}    Key
   * @property {Value=} data
   * @property {Node}   left
   * @property {Node}   right
   */

  var Node = function Node (key, data) {
    this.key  = key;
    this.data = data;
    this.left = null;
    this.right= null;
  };

  function DEFAULT_COMPARE (a, b) { return a > b ? 1 : a < b ? -1 : 0; }


  /**
   * Simple top down splay, not requiring i to be in the tree t.
   * @param {Key} i
   * @param {Node?} t
   * @param {Comparator} comparator
   */
  function splay (i, t, comparator) {
    if (t === null) { return t; }
    var l, r, y;
    var N = new Node();
    l = r = N;

    while (true) {
      var cmp = comparator(i, t.key);
      //if (i < t.key) {
      if (cmp < 0) {
        if (t.left === null) { break; }
        //if (i < t.left.key) {
        if (comparator(i, t.left.key) < 0) {
          y = t.left;                           /* rotate right */
          t.left = y.right;
          y.right = t;
          t = y;
          if (t.left === null) { break; }
        }
        r.left = t;                               /* link right */
        r = t;
        t = t.left;
      //} else if (i > t.key) {
      } else if (cmp > 0) {
        if (t.right === null) { break; }
        //if (i > t.right.key) {
        if (comparator(i, t.right.key) > 0) {
          y = t.right;                          /* rotate left */
          t.right = y.left;
          y.left = t;
          t = y;
          if (t.right === null) { break; }
        }
        l.right = t;                              /* link left */
        l = t;
        t = t.right;
      } else {
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


  /**
   * @param  {Key}        i
   * @param  {Value}      data
   * @param  {Comparator} comparator
   * @param  {Tree}       tree
   * @return {Node}      root
   */
  function insert (i, data, t, comparator, tree) {
    var node = new Node(i, data);

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
    } else if (cmp >= 0) {
      node.right = t.right;
      node.left = t;
      t.right = null;
    }
    return node;
  }


  /**
   * Insert i into the tree t, unless it's already there.
   * @param  {Key}        i
   * @param  {Value}      data
   * @param  {Comparator} comparator
   * @param  {Tree}       tree
   * @return {Node}       root
   */
  function add (i, data, t, comparator, tree) {
    var node = new Node(i, data);

    if (t === null) {
      node.left = node.right = null;
      tree._size++;
      return node;
    }

    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);
    if (cmp === 0) { return t; }
    else {
      if (cmp < 0) {
        node.left = t.left;
        node.right = t;
        t.left = null;
      } else if (cmp > 0) {
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
   * @param {Key}        i
   * @param {Tree}       tree
   * @param {Comparator} comparator
   * @param {Tree}       tree
   * @return {Node}      new root
   */
  function remove (i, t, comparator, tree) {
    var x;
    if (t === null) { return null; }
    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);
    if (cmp === 0) {               /* found it */
      if (t.left === null) {
        x = t.right;
      } else {
        x = splay(i, t.left, comparator);
        x.right = t.right;
      }
      tree._size--;
      return x;
    }
    return t;                         /* It wasn't there */
  }


  function split (key, v, comparator) {
    var left, right;
    if (v === null) {
      left = right = null;
    } else {
      v = splay(key, v, comparator);

      var cmp = comparator(v.key, key);
      if (cmp === 0) {
        left  = v.left;
        right = v.right;
      } else if (cmp < 0) {
        right   = v.right;
        v.right = null;
        left    = v;
      } else {
        left   = v.left;
        v.left = null;
        right  = v;
      }
    }
    return { left: left, right: right };
  }


  function merge (left, right, comparator) {
    if (right === null) { return left; }
    if (left  === null) { return right; }

    right = splay(left.key, right, comparator);
    right.left = left;
    return right;
  }


  /**
   * Prints level of the tree
   * @param  {Node}                        root
   * @param  {String}                      prefix
   * @param  {Boolean}                     isTail
   * @param  {Array<string>}               out
   * @param  {Function(node:Node):String}  printNode
   */
  function printRow (root, prefix, isTail, out, printNode) {
    if (root) {
      out(("" + prefix + (isTail ? '└── ' : '├── ') + (printNode(root)) + "\n"));
      var indent = prefix + (isTail ? '    ' : '│   ');
      if (root.left)  { printRow(root.left,  indent, false, out, printNode); }
      if (root.right) { printRow(root.right, indent, true,  out, printNode); }
    }
  }


  var Tree = function Tree (comparator) {
    if ( comparator === void 0 ) comparator = DEFAULT_COMPARE;

    this._comparator = comparator;
    this._root = null;
    this._size = 0;
  };

  var prototypeAccessors = { size: { configurable: true } };


  /**
   * Inserts a key, allows duplicates
   * @param{Key}  key
   * @param{Value=} data
   * @return {Node|null}
   */
  Tree.prototype.insert = function insert$1 (key, data) {
    return this._root = insert(key, data, this._root, this._comparator, this);
  };


  /**
   * Adds a key, if it is not present in the tree
   * @param{Key}  key
   * @param{Value=} data
   * @return {Node|null}
   */
  Tree.prototype.add = function add$1 (key, data) {
    return this._root = add(key, data, this._root, this._comparator, this);
  };


  /**
   * @param{Key} key
   * @return {Node|null}
   */
  Tree.prototype.remove = function remove$1 (key) {
    this._root = remove(key, this._root, this._comparator, this);
  };


  /**
   * Removes and returns the node with smallest key
   * @return {?Node}
   */
  Tree.prototype.pop = function pop () {
    var node = this._root;
    if (node) {
      while (node.left) { node = node.left; }
      this._root = splay(node.key,this._root, this._comparator);
      this._root = remove(node.key, this._root, this._comparator, this);
      return { key: node.key, data: node.data };
    }
    return null;
  };


  /**
   * @param{Key} key
   * @return {Node|null}
   */
  Tree.prototype.findStatic = function findStatic (key) {
    var current = this._root;
    var compare = this._comparator;
    while (current) {
      var cmp = compare(key, current.key);
      if (cmp === 0)  { return current; }
      else if (cmp < 0) { current = current.left; }
      else            { current = current.right; }
    }
    return null;
  };


  /**
   * @param{Key} key
   * @return {Node|null}
   */
  Tree.prototype.find = function find (key) {
    if (this._root) {
      this._root = splay(key, this._root, this._comparator);
      if (this._comparator(key, this._root.key) !== 0) { return null; }
    }
    return this._root;
  };


  /**
   * @param{Key} key
   * @return {Boolean}
   */
  Tree.prototype.contains = function contains (key) {
    var current = this._root;
    var compare = this._comparator;
    while (current) {
      var cmp = compare(key, current.key);
      if (cmp === 0)  { return true; }
      else if (cmp < 0) { current = current.left; }
      else            { current = current.right; }
    }
    return false;
  };


  /**
   * @param{Visitor} visitor
   * @param{*=}    ctx
   * @return {SplayTree}
   */
  Tree.prototype.forEach = function forEach (visitor, ctx) {
    var current = this._root;
    var Q = [];/* Initialize stack s */
    var done = false;

    while (!done) {
      if (current !==null) {
        Q.push(current);
        current = current.left;
      } else {
        if (Q.length !== 0) {
          current = Q.pop();
          visitor.call(ctx, current);

          current = current.right;
        } else { done = true; }
      }
    }
    return this;
  };


  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   * @param{Key}    low
   * @param{Key}    high
   * @param{Function} fn
   * @param{*?}     ctx
   * @return {SplayTree}
   */
  Tree.prototype.range = function range (low, high, fn, ctx) {
      var this$1 = this;

    var Q = [];
    var compare = this._comparator;
    var node = this._root, cmp;

    while (Q.length !== 0 || node) {
      if (node) {
        Q.push(node);
        node = node.left;
      } else {
        node = Q.pop();
        cmp = compare(node.key, high);
        if (cmp > 0) {
          break;
        } else if (compare(node.key, low) >= 0) {
          if (fn.call(ctx, node)) { return this$1; } // stop if smth is returned
        }
        node = node.right;
      }
    }
    return this;
  };


  /**
   * Returns array of keys
   * @return {Array<Key>}
   */
  Tree.prototype.keys = function keys () {
    var keys = [];
    this.forEach(function (ref) {
        var key = ref.key;

        return keys.push(key);
      });
    return keys;
  };


  /**
   * Returns array of all the data in the nodes
   * @return {Array<Value>}
   */
  Tree.prototype.values = function values () {
    var values = [];
    this.forEach(function (ref) {
        var data = ref.data;

        return values.push(data);
      });
    return values;
  };


  /**
   * @return {Key|null}
   */
  Tree.prototype.min = function min () {
    if (this._root) { return this.minNode(this._root).key; }
    return null;
  };


  /**
   * @return {Key|null}
   */
  Tree.prototype.max = function max () {
    if (this._root) { return this.maxNode(this._root).key; }
    return null;
  };


  /**
   * @return {Node|null}
   */
  Tree.prototype.minNode = function minNode (t) {
      if ( t === void 0 ) t = this._root;

    if (t) { while (t.left) { t = t.left; } }
    return t;
  };


  /**
   * @return {Node|null}
   */
  Tree.prototype.maxNode = function maxNode (t) {
      if ( t === void 0 ) t = this._root;

    if (t) { while (t.right) { t = t.right; } }
    return t;
  };


  /**
   * Returns node at given index
   * @param{number} index
   * @return {?Node}
   */
  Tree.prototype.at = function at (index) {
    var current = this._root, done = false, i = 0;
    var Q = [];

    while (!done) {
      if (current) {
        Q.push(current);
        current = current.left;
      } else {
        if (Q.length > 0) {
          current = Q.pop();
          if (i === index) { return current; }
          i++;
          current = current.right;
        } else { done = true; }
      }
    }
    return null;
  };


  /**
   * @param{Node} d
   * @return {Node|null}
   */
  Tree.prototype.next = function next (d) {
    var root = this._root;
    var successor = null;

    if (d.right) {
      successor = d.right;
      while (successor.left) { successor = successor.left; }
      return successor;
    }

    var comparator = this._comparator;
    while (root) {
      var cmp = comparator(d.key, root.key);
      if (cmp === 0) { break; }
      else if (cmp < 0) {
        successor = root;
        root = root.left;
      } else { root = root.right; }
    }

    return successor;
  };


  /**
   * @param{Node} d
   * @return {Node|null}
   */
  Tree.prototype.prev = function prev (d) {
    var root = this._root;
    var predecessor = null;

    if (d.left !== null) {
      predecessor = d.left;
      while (predecessor.right) { predecessor = predecessor.right; }
      return predecessor;
    }

    var comparator = this._comparator;
    while (root) {
      var cmp = comparator(d.key, root.key);
      if (cmp === 0) { break; }
      else if (cmp < 0) { root = root.left; }
      else {
        predecessor = root;
        root = root.right;
      }
    }
    return predecessor;
  };


  /**
   * @return {SplayTree}
   */
  Tree.prototype.clear = function clear () {
    this._root = null;
    this._size = 0;
    return this;
  };


  /**
   * @return {NodeList}
   */
  Tree.prototype.toList = function toList$1 () {
    return toList(this._root);
  };


  /**
   * Bulk-load items. Both array have to be same size
   * @param{Array<Key>}  keys
   * @param{Array<Value>}[values]
   * @param{Boolean}     [presort=false] Pre-sort keys and values, using
   *                                       tree's comparator. Sorting is done
   *                                       in-place
   * @return {AVLTree}
   */
  Tree.prototype.load = function load (keys, values, presort) {
      if ( keys === void 0 ) keys = [];
      if ( values === void 0 ) values = [];
      if ( presort === void 0 ) presort = false;

    var size = keys.length;
    var comparator = this._comparator;

    // sort if needed
    if (presort) { sort(keys, values, 0, size - 1, comparator); }

    if (this._root === null) { // empty tree
      this._root = loadRecursive(this._root, keys, values, 0, size);
      this._size = size;
    } else { // that re-builds the whole tree from two in-order traversals
      var mergedList = mergeLists(this.toList(), createList(keys, values), comparator);
      size = this._size + size;
      this._root = sortedListToBST({ head: mergedList }, 0, size);
    }
    return this;
  };


  /**
   * @return {Boolean}
   */
  Tree.prototype.isEmpty = function isEmpty () { return this._root === null; };

  prototypeAccessors.size.get = function () { return this._size; };


  /**
   * @param{NodePrinter=} printNode
   * @return {String}
   */
  Tree.prototype.toString = function toString (printNode) {
      if ( printNode === void 0 ) printNode = function (n) { return n.key; };

    var out = [];
    printRow(this._root, '', true, function (v) { return out.push(v); }, printNode);
    return out.join('');
  };


  Tree.prototype.update = function update (key, newKey, newData) {
    var comparator = this._comparator;
    var ref = split(key, this._root, comparator);
      var left = ref.left;
      var right = ref.right;
    this._size--;
    if (comparator(key, newKey) < 0) {
      right = insert(newKey, newData, right, comparator, this);
    } else {
      left = insert(newKey, newData, left, comparator, this);
    }
    this._root = merge(left, right, comparator);
  };


  Tree.prototype.split = function split$1 (key) {
    return split(key, this._root, this._comparator);
  };

  Object.defineProperties( Tree.prototype, prototypeAccessors );


  function loadRecursive (parent, keys, values, start, end) {
    var size = end - start;
    if (size > 0) {
      var middle = start + Math.floor(size / 2);
      var key    = keys[middle];
      var data   = values[middle];
      var node   = { key: key, data: data, parent: parent };
      node.left    = loadRecursive(node, keys, values, start, middle);
      node.right   = loadRecursive(node, keys, values, middle + 1, end);
      return node;
    }
    return null;
  }


  function createList(keys, values) {
    var head = { next: null };
    var p = head;
    for (var i = 0; i < keys.length; i++) {
      p = p.next = { key: keys[i], data: values[i] };
    }
    p.next = null;
    return head.next;
  }


  function toList (root) {
    var current = root;
    var Q = [], done = false;

    var head = { next: null };
    var p = head;

    while (!done) {
      if (current) {
        Q.push(current);
        current = current.left;
      } else {
        if (Q.length > 0) {
          current = p = p.next = Q.pop();
          current = current.right;
        } else { done = true; }
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


  function mergeLists (l1, l2, compare) {
    if ( compare === void 0 ) compare = function (a, b) { return a - b; };

    var head = {}; // dummy
    var p = head;

    var p1 = l1;
    var p2 = l2;

    while (p1 !== null && p2 !== null) {
      if (compare(p1.key, p2.key) < 0) {
        p.next = p1;
        p1 = p1.next;
      } else {
        p.next = p2;
        p2 = p2.next;
      }
      p = p.next;
    }

    if (p1 !== null)      { p.next = p1; }
    else if (p2 !== null) { p.next = p2; }

    return head.next;
  }


  function sort(keys, values, left, right, compare) {
    if (left >= right) { return; }

    var pivot = keys[(left + right) >> 1];
    var i = left - 1;
    var j = right + 1;

    while (true) {
      do { i++; } while (compare(keys[i], pivot) < 0);
      do { j--; } while (compare(keys[j], pivot) > 0);
      if (i >= j) { break; }

      var tmp = keys[i];
      keys[i] = keys[j];
      keys[j] = tmp;

      tmp = values[i];
      values[i] = values[j];
      values[j] = tmp;
    }

    sort(keys, values,  left,     j, compare);
    sort(keys, values, j + 1, right, compare);
  }

  return Tree;

})));
//# sourceMappingURL=splay.js.map
