function DEFAULT_COMPARE (a, b) { return a > b ? 1 : a < b ? -1 : 0; }

export default class SplayTree {

  constructor(compare = DEFAULT_COMPARE, noDuplicates = false) {
    this._compare = compare;
    this._root = null;
    this._size = 0;
    this._noDuplicates = !!noDuplicates;
  }


  rotateLeft(x) {
    var y = x.right;
    if (y) {
      x.right = y.left;
      if (y.left) y.left.parent = x;
      y.parent = x.parent;
    }

    if (!x.parent)                this._root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else                          x.parent.right = y;
    if (y) y.left = x;
    x.parent = y;
  }


  rotateRight(x) {
    var y = x.left;
    if (y) {
      x.left = y.right;
      if (y.right) y.right.parent = x;
      y.parent = x.parent;
    }

    if (!x.parent)               this._root = y;
    else if(x === x.parent.left) x.parent.left = y;
    else                         x.parent.right = y;
    if (y) y.right = x;
    x.parent = y;
  }


  _splay(x) {
    while (x.parent) {
      if (!x.parent.parent) {
        if (x.parent.left === x) this.rotateRight(x.parent);
        else                     this.rotateLeft(x.parent);
      } else if (x.parent.left === x && x.parent.parent.left === x.parent) {
        this.rotateRight(x.parent.parent);
        this.rotateRight(x.parent);
      } else if (x.parent.right === x && x.parent.parent.right === x.parent) {
        this.rotateLeft(x.parent.parent);
        this.rotateLeft(x.parent);
      } else if (x.parent.left === x && x.parent.parent.right === x.parent) {
        this.rotateRight(x.parent);
        this.rotateLeft(x.parent);
      } else {
        this.rotateLeft(x.parent);
        this.rotateRight(x.parent);
      }
    }
  }


  splay(node) {
    var P, GP, GGP, l, r;

    while ((P = node.parent) !== null) {
      GP = P.parent;
      if (GP && GP.parent) {
        GGP = GP.parent;
        if (GGP.left === GP) GGP.left  = node;
        else                 GGP.right = node;
        node.parent = GGP;
      } else {
        node.parent = null;
        this._root = node;
      }

      l = node.left; r = node.right;
      if (P.left === node) {
        if (GP) {
          if (GP.left === P) {
            /* zig-zig */
            GP.left = P.right;
            if (GP.left) GP.left.parent = GP;

            P.right = GP;
            GP.parent = P;
          } else {
            /* zig-zag */
            GP.right = l;
            if (l) l.parent = GP;
            node.left = GP;
            GP.parent = node;
          }
        }
        P.left = r;
        if (r) r.parent = P;
        node.right = P;
        P.parent = node;
      } else {
        if (GP) {
          if (GP.right === P) {
            /* zig-zig */
            GP.right = P.left;
            if (GP.right) GP.right.parent = GP;
            P.left = GP;
            GP.parent = P;
          } else {
            /* zig-zag */
            GP.left = r;
            if (r) r.parent = GP;
            node.right = GP;
            GP.parent = node;
          }
        }
        P.right = l;
        if (l) l.parent = P;
        node.left = P;
        P.parent = node;
      }
    }
  }


  replace(u, v) {
    if (!u.parent) this._root = v;
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;
    if (v) v.parent = u.parent;
  }


  minNode(u = this._root) {
    if (u) while (u.left) u = u.left;
    return u;
  }


  maxNode(u = this._root) {
    if (u) while (u.right) u = u.right;
    return u;
  }


  insert(key, data) {
    var z = this._root;
    var p = null;
    var comp = this._compare;
    var cmp;

    if (this._noDuplicates) {
      while (z) {
        p = z;
        cmp = comp(z.key, key);
        if (cmp === 0) return;
        else if (comp(z.key, key) < 0) z = z.right;
        else z = z.left;
      }
    } else {
      while (z) {
        p = z;
        if (comp(z.key, key) < 0) z = z.right;
        else z = z.left;
      }
    }

    z = { key, data, left: null, right: null, parent: p };

    if (!p)                          this._root = z;
    else if (comp(p.key, z.key) < 0) p.right = z;
    else                             p.left  = z;

    this.splay(z);
    this._size++;
  }

  find (key) {
    var z    = this._root;
    var comp = this._compare;
    while (z) {
      var cmp = comp(z.key, key);
      if      (cmp < 0) z = z.right;
      else if (cmp > 0) z = z.left;
      else              return z;
    }
    return null;
  }

