class Data {
  constructor(name, props, data) {
    this.name = name;
    this.data = data;
    
    this.sprites = this.data.map(
      i =>
        new Sprite(
          i.posX,
          i.posY,
          i.width,
          i.height,
          props.clipX,
          props.clipY,
          i.texture
        )
    );

    document.getElementById("save").onclick = () => this.save();
  }

  save() {
    let anchor = document.createElement("a");

    let jsonSave = {
      world: this.dataToStr(this.data),
      background: "green"
    };

    let url = URL.createObjectURL(
      new Blob([JSON.stringify(jsonSave)], { type: "txt" })
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

  dataToStr(data) {
    return data
      .map(
        i =>
          ("0" + i.posX).slice(-2) +
          ("0" + i.posY).slice(-2) +
          i.texture.src
            .split("/")
            [i.texture.src.split("/").length - 1].split("_")[1]
            .split(".")[0]
      )
      .join("");
  }
}