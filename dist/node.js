var Node = /** @class */ (function () {
    function Node(key, data) {
        this.next = null;
        this.key = key;
        this.data = data;
        this.left = null;
        this.right = null;
    }
    return Node;
}());
export default Node;
