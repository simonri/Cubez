'use strict';
const ctx = document.getElementById("c").getContext("2d");

class Debugger {
    constructor() {
        this.mode = false;
        this.FPSRecords = [];

        document.getElementById("dev").onclick = () => this.mode = !this.mode;
    }

    /*if(this.mode) {
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
    }*/

    calcFPS() {
        let now = performance.now();
        while(this.FPSRecords.length > 0 && this.FPSRecords[0] <= now - 1000) {
            this.FPSRecords.shift();
        }
        this.FPSRecords.push(now);

        document.getElementById("fps").innerHTML = this.FPSRecords.length + " - " + Math.floor((performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100) + "%";
    }
}

class Tile {
    constructor(cX, cY, w, h, texture) {
        this.cX = cX;
        this.cY = cY;

        this.x = 0;
        this.y = 0;

        this.w = w;
        this.h = h;

        this.texture = texture;
    }

    render(devMode) {
        if(this.texture === 3) {
            ctx.drawImage(textures[1], 0, 0, textures[1].width, textures[1].height, this.x, this.y, this.w, this.h);
            if(devMode)
                ctx.drawImage(textures[1], 256/2 - 27, (512/2)*3+3, 54, 54, this.cX * (this.w / 2), this.cY * (this.h / 4), this.w / 2, this.h / 4);
        }
        ctx.drawImage(textures[this.texture], 0, 0, textures[this.texture].width, textures[this.texture].height, this.x, this.y, this.w, this.h);
        if(devMode) // ctx.drawImage(textures[this.texture], 0, 512 / 2, 256, 512 / 2, this.cX * (this.w / 2), this.cY * (this.h / 4), this.w / 2, this.h / 4);
            ctx.drawImage(textures[this.texture], 256/2 - 27, (512/4)*3+3, 54, 54, this.cX * (this.w / 2), this.cY * (this.h / 4), this.w / 2, this.h / 4);

    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }
}

class TextureManager {
    constructor() {
        this.textures = ["iso1","iso2"].map((file) => {
            let img = new Image();
            img.src = "assets/" + file + ".png";
            return img;
        });
    }
}

class SpriteHandler {
    constructor() {
        this.tiles = [];
    }
}

class Input {
    constructor(docBody) {
        this.keys = [];
        this.mouse = [];

        docBody.addEventListener("keyup", (e) => { this.keys[e.keyCode] = true; });
        docBody.addEventListener("keydown", (e) => { this.keys[e.keyCode] = false; });

        docBody.addEventListener("mousedown", (e) => { //game.clickTile(e);
            docBody.addEventListener("mousemove", (e) => { this.mouse.x += e.movementX; this.mouse.y += e.movementY; } );
        });
        docBody.addEventListener("mouseup", () => document.onmousemove = null);
    }
}

class Data {
    constructor(props) {
        this.data = Data.validate([
            [1,1,1,1,1,1],
            [1,0,0,0,0,1],
            [1,0,0,0,0,1],
            [1,0,0,0,0,1],
            [1,0,0,0,0,1],
            [1,1,1,1,1,1],
        ], props);

        document.getElementById("save").onclick = () => this.save();
    }

    static validate(d, props) {
        return d.length === props.cols ? d : "Error";
    }
//https://medium.com/@yyang0903/static-objects-static-methods-in-es6-1c026dbb8bb1
    save() {
        let a = document.createElement("a");
        let url = URL.createObjectURL(new Blob([this.data.join("\n")], {type: "txt"}));

        a.href = url;
        a.download = "data.txt";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

class CVS {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");

        this.props = {
            width: 1000,
            height: 1000,

            cols: 6,
            rows: 6,

            scrollX: 0,
            scrollY: 0,
        };

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.Input = new Input(document.body);
        this.Debugger = new Debugger();
        this.Data = new Data(this.props);
        this.SpriteHandler = new SpriteHandler();
        this.TextureManager = new TextureManager();


        for(let i = 0; i < this.data.length; i++) {
            for(let j = this.data.length - 1; j >= 0; j--) {
                this.tiles.push(new Tile(i, j, this.tileWidth, this.tileHeight, this.data[i][j]));
            }
        }

        window.addEventListener("load", () => { this.update(); } );
    }

    update() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);

        this.offsetX += ((this.mouse.x * 0.5 - this.offsetX) * 0.1);
        this.offsetY += ((this.mouse.y * 0.5 - this.offsetY) * 0.1);

        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for(var i = this.tiles.length - 1; i >= 0; i--) {
            let t = this.tiles[i];

            let x = t.cX * (t.w - 97) + t.cY * (t.w - 97) + ctx.canvas.width / 2 + this.offsetX - (this.data.length * t.w + this.data.length * t.w) / 2;
            let y = t.cY * (t.h - this.offset) - t.cX * (t.h - this.offset) + ctx.canvas.height / 2 + this.offsetY - this.data.length / 2 * (t.h - this.offset) / 2;

            this.tiles[i].update(x, y);
            this.tiles[i].render(this.devMode);
        }

        window.requestAnimationFrame(() => { this.Debugger.calcFPS(); this.update();});
    }
}

(function() {
    let cvs = new CVS();
})()

// https://dev.to/washingtonsteven/playing-with-canvas-and-es6-classes