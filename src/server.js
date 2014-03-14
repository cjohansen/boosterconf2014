var fs = require("fs");
var formidable = require("formidable");
var ejs = require("ejs");

var GAME_SIZE = 3;

function savePicture(dir, id, picture) {
    var path = "/pictures/" + id + "." + picture.type.split("/")[1];
    var fileName = dir + path;
    fs.createReadStream(picture.path).pipe(fs.createWriteStream(fileName));
    return path;
}

function configureApp(app, games, options) {
    // Serve source files to the browser as well. WARNING! This exposes ALL your
    // source code to everyone. Do not do this in actual production code. To
    // share code in a production setting, create a shared directory or some
    // other dedicated location for browser/node libraries.
    app.get("/src/:file", function (req, res) {
        fs.createReadStream(__dirname + "/" + req.params.file).pipe(res);
    });

    app.post("/games", function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            var game = games.getCurrent(GAME_SIZE);
            var fileName = savePicture(options.public, game.id + "-" + game.players.length, files.picture);
            var player = game.addPlayer(fields.name, fileName);

            res.redirect("/games/" + game.id + "/" + player.id);
        });
    });

    app.get("/games/:id/:player", function (req, res) {
        var game = games.find(parseInt(req.params.id));

        if (!game || !game.players[req.params.player]) {
            res.writeHead(404, { "content-type": "text/html" });
            return res.end("<h1>No such game</h1>");
        }

        fs.readFile(options.views + "/game.ejs", "utf-8", function (err, data) {
            res.writeHead(200, {"content-type": "text/html"});
            res.end(ejs.render(data, {
                game: game,
                player: game.players[req.params.player]
            }));
        });
    });
}

module.exports = {
    configureApp: configureApp
};