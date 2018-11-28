class World {
  constructor() {
    this.seed = this.genRandomWorld(
      4,
      4,
      2,
      [[1],[2]],
      Date.now()
    );

    // TODO: Add chunks.
    
    this.entities = [];
    this.genEntities();
    
    console.log(this.entities);

    document.getElementById("save").onclick = () => this.save();
  }

  genRandomWorld(sX, sY, sZ, c, time) {
    props.cols = sX;
    props.rows = sY;

    var ret = [];
    for (var z = 0; z < sZ; z++) {
      var zDat = [];
      for (var x = 0; x < sX; x++) {
        var xDat = [];
        for (var y = 0; y < sY; y++) {
          xDat.push(c[z][Math.floor(Math.random() * c[z].length)]);
        }
        zDat.push(xDat);
      }
      ret.push(zDat);
    }
    
    debug.log("Generated world", time);
    return ret;
  }

  genEntities() {
    var num = 0;
    var seed = this.seed;
    console.log(this.seed);
    for (var z = seed.length - 1; z >= 0; z--) {
      for (var x = 0; x < seed[0].length; x++) {
        for (var y = seed[0].length - 1; y >= 0; y--) {
          num++;
          this.entities.push(new Sprite(seed[z][x][y], [x, y, z], [111, 128], num));
        }
        
      }
    }
  }

  updateEntities(dt) {
    props.scrollX += (input.mouseMov[0] * 0.5 - props.scrollX) * 0.1;
    props.scrollY += (input.mouseMov[1] * 0.5 - props.scrollY) * 0.1;
  }

  renderEntities() {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.renderEntity(this.entities[i]);
    }
  }

  renderEntity(entity) {
    entity.render();
  }
  
  leftMouseDown(e) {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      if(this.entities[i].hover) {
        this.entities[i].leftMouseDown();
      }
    }
  }

  genTextFile() {
    var data = this.entities
      .map(function(i) {
        let tex = i.texture,
          x = i.pos[0],
          y = i.pos[1];

        return (
          ("0" + x).slice(-2) +
          ("0" + y).slice(-2) +
          tex.src
            .split("/")
            [tex.src.split("/").length - 1].split("_")[1]
            .split(".")[0]
        );
      })
      .join("");

    return URL.createObjectURL(new Blob([data], { type: "txt" }));
  }

  save() {
    let anchor = document.createElement("a");

    let url = this.genTextFile();

    anchor.href = url;
    anchor.download = "world.txt";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
}
