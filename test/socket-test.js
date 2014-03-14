var buster = require("buster");
var assert = buster.assert;
var bane = require("bane");
var socket = require("../src/socket");
var puzzle = require("../src/puzzle");

buster.testCase("Socket server", {
    setUp: function () {
        this.io = { sockets: bane.createEventEmitter() };
        this.game = puzzle.createGame(3);
        this.games = puzzle.createGameCollection();
        this.games.add(this.game);
        this.player = this.game.addPlayer("Jane", "/pictures/high-five.png");

        socket.configureSocket(this.io, this.games);
        this.browser = bane.createEventEmitter();

        // Helpers that make tests read better
        this.connectBrowser = function () {
            this.io.sockets.emit("connection", this.browser);
        };

        this.browserReadyToPlay = function () {
            this.browser.emit("player:ready", {
                gameId: this.game.id,
                playerId: this.player.id
            });
        };
    },

    "starts game when a connection is made and the player is ready": function () {
        var listener = this.spy();
        this.browser.on("game:update", listener);

        this.connectBrowser();
        this.browserReadyToPlay();

        assert.calledOnce(listener);
        assert.calledWith(listener, this.game);
    },

    "tells browser to update when game state changes": function () {
        this.connectBrowser();
        this.browserReadyToPlay();

        // Listen after connect to avoid the initial game:update event
        var listener = this.spy();
        this.browser.on("game:update", listener);
        this.game.emit("update", this.game);

        assert.calledOnce(listener);
        assert.calledWith(listener, this.game);
    },

    "attempts move when browser issues game:move event": function () {
        this.stub(this.game, "move");

        this.connectBrowser();
        this.browserReadyToPlay();
        this.browser.emit("game:move", {id: 6});

        assert.calledOnce(this.game.move);
        assert.calledWith(this.game.move, this.player, 6);
    }
});
