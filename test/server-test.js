var buster = require("buster");
var assert = buster.assert;
var request = require("supertest");
var http = require("http");
var fs = require("fs");
var rmrf = require("rimraf");
var express = require("express");
var server = require("../src/server");
var puzzle = require("../src/puzzle");

var PUBLIC = __dirname + "/tmp";

buster.testCase("HTTP server", {
    setUp: function () {
        // TMP public dir for uploaded pictures
        fs.mkdirSync(PUBLIC);
        fs.mkdirSync(PUBLIC + "/pictures");

        // The app is the system under test, games is the backend storage
        this.games = puzzle.createGameCollection();
        this.app = express();

        // Mount a server to do black box testing through
        this.server = http.createServer(this.app);
        this.server.listen(9666);
        server.configureApp(this.app, this.games, {
            views: __dirname + "/../views",
            public: PUBLIC
        });

        // request is a supertest helper
        this.request = request(this.server);
    },

    tearDown: function (done) {
        rmrf.sync(PUBLIC);
        this.server.close(done);
    },

    "creates game on first POST to /games": function (done) {
        this.request.
            post("/games").
            attach("picture", __dirname + "/fixtures/high-five.png").
            expect(function (res) {
                assert.equals(res.status, 302);
                assert.equals(this.games.count(), 1);
                var player = this.games.get(0).players[0];
                var gid = this.games.get(0).id;
                assert.match(player, {id: 0, picture: "/pictures/" + gid + "-0.png"});
                assert.equals(res.headers.location, "/games/" + gid + "/0");
            }.bind(this)).end(done);
    },

    "saves the game picture to disk in the public directory": function (done) {
        this.request.
            post("/games").
            attach("picture", __dirname + "/fixtures/high-five.png").
            expect(function (res) {
                var gid = this.games.get(0).id;
                var pid = this.games.get(0).players[0].id;
                var fileName = gid + "-" + pid + ".png";

                assert(fs.existsSync(PUBLIC + "/pictures/" + fileName));
            }.bind(this)).end(done);
    },

    "adds player to pending game on POST to /games": function (done) {
        var game = puzzle.createGame(3);
        this.games.add(game);
        game.addPlayer("John", "/pictures/0-0.png");

        this.request.
            post("/games").
            attach("picture", __dirname + "/fixtures/high-five.png").
            expect(function (res) {
                assert.equals(this.games.count(), 1);
                assert.equals(this.games.players.length, 2);
                assert.equals(res.headers.location, "/games/" + game.id + "/1");
            }.bind(this)).end(done);
    },

    "gets the game page": function (done) {
        var game = puzzle.createGame(3);
        this.games.add(game);
        var player = this.games.get(0).addPlayer("John", "/pictures/0-0.png");

        this.request.
            get("/games/" + game.id + "/" + player.id).
            expect(function (res) {
                assert.equals(res.status, 200);
            }.bind(this)).end(done);
    },

    "non-existent games get a 404": function (done) {
        this.request.
            get("/games/666/999").
            expect(function (res) {
                assert.equals(res.status, 404);
            }.bind(this)).end(done);
    },

    "non-existent player gets a 404": function (done) {
        var game = puzzle.createGame(3);
        this.games.add(game);
        var player = this.games.get(0).addPlayer("John", "/pictures/0-0.png");

        this.request.
            get("/games/" + game.id + "/" + (player.id + 1)).
            expect(function (res) {
                assert.equals(res.status, 404);
            }.bind(this)).end(done);
    }
});
