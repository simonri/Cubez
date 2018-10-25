const HashMap = require("hashmap");
const Player = require("./Player");
const Util = require("../shared/Util");

function ServerGame() {
  this.clients = new HashMap();
  this.players = new HashMap();
}

ServerGame.create = () => new Game();

ServerGame.prototype.getPlayers = function() {
  return this.players.values();
};

ServerGame.prototype._callbacks = () => {
  {
    players: Util.bind(this, this.players);
  }
};

ServerGame.prototype.addNewPlayer = function(socket, data) {
  this.clients.set(socket.id, socket);
  this.players.set(socket.id, Player.create(socket.id, [10, 10]));
};

ServerGame.prototype.removePlayer = function(id) {
  this.clients.remove(id);
  this.players.remove(id);
};

ServerGame.prototype.updatePlayerOnInput = function(id, data) {
  var player = this.players.get(id);
  if (player) {
    player.updateOnInput(data.keyboardState);
  }
};

ServerGame.prototype.broadcastChatMessage = function(id, data) {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; i++) {
    this.clients.get(ids[i]).emit("chat-message", data);
  }
};

ServerGame.prototype.update = function() {
  var players = this.getPlayers();
  for (var i = 0; i < players.length; i++) {
    players[i].update();
  }
};

ServerGame.prototype.sendState = function() {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; i++) {
    this.clients.get(ids[i]).emit("update", {
      self: this.players.get(ids[i]),
      players: this.players.values().filter(player => player.id != ids[i])
    });
  }
};

module.exports = ServerGame;
