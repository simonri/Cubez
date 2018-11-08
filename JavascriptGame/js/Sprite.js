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
    
    // Don't render if not visible
    if(pos[0] < 0 - this.size[0] || pos[0] > window.innerWidth || pos[1] < 0 - this.size[1] || pos[1] > window.innerHeight)
      return;
    
    if(Utils.inside(input.mouse, polygon)) {
      this.z += (100 - z) * 0.04;
    }
    
    if(this.z !== 0)
      this.z *= 0.9;
    
    if(Math.floor(this.z * 10) === 0)
      this.z = 0;
      
    
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
