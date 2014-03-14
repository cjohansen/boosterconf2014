/*global React*/
var d = React.DOM;

var Slot = React.createClass({
    render: function () {
        var className = "slot slot" + this.props.slot + " pos" + this.props.pos;
        if (this.props.open) {
            return d.div({ className: className + " open" })
        }
        return d.div({
            className: className,
            style: { backgroundImage: "url(" + this.props.picture + ")" },
            onClick: this.props.click
        })
    }
});

var Pizuzzle = React.createClass({
    render: function () {
        var self = this;

        return d.div({
            className: "pizuzzle"
        }, this.props.layout.map(function (slot, i) {
            return Slot({
                slot: slot.id,
                pos: i,
                picture: self.props.picture,
                open: slot.open,
                click: function () {
                    self.props.move(slot);
                }
            });
        }));
    }
});
