// Node and npm libraries
var http = require("http");
var express = require("express");
var puzzle = require("./src/puzzle");

// Our controller actions
var server = require("./src/server");

// The Express app, with static files
var app = express();
var public = __dirname + "/public";
app.use(express.static(public));

// Store all games in an array
var games = puzzle.createGameCollection();

// HTTP server will bring our Express to the masses
var httpServer = http.createServer(app);

// Add the HTTP routes to the Express app
server.configureApp(app, games, {
    views: __dirname + "/views",
    public: public
});

// Start the server. Optionally, pass the port on the command line:
// node index.js 9666
var port = process.argv[2] || 3000;
httpServer.listen(port, function() {
    console.log("Pizuzzle running on port %d", port);
});
