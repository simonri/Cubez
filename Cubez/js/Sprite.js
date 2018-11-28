class Sprite {
  constructor(id, pos, size, index) {
    this.id = id;
    this.index = index;
    
    this.pos = pos;
    this.offset =10;
    this.size = size;
    
    this.texture = resources.get(id);
    this.hover = false;
    
    this.animate = false;
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
    
    var pos = Utils.toIso(x, y, z + this.offset, this.size[0], this.size[1]);
    
    if(!this.animate && x - y + 4 < gameTime * 6) {
      this.animate = true;
    }
    
    if(this.animate) {
      this.offset *= 0.93;
    }
    
    // Don't render if not visible
    if(pos[0] < 0 - this.size[0] || pos[0] > window.innerWidth || pos[1] < 0 - this.size[1] || pos[1] > window.innerHeight && !this.animate)
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
  
  leftMouseDown() {
    this.id = gui.selected;
    this.texture = resources.get(this.id);
  }
  
  update(pos) { this.pos = pos; }
}
