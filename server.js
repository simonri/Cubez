const DEV_MODE = process.argv.indexOf("--dev") != -1;
const FPS = 60;
const PORT = process.env.PORT || 5000;

const express = require("express");
const http = require("http");
const morgan = require("morgan");
const socketIO = require("socket.io");

const Game = require("./lib/Game");

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game = Game.create();

app.set("port", PORT);
app.set("view engine", "pug");

app.use(morgan("dev"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/shared", express.static(__dirname + "/shared"));

app.use("/", (request, response) => {
  response.render("index");
});

io.on("connection", (socket) => {
  socket.on("player-join", () => {
    game.addNewPlayer(socket);
  });

  socket.on("player-action", (data) => {
    game.updatePlayerOnInput(socket.id, data);
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
  });
});

setInterval(() => {
  game.update();
  game.sendState();
}, 1000 / FPS);

server.listen(PORT, function() {
  console.log("Starting server on port " + PORT);
  if(DEV_MODE) {
    console.log("Dev mode enabled");
  }
});