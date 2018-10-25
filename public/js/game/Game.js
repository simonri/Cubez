/*eslint-env jquery */
/*globals Util Drawing Input*/
function Game(socket, drawing) {
  this.socket = socket;
  this.drawing = drawing;

  this.selfPlayer = null;
  this.otherPlayers = [];
  this.animationFrameId = 0;
  
  this.targetPing = 0;
  this.ping = 0;
}

Game.create = function(socket, canvasElement) {
  canvasElement.width = 800;
  canvasElement.height = 600;
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
  this.socket.on("chat-message", function(data) {
      context.addChatMessage(data);
  });
  
  window.setInterval(function() {
    context.socket.emit('latency', Date.now(), function(startTime) {
      context.targetPing = Date.now() - startTime;
    });
  }, 1000);
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

Game.prototype.addChatMessage = function(message) {
    console.log("Chat message: " + message);
    
    $(".chat").html($(".chat").html() + "\n" + message);
};

Game.prototype.update = function() {
  this.ping += (this.targetPing - this.ping) * 0.06;
  
  $("#ping").html(Math.floor(this.ping));
  if (this.selfPlayer) {
    let timestamp = (new Date()).getTime();
    
    this.socket.emit("player-action", {
      keyboardState: {
        left: Input.LEFT,
        right: Input.RIGHT,
        up: Input.UP,
        down: Input.DOWN,
      },
      timestamp: timestamp
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
