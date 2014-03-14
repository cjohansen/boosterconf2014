if (typeof require === "function") {
    var bane = require("bane");
    var matrix = require("./matrix.js");
}

(function (global) {
    var uuid = 0;

    /**
     * Find the first item in the array for which the function returns thruthy
     */
    function find(coll, fn) {
        for (var i = 0; i < coll.length; i++) {
            if (fn(coll[i])) { return coll[i]; }
        }
    }

    function push(coll, item) {
        coll.push(item);
        return item;
    }

    var puzzle = {
        createGameCollection: function () {
            var games = [];

            return {
                add: function (game) {
                    return push(games, game);
                },

                count: function () {
                    return games.length;
                },

                get: function (i) {
                    return games[i];
                },

                /**
                 * If there are any pending games (i.e. with less than 2 players),
                 * return it. Otherwise, create a new game and return that.
                 */
                getCurrent: function (size) {
                    var game = find(games, function (g) { return g.players.length < 2; });
                    if (!game) {
                        game = push(games, puzzle.createGame(size))
                    }
                    return game;
                },

                find: function (id) {
                    return find(games, function (g) { return g.id === id; });
                },
            };
        },

        createGame: function (size) {
            var game = bane.createEventEmitter({
                id: uuid++,
                layout: matrix.createMatrix(size),
                players: [],

                /**
                 * Create a new player object, add it to the game and return it.
                 */
                addPlayer: function (name, picture) {
                    var player = push(game.players, {
                        id: game.players.length,
                        name: name,
                        picture: picture,
                        layout: game.layout.slice()
                    });
                    game.emit("update", game);
                    return player;
                },

                /**
                 * Attempt a move.
                 */
                move: function (player, cellId) {
                    var gameplay = player.layout;
                    var cell = find(gameplay, function (c) { return c.id === cellId; });
                    player.layout = matrix.swap(gameplay, cell, matrix.getOpenAdjacent(gameplay, cell));
                    game.emit("update", game);
                    return game;
                }
            });

            return game;
        }
    };

    if (typeof module === "object" && module.exports) {
        module.exports = puzzle;
    } else {
        global.puzzle = puzzle;
    }
}(this));
