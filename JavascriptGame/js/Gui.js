class Gui {
  constructor() {
    this.items = [];

    this.addItems();
  }

  render() {
    /* Render White Box */
    /* ctx.fillStyle = "#ffffff";
    /* ctx.rect(0, 0, this.items[0].size[0] + this.items[0].padding * 2, window.innerHeight);
    /* ctx.fill(); */
    
    this.items.forEach(function(item) {
      item.render();
    });
  }

  addItems() {
    this.items.push(new GuiItem("idk", 0, this.items.length));
    this.items.push(new GuiItem("idk", 1, this.items.length));
  }
  
  mouseDown(e) {
    this.items.forEach(function(item) {
      item.mouseDown(e);
    });
  }
  
  mouseUp() {
    this.items.forEach(function(item) {
      item.squeezed = false;
    });
  }
}

class GuiItemTemplate {
  constructor() {
    this.size = [70, 70 * (128 / 111)];
    this.scale = 1;

    this.margin = 60;
    this.padding = 30;
    
    this.squeezed = false;
    this.alpha = 0.7;
  }
}

class GuiItem extends GuiItemTemplate {
  constructor(name, url, id) {
    super();

    this.name = name;
    this.texture = resources.get(url);

    this.pos = [
      this.padding + 0,
      this.padding + (this.size[1] + this.margin) * id
    ];
  }

  render() {
    ctx.globalAlpha = this.alpha;
    
    if(this.squeezed) {
      this.scale += (0.9 - this.scale) * 0.14;
    } else {
      if(Utils.insideRect(input.mouse, this.pos, this.size)) {
        this.scale += (1.2 - this.scale) * 0.14;
        this.alpha += (1 - this.alpha) * 0.14;
      } else {
        if(this.scale != 1) {
          this.scale = (this.scale - 1) * 0.8 + 1;
        }
        if(this.alpha != 0.7) {
          this.alpha = (this.alpha - 0.7) * 0.8 + 0.7;
        }
      }
    }
    
    ctx.drawImage(
      this.texture,
      0,
      0,
      this.texture.width,
      this.texture.height,
      this.pos[0] - (this.size[0] * this.scale - this.size[0]) / 2,
      this.pos[1] - (this.size[1] * this.scale - this.size[1]) / 2,
      this.size[0] * this.scale,
      this.size[1] * this.scale
    );
    
    ctx.globalAlpha = 1;
  }
  
  mouseDown(e) {
    if(Utils.insideRect([e.clientX, e.clientY], this.pos, this.size)) {
      this.squeezed = true;
    }
  }
}
