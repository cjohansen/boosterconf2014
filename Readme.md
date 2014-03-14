# Picture! Puzzle! Pizuzzle!

Welcome to the picture slider puzzle. This repo will guide you through building
your first Node.JS/React app. You may not always have wanted a multi-player
picture slider, but that's what you'll get when you're done.

Before you do anything else, quit reading this file in a text editor. In your
console, cd into the project directory and install all its dependencies:

```sh
cd path/to/pizuzzle
npm install
```

This will include (as a development dependency) the morkdown module. Now you can
fire up a decent reader:

```sh
./node_modules/.bin/morkdown -w Readme.md
```

This pops up a minimalistic Chrome window (you may have to "OK" it) with nicely
rendered markdown. (Note: on OSX the window may be launched in the background,
use your app switcher to find it).

## Your assignment

The first task today is to write a "plain old JavaScript" model API for the
picture sliding game. To Node it up just a little, we will make the model an
_event emitter_. Event emitters are everywhere in Node, and knowing how to use
them, and how to wield them in your own designs will take you far.

Before you dive in, allow me to introduce you to the app skeleton you now find
yourself in.

## Finding your way around

The app skeleton contains some boiler-plate that there is no time for today, but
it is helpful to know what it is.

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

## Exercise #1: The pizuzzle model

In `test/puzzle-test.js`, you will find a bunch of tests describing one possible
API to work with a picture slider. It represents a picture slider as a single
array:

```js
[{id: 2, open: false}, {id: 1, open: false}, {id: 4, open: true}, {id: 3, open: false}]

/* Basically represents:
[Picture slot (#2)] [Picture slot (#1)]
[Blank slot   (#4)] [Picture slot (#3)]
*/
```

In this example, the slider has a 2x2 grid. It is represented by an array of 4
elements. The only slots that can move are #2 and #3 - these can move to fill
the blank slot, leaving their current position blank. The goal of the game is to
arrange the slots such that the array lists all the slots in the right order
(i.e. 1, 2, 3, 4).

### Puzzles and event emitters

Certain actions changes the game's state. When a player joins the game, the
overall state changes by having a new player added. When either player moves a
slot, the state changes to reflect the move. These events will be broadcast
using *event emitters*. Node ships a nice one that works like this:

```js
var EventEmitter = require("events").EventEmitter;

var emitter = new EventEmitter();
emitter.on("message", function (msg) {
    console.log(msg);
});

emitter.emit("message", "Hello world"); // Prints "Hello world"
```

This is a very convoluted way to print to the console, but it does illustrate
the basic usage of event emitters.

### Running the tests

