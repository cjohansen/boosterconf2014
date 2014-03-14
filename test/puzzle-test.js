if (typeof require === "function") {
    var buster = require("buster");
    var puzzle = require("../src/puzzle");
}

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Puzzle", {
    "createGame": {
        "creates new game": function () {
            var game = puzzle.createGame(3);

            assert.equals(game.layout.length, 9);
            assert.equals(game.layout.filter(function (c) { return c.id === 0; }).length, 1);
        },

        "new game has one open slot": function () {
            var game = puzzle.createGame(3);

            assert.equals(game.layout.filter(function (c) { return c.open; }).length, 1);
        },

        "games have uuids": function () {
            var game = puzzle.createGame(3);
            var game2 = puzzle.createGame(3);

            assert.isNumber(game.id);
            refute.equals(game.id, game2.id);
        },

        "two consecutive games have different layouts": function () {
            var game = puzzle.createGame(3);
            var game2 = puzzle.createGame(3);

            assert.isNumber(game.id);
            refute.equals(game.id, game2.id);
        },

        "game initially has no players": function () {
            var game = puzzle.createGame(3);

            assert.equals(game.players, []);
        }
    },

    "game collection: find": {
        "returns nothing when game does not exist": function () {
            var games = puzzle.createGameCollection();
            refute.defined(games.find(0));
        },

        "finds game by id": function () {
            var games = puzzle.createGameCollection();
            var game = puzzle.createGame(3);
            games.add(game);
            assert.equals(games.find(game.id), game);
        }
    },

    "addPlayer": {
        "adds a player to the game": function () {
            var game = puzzle.createGame(3);
            var player = game.addPlayer("Player", "snoop.png");

            assert.equals(game.players.length, 1);
            assert.equals(game.players[0], player);
        },

        "player has id, name and picture": function () {
            var game = puzzle.createGame(3);
            var player1 = game.addPlayer("Player 1", "snoop.png");
            var player2 = game.addPlayer("Player 2", "dogg.png");

            refute.equals(player1.id, player2.id);
            assert.isNumber(player1.id);
            assert.equals(player1.name, "Player 1");
            assert.equals(player1.picture, "snoop.png");
        },

        "new player starts with game layout": function () {
            var game = puzzle.createGame(3);
            var player = game.addPlayer("Player", "snoop.png");

            assert.equals(game.layout, player.layout);
        },

        "new player emits event": function () {
            var listener = this.spy();
            var game = puzzle.createGame(3);
            game.on("update", listener);

            var player = game.addPlayer("Player", "snoop.png");

            assert.calledOnce(listener);
            assert.equals(game.layout, listener.args[0][0].players[0].layout);
        }
    },

    "Game collections: getCurrent": {
        "creates new game when no games": function () {
            var games = puzzle.createGameCollection();
            var game = games.getCurrent(3);

            assert.isNumber(game.id);
            assert.equals(games.count(), 1);
            assert.equals(games.get(0), game);
            assert.equals(game.layout.length, 9);
        },

        "gets previous game if no players": function () {
            var games = puzzle.createGameCollection();
            var game1 = games.getCurrent(3);
            var game2 = games.getCurrent(3);

            assert.equals(game1, game2);
            assert.equals(games.count(), 1);
        },

        "gets previous game if it has one player": function () {
            var games = puzzle.createGameCollection();
            var game1 = games.getCurrent(3);
            game1.addPlayer("Player", "snoop.png");
            var game2 = games.getCurrent(3);

            assert.equals(game1, game2);
        },

        "gets new game if previous has two players": function () {
            var games = puzzle.createGameCollection();
            var game1 = games.getCurrent(3);
            game1.addPlayer("Player 1", "snoop.png");
            game1.addPlayer("Player 2", "dogg.png");
            var game2 = games.getCurrent(3);

            refute.equals(game1, game2);
            assert.equals(games.count(), 2);
        }
    },

    "move": {
        setUp: function () {
            this.game = puzzle.createGame();
            this.game.layout = [
                {id: 1, open: true}, {id: 2, open: false}, {id: 3, open: false},
                {id: 4, open: false}, {id: 5, open: false}, {id: 6, open: false},
                {id: 7, open: false}, {id: 8, open: false}, {id: 9, open: false}
            ];
            this.player = this.game.addPlayer("Player", "snoop.png");
        },

        "updates the player's layout": function () {
            this.game.move(this.player, this.game.layout[1].id);

            refute.equals(this.game.layout, this.player.layout);
        },

        "emits event": function () {
            var listener = this.spy();
            this.game.on("update", listener);
            this.game.move(this.player, this.game.layout[1].id);

            assert.calledOnce(listener);
            assert.equals(listener.args[0][0].players[0].layout[0], {id: 2, open: false});
        }
    }
});
