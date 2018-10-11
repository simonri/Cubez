var ctx = document.getElementById("c").getContext("2d");

// Hej

var textures = [
    document.getElementsByTagName("img")[1],
    document.getElementsByTagName("img")[0],
    document.getElementsByTagName("img")[2],
    document.getElementsByTagName("img")[3],
    document.getElementsByTagName("img")[4],
];

function Tile(cX, cY, w, h, texture) {
    this.cX = cX;
    this.cY = cY;

    this.x = 0;
    this.y = 0;

    this.w = w;
    this.h = h;

    this.texture = texture;

    this.render = function() {
        if(this.texture === 3) {
            ctx.drawImage(textures[1], 0, 0, 256, 512, this.x, this.y, this.w, this.h);
            ctx.drawImage(textures[1], 0, 512 / 2, 256, 512 / 2, this.cX * (this.w / 2), this.cY * (this.h / 4), this.w / 2, this.h / 4);
        }
        ctx.drawImage(textures[this.texture], 0, 0, 256, 512, this.x, this.y, this.w, this.h);
        ctx.drawImage(textures[this.texture], 0, 512 / 2, 256, 512 / 2, this.cX * (this.w / 2), this.cY * (this.h / 4), this.w / 2, this.h / 4);

    };

    this.update = function(x, y) {
        this.x = x;
        this.y = y;
    };
}

function Game() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    let mouse = { x: 0, y: 0 };

    let worldSize = 900;
    let offset = worldSize * 0.105;

    let offsetX = 0,
        offsetY = 0;

    let data = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
    ];

    let tileWidth = worldSize / data.length,
        tileHeight = (worldSize / data.length) * (512 / 256);

    let times = [];
    let tiles = [];

    /*let tiles = [].concat.apply([], data.map((x, i) => {
      return x.map((y, j) => {
          return new Tile(i, j, tileWidth, tileHeight, textures[y]);
      });
    }));*/


    for(var i = 0; i < data.length; i++) {
        for(var j = data.length - 1; j >= 0; j--) {
            tiles.push(new Tile(i, j, tileWidth, tileHeight, data[i][j]));
        }
    }

    document.onmousedown = function(e) {
      for(i = 0; i < tiles.length; i++) {
            let x = tiles[i].cX * (tiles[i].w / 2);
            let y = tiles[i].cY * (tiles[i].h / 4);
            if(
                (e.clientX > x && e.clientX < x + tiles[i].w / 2) &&
                (e.clientY > y && e.clientY < y + tiles[i].h / 4)
            ) {
                data[tiles[i].cY][tiles[i].cX] = (tiles[i].texture < textures.length - 1) ? tiles[i].texture + 1 : 0;
                tiles[i].texture = (tiles[i].texture < textures.length - 1) ? tiles[i].texture + 1 : 0;
            }
        }
        document.onmousemove = function(e) {
            mouse.x += e.movementX;
            mouse.y += e.movementY;
        };
    };

    document.onmouseup = function() { document.onmousemove = null };
    
    this.saveData = function() {
        let a = document.createElement("a");
        let url = URL.createObjectURL(new Blob([data.join("\n")], {type: "txt"}));
        
        a.href = url;
        a.download = "data.txt";
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    this.loop = function() {
        this.render();
        document.getElementById("fps").innerHTML = times.length;

        window.requestAnimationFrame(() => {
            let now = performance.now();
            while(times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);

            this.loop();
        });
    };

    this.render = function() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);

        offsetX += ((mouse.x * 0.5 - offsetX) * 0.1);
        offsetY += ((mouse.y * 0.5 - offsetY) * 0.1);

        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for(var i = tiles.length - 1; i >= 0; i--) {
            let t = tiles[i];

            let x = t.cX * t.w / 2 + t.cY * t.w / 2 + ctx.canvas.width / 2 + offsetX - (data.length * t.w / 2 + data.length * t.w / 2) / 2;
            let y = t.cY / 2 * (t.h - offset) / 2 - t.cX / 2 * (t.h - offset) / 2 + ctx.canvas.height / 2 + 60 + offsetY - data.length / 2 * (t.h - offset) / 2;

            tiles[i].update(x, y);
            tiles[i].render();
        }
    };
}

var game = new Game();
game.loop();

document.getElementById("save").onclick = function() { game.saveData() };