[Buster.JS](http://docs.busterjs.org) is used for testing. You may want to run
them:

```sh
./node_modules/.bin/buster-test
```

This will complain about a missing source file. Create an empty file in
`src/puzzle.js` and try again. It's going to have a lot to say. If you get
depressed by the crazy amount of output from the tests, here's a trick: Open the
`test/puzzle.js` file and change the very first test to look like this:

```js
buster.testCase("Puzzle", {
    "createGame": {
        "=> creates new game": function () {
            var game = puzzle.createGame(3);

            assert.equals(game.layout.length, 9);
            assert.equals(game.layout.filter(function (c) { return c.id === 0; }).length, 1);
        },

        // ...
    }
});
```

I.e. prepend the test name with a `=>` - this is called the "focus rocket". Now,
make sure you only run the one test file we're going to work on:

```sh
./node_modules/.bin/buster-test -t test/puzzle-test.js
```

As you solve each test, you can add a focus rocket to the next one. This way,
you only have one failing test at a time (and possibly previously working ones
that you broke). When you've passed them all, you can remove the focus rockets.

### Walk through, first test

The first test asks that `createGame` returns a game object that has a layout.
To pass the test, we must first create the file. In the top of the test file,
you will see:

```js
var puzzle = require("../../src/puzzle");
```

Open the src/puzzle.js file, and add the following scaffolding to it:

```js
module.exports = {
    createGameCollection: function () {
        var games = [];

        return {
            add: function (game) {
                games.push(game);
                return game;
            },

            count: function () {
                return games.length;
            },

            get: function (i) {
                return games[i];
            },

            find: function (id) {
                return games.filter(function (g) { return g.id === id; })[0];
            },

            /**
             * If there are any pending games (i.e. with less than 2 players),
             * return it. Otherwise, create a new game and return that.
             */
            getCurrent: function (size) {
            }
        };
    },

    createGame: function (size) {
        return {
            /**
             * Create a new player object, add it to the game and return it.
             */
            addPlayer: function (name, picture) {
            },

            /**
             * Attempt a move. Return game object.
             */
            move: function (player, cellId) {
            }
        };
    }
};
```

Run the tests again, and you should see a different error message. Return an
object with a layout:

```js
createGame: function (size) {
    return { layout: [{id: 0}] };
}
```

This won't quite be enough to pass the tests - we need 9 cells for a size 3
game. You may want to require the `matrix` library in the same directory
(`var matrix = require("./matrix");`) to help with this.

By the way, if you've never seen this before:

```js
game.layout.filter(function (c) { return c.id === 0; });

// Same as this:
function idIsZero(c) {
    return c.id === 0;
}

game.layout.filter(idIsZero);
```

Here's what happens:

* The `filter` method builds a new array
* It loops the array "from the inside"
* For every item in the array, the passed-in function (e.g. `idIsZero`) is called
* If the function returns `true`, the corresponding item is included in the new array
* If the function returns `false`, the corresponding item is not included in the new array
* Return the new array

Now make those tests pass, and come back here when you are done.

## Creating games in the browser

The model won't do us much good if we don't offer some kind of UI for it. To
build out the server part, there is a test case in `test/server-test.js`. You
will implement the server component by making these tests pass as well.

Start by creating `src/server.js` with the following content:

```js
var fs = require("fs");
var ejs = require("ejs");
var formidable = require("formidable");

/**
 * Takes an Express app and configures it as a Pizuzzle controller.
 *
 * app     An Express app
 * games   A list of games (an array)
 * options An object of options:
 *         { views: "path/to/views", public: "path/to/public" }
 */
function configureApp(app, games, options) {
    // Serve source files to the browser as well. WARNING! This exposes ALL your
    // source code to everyone. Do not do this in actual production code. To
    // share code in a production setting, create a shared directory or some
    // other dedicated location for browser/node libraries.
    app.get("/src/:file", function (req, res) {
        fs.createReadStream(__dirname + "/" + req.params.file).pipe(res);
    });

    app.post("/games", function (req, res) {
        // Use formidable to parse the incoming request
        // https://github.com/felixge/node-formidable

        // You can use fs.writeFile to save the file to disk in the public
        // directory. Use the public property of the options object as the
        // directory to save it in.
        // http://nodejs.org/api/fs.html

        // You can redirect manually with Node:
        //     res.writeHead(302, {"location": "..."});
        //     res.end();
        //
        // ...or with Express:
        // res.redirect("...");
    });

    app.get("/games/:id/:player", function (req, res) {
        // Render the game.ejs template. The template lives in the views
        // directory (e.g. use options.views to find it). The template expects
        // to be rendered with a game and a player:
        //     ejs.render(tplData, { game: ..., player: ... });
        //
        // You must load the template data from file yourself
    });
}

module.exports = { configureApp: configureApp };
```

Fill in the empty spaces by passing one test after another.

When all the tests pass, e.g. `./node_modules/.bin/buster-test` prints a green
summary, you can start the server:

```sh
node index.js
```

Then open [http://localhost:3000/](http://localhost:3000/). You can upload
pictures now, yay!

## Additional exercise

If you work really fast, you may run out of things to do. Open `src/matrix.js`.
Notice that it, like some of the test files, has some boiler-plate on the top
and bottom of the file? This is the minimal boilerplate required to load the
same file in Node and the browser (unless you're willing to include some kind of
compilation step).

Go forth and make puzzle.js as cross-platform as its brother, the Matrix. When
you are done, you prove the worthiness of your efforts by uncommenting the
browser configuration in the `buster.js` file in the root of the project. To run
the browser tests:

```sh
./node_modules/.bin/buster-server
```

Open [http://localhost:1111/capture](http://localhost:1111/capture) in a
browser. Then head back to the console:

```sh
./node_modules/.bin/buster-test
```

This will run both your Node and your browser tests. (Future versions of
Buster.JS will present this as a single run with many tests instead of two
separate runs).

The Node `EventEmitter` does not run in the browser out of the box. To remedy
this, use the `bane` library:

```js
var bane = require("bane");

var myEmitter = bane.createEventEmitter({
    custom: "properties",
    speak: function () {
        this.emit("message", "Hello world");
    }
});

myEmitter.on("message", function (msg) {
    console.log(msg);
});

myEmitter.speak(); // Prints "Hello world"
```

Before you proceed with the next exercise, undo your changes to the `buster.js`
file to avoid Git conflicts:

```sh
git checkout buster.js
```
