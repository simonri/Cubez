$(document).ready(function() {
  var socket = io();
  var canvas = document.getElementById("canvas");

  Input.applyEventHandlers();
  Input.addMouseTracker(canvas);

  var game = Game.create(socket, canvas);
  game.init();
  game.animate();

  $("input").keyup(function(e) {
    if(e.keyCode == 13) {
      socket.emit("chat-message", $("input").val());
      $("input").val("");
    }
  });
})