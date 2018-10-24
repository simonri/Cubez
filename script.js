// Test commit

class Debugger {
  constructor() {
    this.mode = false;
    this.FPSRecords = [];

    document.getElementById("dev").onclick = () => (this.mode = !this.mode);
  }

  /* if(this.mode) {
    for(let i = 0; i < this.tiles.length; i++) {
        let t = this.tiles[i];

        let x = t.cX * (t.w / 2);
        let y = t.cY * (t.h / 4);

        if (e.clientX > x && e.clientX < x + t.w / 2) {
        if ((e.clientY > y && e.clientY < y + t.h / 4)) {
        this.data[t.cY][t.cX] = (t.texture < textures.length - 1) ? t.texture + 1 : 0;
        this.tiles[i].texture = (t.texture < textures.length - 1) ? t.texture + 1 : 0;
        }
        }
        }
    } */

  calcFPS() {
    const now = performance.now();
    while (this.FPSRecords.length > 0 && this.FPSRecords[0] <= now - 1000) {
      this.FPSRecords.shift();
    }
    this.FPSRecords.push(now);

    document.getElementById("fps").innerHTML =
      this.FPSRecords.length +
      " - " +
      Math.floor(
        (performance.memory.usedJSHeapSize /
          performance.memory.totalJSHeapSize) *
          100
      ) +
      "%";
  }
}

class Sprite {
  constructor(x, y, w, h, clipX, clipY, texture) {
    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.clipX = clipX;
    this.clipY = clipY;

    this.texture = texture;
  }

  render(ctx, props) {
    const x =
      (this.x * this.w) / 2 +
      (this.y * this.w) / 2 +
      ctx.canvas.width / 2 +
      props.scrollX -
      ((props.cols * this.w) / 2 + (props.cols * this.w) / 2) / 2;
    const y =
      this.y * (this.h - props.offset) -
      this.x * (this.h - props.offset) +
      ctx.canvas.height / 2 +
      props.scrollY -
      ((props.rows / 2) * (this.h - props.offset)) / 2;

    ctx.drawImage(
      this.texture,
      this.clipX / 2,
      this.clipY / 2,
      this.texture.width - this.clipX,
      this.texture.height - this.clipY,
      x,
      y,
      this.w,
      this.h
    );
  }

  update(x, y) {
    this.x = x;
    this.y = y;
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
      promises.push(loadImage(`assets/${srcs[i]}.png`));
    }
    return Promise.all(promises);
  }
}

class Input {
  constructor(docBody) {
    this.keys = [];
    this.mouse = { x: 0, y: 0 };

    this.docBody = docBody;

    this.docBody.addEventListener("keyup", e => {
      this.keys[e.keyCode] = true;
    });
    this.docBody.addEventListener("keydown", e => {
      this.keys[e.keyCode] = false;
    });

    this.docBody.addEventListener("mousedown", () => {
      this.docBody.onmousemove = e => {
        this.mouse.x += e.movementX;
        this.mouse.y += e.movementY;
      };
    });
    docBody.onmouseup = () => (docBody.onmousemove = null);
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

    for (let x = 0; x < seed.length; x++) {
      for (let y = seed.length - 1; y >= 0; y--) {
        data.push({
          texture: this.textures[seed[x][y]],
          x,
          y,
          w:
            (this.props.width / this.props.cols) *
            (1 - this.props.clipX / this.textures[seed[x][y]].width),
          h:
            (this.props.height / this.props.rows) *
            (1 - this.props.clipY / this.textures[seed[x][y]].height)
        });
      }
    }

    return data;
  }

  render(ctx) {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Make copy and reverse to render in right order
    this.data.sprites
      .slice()
      .reverse()
      .map(i => {
        i.render(ctx, this.props);
      });
  }
}

class Data {
  constructor(name, props, data) {
    this.name = name;
    this.data = data;

    this.sprites = this.data.map(
      i => new Sprite(i.x, i.y, i.w, i.h, props.clipX, props.clipY, i.texture)
    );

    document.getElementById("save").onclick = () => this.save();
  }

  save() {
    const a = document.createElement("a");
    const url = URL.createObjectURL(
      new Blob([this.data.join("\n")], { type: "txt" })
    );

    a.href = url;
    a.download = this.name + ".txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  render(ctx, x, y) {
    this.sprites.map(i => {
      i.update(x, y);
      i.render(ctx);
    });
  }
}

class CVS {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.props = {
      width: 1000,
      height: 1000,

      cols: 6,
      rows: 6,

      scrollX: 0,
      scrollY: 0,

      offset: 121,
      clipX: 180,
      clipY: 34
    };
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.Textures = new TextureManager();

    this.Textures.preloadImages(["iso1", "iso2"]).then(
      suc => {
        this.loaded(suc);
      },
      err => {
        console.log(err.map(i => `${i} failed to load.`));
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
  let requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  let cvs = new CVS();

  const express = require("express");
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
  });
  module.exports = router;
  new CVS();
})();
