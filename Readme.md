# Picture! Puzzle! Pizuzzle!

Welcome to the picture slider puzzle. This repo will guide you through building
your first Node.JS/React app. You may not always have wanted a multi-player
picture slider, but that's what you'll get when you're done.

## Your final assignment

We have a server, and we have multiplayer UI. All we need now is to hook them
together and play.

## Finding your way around

The app structure is the same as in the previous rounds.

* **Readme.md** - it's this file!
* **buster.js** - the test runner configuration
* **index.js** - the main entrance point to the app. `node index.js` will start
  the web server.
* **package.json** - this your pom.xml/Gemfile/project.clj or whatever. It
  describes your project, and, importantly, its dependencies and development
  dependencies.
* **public** - any file in this directory will be served as-is over the web server
* **src** - this is where you'll do your work
* **test** - these are your goals. Making these pass will help you progress
  through the exercises.

## Getting up to speed #2

If you didn't have time to finish the first exercise, you can find solutions
ready for copy-paste here:

* [puzzle.js](https://gist.github.com/cjohansen/f5d0908eb4c92f00d877)
* [server.js](https://gist.github.com/cjohansen/5d487c4f701d53a0989e)
* [multiplayer-ui.js](https://gist.github.com/cjohansen/187a02f387d92630a37c)

## Exercise #3: Realtime multiplayer Pizuzzle

Open `public/scripts/play.js`. This is now the file responsible for getting the
game started. We have initial rendering of the game in place, we now need to
make it possible to play again, and to make sure every player receives all
updates.

### Add a move function

When the server sends the `"game:update"` event, we render the initial game
state. We need to do one more thing here. We need to look at the game players,
and find the one that corresponds to the current browser session (as per the
`client` object in this same file). This player object will have a `move`
function assigned to it. The function receives a `cell` object when called. It
should send it with an event to the server:

```js
socket.emit("game:move", cell)`.
```

This is pretty much the whole move function on the client.

### Finishing the socket client

Next up, open `src/socket.js` to finish the server-side part of the equation.
Start by pasting in the following starting point:

```js
var puzzle = require("./puzzle");

function configureSocket(io, games) {
    io.sockets.on("connection", function (socket) {
        socket.on("player:ready", function (data) {
            var game = puzzle.find(games, data.gameId);
            var player = game.players[data.playerId];

            socket.emit("game:update", game);
        });
    });
}

module.exports = { configureSocket: configureSocket };
```

It emits the `game:update` event to start the game. It also needs to do a few
more things. Run the tests and make them pass to finish the socket code.

When you are done, relaunch the server, and you should be good to go.

## Extra exercise

If you finish quickly, add in a measure of "complete". When the matrix array is
fully sorted, the player has solved the task. First one to finish up wins.
