class World {
  constructor() {
    let seed = [
      [1, 0, 1, 0, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 1],
      [1, 0, 0, 1, 0, 1, 1, 0, 0],
      [1, 0, 1, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0],
    ];
    
    seed.forEach(function(itm, inx) {
      seed[inx] = Utils.shuffle(itm);
    });

    this.entities = this.genEntities(seed);
    
    document.getElementById("save").onclick = () => this.save();
  }

  genEntities(seed) {
    const entities = [];

    for (let x = 0; x < seed.length; x++) {
      for (let y = seed.length - 1; y >= 0; y--) {
        entities.push(new Sprite(resources.get(seed[x][y]), [x, y], [111, 128]));
      }
    }

    return entities;
  }

  updateEntities(dt) {
    props.scrollX += (input.mouseMov[0] * 0.5 - props.scrollX) * 0.1; // * dt
    props.scrollY += (input.mouseMov[1] * 0.5 - props.scrollY) * 0.1; // * dt
  }

  renderEntities() {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.renderEntity(this.entities[i]);
    }
  }

  renderEntity(entity) {
    entity.render();
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
