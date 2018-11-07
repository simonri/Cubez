class Sprite {
  constructor(texture, pos, size) {
    this.pos = pos;
    this.size = size;
    
    this.z = 0;
    
    this.texture = texture;
  }

  render() {
    var x = this.pos[0],
        y = this.pos[1],
        z = this.z;
    
    var polygon = [
      Utils.toIso(x - 0.5, y + 1.5, 0, this.size[0], this.size[1]),
      Utils.toIso(x + 0.5, y + 1.5, 0, this.size[0], this.size[1]),
      Utils.toIso(x + 0.5, y + 0.5, 0, this.size[0], this.size[1]),
      Utils.toIso(x - 0.5, y + 0.5, 0, this.size[0], this.size[1])
    ];
    
    var pos = Utils.toIso(x, y, z, this.size[0], this.size[1]);
    
    if(Utils.inside(input.mouse, polygon))
      this.z += (100 - z) * 0.04;
    
    if(this.z !== 0)
      this.z *= 0.9;
      
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
