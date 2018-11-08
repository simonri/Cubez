class Gui {
  constructor() {
    this.items = [];

    this.addItems();
  }

  render() {
    this.items.forEach(function(item) {
      item.render();
    });
  }

  addItems() {
    this.items.push(new GuiItem("idk", 0, this.items.length));
    this.items.push(new GuiItem("idk", 1, this.items.length));
  }
}

class GuiItemTemplate {
  constructor() {
    this.size = [90, 90 * (128 / 111)];
    this.scale = 1;

    this.margin = 30;
    this.padding = 20;
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
    ctx.globalAlpha = (this.scale - 0.2);
    
    if (Utils.insideRect(input.mouse, this.pos, this.size)) {
      this.scale += (1.2 - this.scale) * 0.14;
    } else if(this.scale != 1) {
      this.scale = (this.scale - 1) * 0.8 + 1;
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
}
