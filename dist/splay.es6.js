/**
 * splaytree v0.0.1
 * Fast Splay tree for Node and browser
 *
 * @author Alexander Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */

function DEFAULT_COMPARE (a, b) { return a > b ? 1 : a < b ? -1 : 0; }

class SplayTree {

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
      var p = x.parent;
      if (!p.parent) {
        if (p.left === x) this.rotateRight(p);
        else              this.rotateLeft(p);
      } else if (p.left === x && p.parent.left === p) {
        this.rotateRight(p.parent);
        this.rotateRight(p);
      } else if (p.right === x && p.parent.right === p) {
        this.rotateLeft(p.parent);
        this.rotateLeft(p);
      } else if (p.left === x && p.parent.right === p) {
        this.rotateRight(p);
        this.rotateLeft(p);
      } else {
        this.rotateLeft(p);
        this.rotateRight(p);
      }
    }
  }


  splay(x) {
    var p, gp, ggp, l, r;

    while (x.parent) {
      p = x.parent;
      gp = p.parent;

      if (gp && gp.parent) {
        ggp = gp.parent;
        if (ggp.left === gp) ggp.left  = x;
        else                 ggp.right = x;
        x.parent = ggp;
      } else {
        x.parent = null;
        this._root = x;
      }

      l = x.left; r = x.right;

      if (x === p.left) { // left
        if (gp) {
          if (gp.left === p) {
            /* zig-zig */
            if (p.right) {
              gp.left = p.right;
              gp.left.parent = gp;
            } else gp.left = null;

            p.right   = gp;
            gp.parent = p;
          } else {
            /* zig-zag */
            if (l) {
              gp.right = l;
              l.parent = gp;
            } else gp.right = null;

            x.left    = gp;
            gp.parent = x;
          }
        }
        if (r) {
          p.left = r;
          r.parent = p;
        } else p.left = null;

        x.right  = p;
        p.parent = x;
      } else { // right
        if (gp) {
          if (gp.right === p) {
            /* zig-zig */
            if (p.left) {
              gp.right = p.left;
              gp.right.parent = gp;
            } else gp.right = null;

            p.left = gp;
            gp.parent = p;
          } else {
            /* zig-zag */
            if (r) {
              gp.left = r;
              r.parent = gp;
            } else gp.left = null;

            x.right   = gp;
            gp.parent = x;
          }
        }
        if (l) {
          p.right = l;
          l.parent = p;
        } else p.right = null;

        x.left   = p;
        p.parent = x;
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
    return z;
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

export default SplayTree;
//# sourceMappingURL=splay.es6.js.map
