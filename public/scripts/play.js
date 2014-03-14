/*global React, io, MultiplayerPuzzle*/
(function () {
    var puzzleEl = document.getElementById("puzzle-container");

    // Our game and player
    var client = {
        gameId: parseInt(puzzleEl.getAttribute("data-game-id")),
        playerId: parseInt(puzzleEl.getAttribute("data-player-id"))
    };

    // Connect web sockets
    var socket = io.connect("http://localhost");

    // Initialize the main React component
    var gameUI = MultiplayerPuzzle({});

    // The server will emit this event every time the game state changes
    socket.on("game:update", function (game) {
        game.players.forEach(function (player) {
            // Bless the current player with the ability to move slots
            // This ensures every player can only move slots in their
            // own game
            if (player.id === client.playerId) {
                player.move = function (cell) {
                    socket.emit("game:move", cell);
                };
            }
        });

        gameUI.setState(game);
    });

    // Tell the server we're ready to go (it will fire back a game:update event)
    socket.emit("player:ready", client);

    React.renderComponent(gameUI, puzzleEl);
}());
