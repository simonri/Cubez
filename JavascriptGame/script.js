"use strict";

class Debugger {
  constructor() {
    this.mode = false;
    this.FPSRecords = [];

    document.getElementById("dev").onclick = function() { this.mode = !this.mode };
  }

  calcFPS() {
    const now = performance.now();
    while (this.FPSRecords.length > 0 && this.FPSRecords[0] <= now - 1000) {
      this.FPSRecords.shift();
    }
    this.FPSRecords.push(now);

    document.getElementById("fps").innerHTML = this.FPSRecords.length;
  }
}

class Sprite {
  constructor(posX, posY, width, height, clipX, clipY, texture) {
    this.posX = posX;
    this.posY = posY;
    
    this.width = width;
    this.height = height;

    this.clipX = clipX;
    this.clipY = clipY;

    this.texture = texture;
  }

  render(ctx, props) {
    let posX =
      (this.posX * this.width) / 2 +
      (this.posY * this.width) / 2 +
      ctx.canvas.width / 2 +
      props.scrollX -
      ((props.cols * this.width) / 2 + (props.cols * this.width ) / 2) / 2;
    let posY =
      this.posY * (this.height - props.offset) -
      this.posX * (this.height - props.offset) +
      ctx.canvas.height / 2 +
      props.scrollY -
      ((props.rows / 2) * (this.height - props.offset)) / 2;
      
    //console.log(this.width);

    ctx.drawImage(
      this.texture,
      this.clipX / 2,
      this.clipY / 2,
      this.texture.width - this.clipX,
      this.texture.height - this.clipY,
      posX,
      posY,
      this.width,
      this.height
    );
  }

  update(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }
}

class TextureManager {
  constructor() {
    this.textures = [];
  }

  preloadImages(srcs) {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = img.onabort = () => {
          reject(img);
        };
        img.src = src;
      });
    }
    const promises = [];
    for (let i = 0; i < srcs.length; i++) {
      promises.push(loadImage("assets/voxelTile_" + srcs[i] + ".png"));

      console.log("assets/voxelTile_" + srcs[i] + ".png");
    }
    return Promise.all(promises);
  }
}

class Input {
  constructor(docBody) {
    this.keys = [];
    this.mouse = { x: 0, y: 0 };

    this.docBody = docBody;

    this.docBody.addEventListener("keyup", event => {
      this.keys[event.key] = true;
    });
    this.docBody.addEventListener("keydown", event => {
      this.keys[event.key] = false;
    });

    this.docBody.addEventListener("mousedown", () => {
      this.docBody.onmousemove = event => {
        this.mouse.x += event.movementX;
        this.mouse.y += event.movementY;
      };
    });
    this.docBody.onmouseup = () => (this.docBody.onmousemove = null);
  }
}

class Data {
  constructor(name, props, data) {
    this.name = name;
    this.data = data;

    this.sprites = this.data.map(
      i => new Sprite(i.posX, i.posY, i.width, i.height, props.clipX, props.clipY, i.texture)
    );

    document.getElementById("save").onclick = () => this.save();
  }

  save() {
    const anchor = document.createElement("a");
    const url = URL.createObjectURL(
      new Blob([this.data.join("\n")], { type: "txt" })
    );

    anchor.href = url;
    anchor.download = `${this.name}.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  render(ctx, posX, posY) {
    this.sprites.map(sprite => {
      sprite.update(posX, posY);
      sprite.render(ctx);
    });
  }
}

class World {
  constructor(props, textures) {
    const seed = [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1]
    ];

    this.props = props;
    this.textures = textures;

    this.data = new Data("world", props, this.toData(seed));
  }

  toData(seed) {
    const data = [];

    for (let posX = 0; posX < seed.length; posX++) {
      for (let posY = seed.length - 1; posY >= 0; posY--) {
        data.push({
          texture: this.textures[seed[posX][posY]],
          posX,
          posY,
          width:
            (this.props.width / this.props.cols) * (111 / 128),
          height:
            (this.props.height / this.props.rows)
        });
      }
    }

    return data;
  }

  render(ctx) {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.data.sprites
      .slice()
      .reverse()
      .map(i => {
        i.render(ctx, this.props);
      });
  }
}

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

    this.Textures = new TextureManager();

    this.Textures.preloadImages(["47", "41"]).then(
      suc => {
        this.loaded(suc);
      },
      err => {
        console.log("Failed to load image." + err);
      }
    );
  }

  loaded(imgs) {
    this.Textures.textures = imgs;

    console.log("Assets loaded successfully.");

    this.Debugger = new Debugger();
    this.Input = new Input(document.body);
    this.World = new World(this.props, this.Textures.textures);

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