  /**
   * Whether the tree contains a node with the given key
   * @param  {Key} key
   * @return {boolean} true/false
   */
  contains (key) {
    var node       = this._root;
    var comparator = this._compare;
    while (node)  {
      var cmp = comparator(key, node.key);
      if      (cmp === 0) return true;
      else if (cmp < 0)   node = node.left;
      else                node = node.right;
    }

    return false;
  }


  remove (key) {
    var z = this.find(key);

    if (!z) return;

    this.splay(z);

    if (!z.left) this.replace(z, z.right);
    else if (!z.right) this.replace(z, z.left);
    else {
      var y = this.minNode(z.right);
      if (y.parent !== z) {
        this.replace(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.replace(z, y);
      y.left = z.left;
      y.left.parent = y;
    }

    this._size--;
  }


  erase (key) {
    var z = this.find(key);
    if (!z) return;

    this.splay(z);

    var s = z.left;
    var t = z.right;

    var sMax = null;
    if (s) {
      s.parent = null;
      sMax = this.maxNode(s);
      this.splay(sMax);
      this._root = sMax;
    }
    if (t) {
      if (s) sMax.right = t;
      else   this._root = t;
      t.parent = sMax;
    }

    this._size--;
  }

  /**
   * Removes and returns the node with smallest key
   * @return {?Node}
   */
  pop () {
    var node = this._root, returnValue = null;
    if (node) {
      while (node.left) node = node.left;
      returnValue = { key: node.key, data: node.data };
      this.remove(node.key);
    }
    return returnValue;
  }


  /* eslint-disable class-methods-use-this */

  /**
   * Successor node
   * @param  {Node} node
   * @return {?Node}
   */
  next (node) {
    var successor = node;
    if (successor) {
      if (successor.right) {
        successor = successor.right;
        while (successor && successor.left) successor = successor.left;
      } else {
        successor = node.parent;
        while (successor && successor.right === node) {
          node = successor; successor = successor.parent;
        }
      }
    }
    return successor;
  }


  /**
   * Predecessor node
   * @param  {Node} node
   * @return {?Node}
   */
  prev (node) {
    var predecessor = node;
    if (predecessor) {
      if (predecessor.left) {
        predecessor = predecessor.left;
        while (predecessor && predecessor.right) predecessor = predecessor.right;
      } else {
        predecessor = node.parent;
        while (predecessor && predecessor.left === node) {
          node = predecessor;
          predecessor = predecessor.parent;
        }
      }
    }
    return predecessor;
  }
  /* eslint-enable class-methods-use-this */


  /**
   * @param  {forEachCallback} callback
   * @return {AVLTree}
   */
  forEach(callback) {
    var current = this._root;
    var s = [], done = false, i = 0;

    while (!done) {
      // Reach the left most Node of the current Node
      if (current) {
        // Place pointer to a tree node on the stack
        // before traversing the node's left subtree
        s.push(current);
        current = current.left;
      } else {
        // BackTrack from the empty subtree and visit the Node
        // at the top of the stack; however, if the stack is
        // empty you are done
        if (s.length > 0) {
          current = s.pop();
          callback(current, i++);

          // We have visited the node and its left
          // subtree. Now, it's right subtree's turn
          current = current.right;
        } else done = true;
      }
    }
    return this;
  }

  /**
   * Returns all keys in order
   * @return {Array<Key>}
   */
  keys () {
    var current = this._root;
    var s = [], r = [], done = false;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          r.push(current.key);
          current = current.right;
        } else done = true;
      }
    }
    return r;
  }


  /**
   * Returns `data` fields of all nodes in order.
   * @return {Array<Value>}
   */
  values () {
    var current = this._root;
    var s = [], r = [], done = false;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          r.push(current.data);
          current = current.right;
        } else done = true;
      }
    }
    return r;
  }


  /**
   * Returns node at given index
   * @param  {number} index
   * @return {?Node}
   */
  at (index) {
    // removed after a consideration, more misleading than useful
    // index = index % this.size;
    // if (index < 0) index = this.size - index;

    var current = this._root;
    var s = [], done = false, i = 0;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          if (i === index) return current;
          i++;
          current = current.right;
        } else done = true;
      }
    }
    return null;
  }

  /**
   * Bulk-load items
   * @param  {Array<Key>}  keys
   * @param  {Array<Value>}  [values]
   * @return {AVLTree}
   */
  load(keys = [], values = []) {
    if (Array.isArray(keys)) {
      for (var i = 0, len = keys.length; i < len; i++) {
        this.insert(keys[i], values[i]);
      }
    }
    return this;
  }


  min() {
    var node = this.minNode(this._root);
    if (node) return node.key;
    else      return null;
  }


  max() {
    var node = this.maxNode(this._root);
    if (node) return node.key;
    else      return null;
  }

  isEmpty() { return this._root === null; }
  get size() { return this._size; }
}
