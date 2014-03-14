var puzzle = require("./puzzle");

function configureSocket(io, games) {
    io.sockets.on("connection", function (socket) {
        socket.on("player:ready", function (data) {
            var game = games.find(data.gameId);
            var player = game.players[data.playerId];

            game.on("update", function (gameData) {
                socket.emit("game:update", gameData);
            });

            socket.on("game:move", function (cell) {
                game.move(player, cell.id);
            });

            socket.emit("game:update", game);
        });
    });
}

module.exports = { configureSocket: configureSocket };
