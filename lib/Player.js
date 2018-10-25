const Entity2D = require("./Entity2D");
const Util = require("../shared/Util");

function Player(id) {
  Entity2D.call(this, [10, 10], null, null, null, null, Player.HITBOX);
  this.id = id;
}
Util.extend(Player, Entity2D);

Player.HITBOX = 10;

Player.create = id => new Player(id);

Player.prototype.updateOnInput = function(keyboardState, timestamp) {
  this.vy = 100 * (Number(keyboardState.down) - Number(keyboardState.up));
  this.vx = 100 * (Number(keyboardState.right) - Number(keyboardState.left));
};

Player.prototype.update = function() {
  this.parent.update.call(this);
};

module.exports = Player;
