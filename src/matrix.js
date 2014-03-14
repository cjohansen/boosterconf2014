// The wrapping iife ("immediately invoked function expression") provides a
// scope that allows us to export only a few names globally when in the browser.
(function (global) {
    /**
     * Return an array of the given size
     */
    function range(size) {
        var arr = [];
        for (var i = 0; i < size; ++i) { arr.push(i); }
        return arr;
    }

    function identity(x) {
        return x;
    }

    /**
     * Returns a "getter" function - one that extracts a specific property from
     * its argument:
     *
     *     var getName = prop("name");
     *     getName({name: "Christian"}); // "Christian"
     */
    function prop(name) {
        return function (object) {
            return object[name];
        };
    }

    function first(coll) {
        return coll && coll[0];
    }

    /**
     * Given an array that represents a matrix, and a position, return the cell
     * conceptually above this position, or undefined.
     *
     * above([{id: 0}, {id: 1}, {id: 2},
     *        {id: 3}, {id: 4}, {id: 5},
     *        {id: 6}, {id: 7}, {id: 8}, 5); => {id: 2}
     */
    function above(matrix, pos) {
        return matrix[pos - Math.sqrt(matrix.length)];
    }

    /**
     * Given an array that represents a matrix, and a position, return the cell
     * conceptually below this position or undefined.
     *
     * below([{id: 0}, {id: 1}, {id: 2},
     *        {id: 3}, {id: 4}, {id: 5},
     *        {id: 6}, {id: 7}, {id: 8}, 5); => {id: 8}
     */
    function below(matrix, pos) {
        return matrix[pos + Math.sqrt(matrix.length)];
    }

    /**
     * Given an array that represents a matrix, and a position, return the cell
     * conceptually to the right of this position, or undefined.
     *
     * below([{id: 0}, {id: 1}, {id: 2},
     *        {id: 3}, {id: 4}, {id: 5},
     *        {id: 6}, {id: 7}, {id: 8}, 0); => {id: 1}
     */
    function right(matrix, pos) {
        var size = Math.sqrt(matrix.length);
        if (pos % size < size - 1) { return matrix[pos + 1]; }
    }

    /**
     * Given an array that represents a matrix, and a position, return the cell
     * conceptually to the left of this position, or undefined.
     *
     * below([{id: 0}, {id: 1}, {id: 2},
     *        {id: 3}, {id: 4}, {id: 5},
     *        {id: 6}, {id: 7}, {id: 8}, 1); => {id: 0}
     */
    function left(matrix, pos) {
        var size = Math.sqrt(matrix.length);
        if (pos % size >= 1) { return matrix[pos - 1]; }
    }

    /**
     * Given an array that represents a matrix, return all adjacent cells as an
     * arry.
     */
    function getAdjacent(matrix, cell) {
        var pos = matrix.indexOf(cell);
        return [above, below, left, right].map(function (dir) {
            return dir(matrix, pos);
        }).filter(identity);
    }

    /**
     * Given an array that represents a matrix, find an adjacent cell that has
     * its open property set to a truthy value.
     */
    function getOpenAdjacent(matrix, cell) {
        return first(getAdjacent(matrix, cell).filter(prop("open")));
    }

    /**
     * Return a new matrix with the two cells swapped.
     */
    function swap(matrix, curr, target) {
        return matrix.map(function (slot) {
            if (curr === slot) { return target; }
            if (target === slot) { return curr; }
            return slot;
        });
    }

    /**
     * Create a new, randomized matrix.
     */
    function createMatrix(size) {
        return range(size * size).map(function (n) {
            return { id: n, open: n == (size - 1) };
        }).sort(function () { return Math.random() - 0.5;});
    }

    // The exported API
    var matrix = {
        createMatrix: createMatrix,
        getOpenAdjacent: getOpenAdjacent,
        swap: swap
    };

    // Some boilerplate to export as a Node module when on node, and as a
    // regular old global when in the browser.
    if (typeof module === "object" && module.exports) {
        module.exports = matrix;
    } else {
        global.matrix = matrix;
    }
}(this));
