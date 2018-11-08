class Sprite {
  constructor(id, pos, size) {
    this.type = id;
    
    this.pos = pos;
    this.size = size;
    
    this.texture = resources.get(id);
}
  
  render() {
    var x = this.pos[0],
        y = this.pos[1],
        z = this.pos[2];
    
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

  update(pos) { this.pos = pos; }
}
