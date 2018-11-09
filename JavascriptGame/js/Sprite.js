class Sprite {
  constructor(id, pos, size) {
    this.id = id;
    
    this.pos = pos;
    this.size = size;
    
    this.texture = resources.get(id);
    this.hover = false;
}
  
  render() {
    var x = this.pos[0],
        y = this.pos[1],
        z = this.pos[2];
    
    var polygon = [
      Utils.toIso(x - 0.5, y + 1.5, z, this.size[0], this.size[1]),
      Utils.toIso(x + 0.5, y + 1.5, z, this.size[0], this.size[1]),
      Utils.toIso(x + 0.5, y + 0.5, z, this.size[0], this.size[1]),
      Utils.toIso(x - 0.5, y + 0.5, z, this.size[0], this.size[1])
    ];
    
    var pos = Utils.toIso(x, y, z, this.size[0], this.size[1]);
    
    // Don't render if not visible
    if(pos[0] < 0 - this.size[0] || pos[0] > window.innerWidth || pos[1] < 0 - this.size[1] || pos[1] > window.innerHeight)
      return;
    
    if(Utils.inside(input.mouse, polygon)) {
      this.hover = true;
    } else {
      this.hover = false;
    }
    
    ctx.beginPath();
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
  
  mouseDown() {
    this.id = gui.selected;
    this.texture = resources.get(this.id);
  }
  
  update(pos) { this.pos = pos; }
}
