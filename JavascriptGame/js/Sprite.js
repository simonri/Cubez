class Sprite {
  constructor(texture, pos, size) {
    this.pos = pos;
    this.size = size;

    this.texture = texture;
  }

  render() {
    var pos = Utils.toIso(this.pos[0], this.pos[1], this.size[0], this.size[1]);
    
    pos[0] += props.scrollX;
    pos[1] += props.scrollY;
    
    ctx.drawImage(
      this.texture,
      0,
      0,
      this.size[0],
      this.size[1],
      pos[0],
      pos[1],
      this.texture.width,
      this.texture.height
    );
  }

  update(pos) {
    this.pos = pos;
  }
}
