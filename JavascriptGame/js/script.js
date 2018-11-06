class CVS {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.ctx.rect(10, 10, 100, 100);
    this.ctx.fill();

    this.props = {
      width: 1000,
      height: 1000,

      cols: 6,
      rows: 6,

      scrollX: 0,
      scrollY: 0,

      offset: 125,
      clipX: 0,
      clipY: 0
    };
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    resources.load([
        "assets/voxelTile_47.png",
        "assets/voxelTile_41.png"
    ]);
    
    resources.onReady(this.start.bind(this));
}

  start() {
    console.log("All assets loaded successfully.");
    
    this.Debugger = new Debugger();
    this.Input = new Input();
    this.World = new World(this.props);
    
    window.addEventListener("load", () => {
        this.update();
    });
  }

  update() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.width);

    this.props.scrollX += (this.Input.mouse.x * 0.5 - this.props.scrollX) * 0.1;
    this.props.scrollY += (this.Input.mouse.y * 0.5 - this.props.scrollY) * 0.1;

    this.World.render(this.ctx);

    window.requestAnimationFrame(() => {
      this.Debugger.calcFPS();
      this.update();
    });
  }
}

(function() {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  new CVS();
})();