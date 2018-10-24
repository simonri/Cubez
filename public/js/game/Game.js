function Game(socket, drawing) {
  this.socket = socket;
  this.drawing = drawing;

  this.selfPlayer = null;
  this.otherPlayers = [];
  this.animationFrameId = 0;
}

Game.create = function(socket, canvasElement) {
  canvasElement.width = 800;
  canvasElement.hright = 600;
  canvasElement.style.border = "1px solid black";
  var canvasContext = canvasElement.getContext("2d");

  var drawing = Drawing.create(canvasContext);
  return new Game(socket, drawing);
};

Game.prototype.init = function() {
  var context = this;
  this.socket.on("update", function(data) {
    context.reciveGameState(data);
  });
  this.socket.emit("player-join");
};

Game.prototype.animate = function() {
  this.animationFrameId = window.requestAnimationFrame(
    Util.bind(this, this.update)
  );
};

Game.prototype.stopAnimation = function() {
  window.cancelAnimationFrame(this.animationFrameId);
};

Game.prototype.reciveGameState = function(state) {
  this.selfPlayer = state["self"];
  this.otherPlayers = state["players"];
};

Game.prototype.update = function() {
  if (this.selfPlayer) {
    this.socket.emit("player-action", {
      keyboardState: {
        left: Input.LEFT,
        right: Input.RIGHT,
        up: Input.UP,
        down: Input.DOWN
      }
    });
    this.draw();
  }
  this.animate();
};

Game.prototype.draw = function() {
  this.drawing.clear();

  this.drawing.drawSelf(
    this.selfPlayer.x,
    this.selfPlayer.y,
    this.selfPlayer.hitbox
  );

  for (var player of this.otherPlayers) {
    this.drawing.drawOther(player.x, player.y, player.hitbox);
  }
};
