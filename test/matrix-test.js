if (typeof require === "function") {
    var buster = require("buster");
    var matrix = require("../src/matrix");
}

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Matrix", {
    "create": {
        "returns 'square' array": function () {
            var arr = matrix.createMatrix(3);
            assert.equals(arr.length, 9);
        },

        "returns random array": function () {
            var arr1 = matrix.createMatrix(3);
            var arr2 = matrix.createMatrix(3);

            refute.equals(arr1, arr2);
        },

        "includes one open cell": function () {
            var arr = matrix.createMatrix(3);
            var open = arr.filter(function (c) { return c.open; });

            assert.equals(open.length, 1);
        }
    },

    "getOpenAdjacent": {
        setUp: function () {
            this.matrix = [
                {id: 1, open: false}, {id: 2, open: false}, {id: 3, open: false},
                {id: 4, open: false}, {id: 5, open: true}, {id: 6, open: false},
                {id: 7, open: false}, {id: 8, open: false}, {id: 9, open: false}
            ];
        },

        "no open neighbour": function () {
            var open = matrix.getOpenAdjacent(this.matrix, this.matrix[0]);
            refute.defined(open);
        },

        "open above": function () {
            var open = matrix.getOpenAdjacent(this.matrix, this.matrix[7]);
            assert.equals(open, {id: 5, open: true});
        },

        "open below": function () {
            var open = matrix.getOpenAdjacent(this.matrix, this.matrix[1]);
            assert.equals(open, {id: 5, open: true});
        },

        "open to the left": function () {
            var open = matrix.getOpenAdjacent(this.matrix, this.matrix[5]);
            assert.equals(open, {id: 5, open: true});
        },

        "open to the right": function () {
            var open = matrix.getOpenAdjacent(this.matrix, this.matrix[3]);
            assert.equals(open, {id: 5, open: true});
        }
    },

    "swap": {
        setUp: function () {
            this.matrix = [
                {id: 1, open: false}, {id: 2, open: false}, {id: 3, open: false},
                {id: 4, open: false}, {id: 5, open: true}, {id: 6, open: false},
                {id: 7, open: false}, {id: 8, open: false}, {id: 9, open: false}
            ];
        },

        "does not modify the array": function () {
            var arr = this.matrix.slice();
            var newArr = matrix.swap(this.matrix, this.matrix[5]);

            assert.equals(arr, this.matrix);
        },

        "returns updated array": function () {
            var arr = this.matrix.slice();
            var newArr = matrix.swap(this.matrix, this.matrix[4], this.matrix[5]);

            refute.equals(arr, newArr);
            assert.equals(newArr[5], {id: 5, open: true});
        }
    }
});
