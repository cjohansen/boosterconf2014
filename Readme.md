# Picture! Puzzle! Pizuzzle!

This reposistory contains the full Pizuzzle multiplayer picture slider game
developed through a workshop at [Boosterconf 2014](http://boosterconf.no).

## Tests

Install dependencies:

```sh
npm install
```

Start the [Buster.JS](http://busterjs.org) server:

```sh
./node_modules/.bin/buster-server
```

Open a browser and visit
[http://localhost:1111/capture](http://localhost:1111/capture). Run tests in
both the browser and on node:

```sh
./node_modules/.bin/buster-test
```

## Play the game

Start the server:

```sh
node index.js
```

Now, two players can upload each their picture, and then compete to the death in
solving the same puzzle, but with different graphics.

[Have fun!](http://localhost:3000)
