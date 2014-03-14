/*global React, Pizuzzle*/
var d = React.DOM;

function byId(a, b) {
    return a.id < b.id ? -1 : 1;
}

function sortedLayout(player) {
    player.layout = player.layout.sort(byId);
    return player;
}

var Player = React.createClass({
    render: function () {
        return d.div({ className: "col-md-6" },
                     d.h2({}, this.props.name),
                     Pizuzzle(this.props));
    }
});

var MultiplayerPuzzle = React.createClass({
    getInitialState: function () {
        return { players: this.props.players || [] };
    },

    render: function () {
        var players = this.state.players;
        var heading = "Pizzuzle to the death!";

        if (players.length < 2) {
            heading = "Waiting for all players";
            players = players.map(sortedLayout);
        }

        return d.div({}, d.div({ className: "jumbotron" },
                               d.h1({}, heading)),
                     d.div({ className: "row" },
                           players.map(Player)));
    }
});