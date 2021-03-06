var props = {
  width: 1000,
  height: 1000,
  cols: 9,
  rows: 9,
  scrollX,
  scrollY,
  offset: 96,
  worldLoaded: false,
};

var lastTime;
var gameTime = 0;

var ctx, canvas;

var debug, input, world, gui;

class CVS {
  constructor() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.insertAdjacentElement("afterbegin", canvas);
    debug = new Debug();
    
    resources.load(["assets/voxelTile_09.png", "assets/voxelTile_26.png", "assets/voxelTile_13.png"]);
    resources.onReady(this.init.bind(this));
  }

  init() {
    debug.log("All assets loaded", resources.time);
    
    input = new Input();
    world = new World();
    gui = new Gui();
    
    input.setMouseEvents();
    
    this.reset();
    lastTime = Date.now();
    this.main();
  }

  main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    
    this.update(dt);
    this.render(dt);

    lastTime = now;

    window.requestAnimationFrame(() => {
      this.main();
    });
  }

  update(dt) {
    gameTime += dt;

    world.updateEntities(dt);
  }

  render(dt) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#90c0ff";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    world.renderEntities();
    gui.render();
  }

  reset() {
    gameTime = 0;

    props.scrollY = 0;
    props.scrollX = 0;
  }
}

(function() {
  console.log("Loading game.");

  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  new CVS();
})();
