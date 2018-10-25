function Drawing(context) {
  this.context = context;
}

Drawing.create = context => new Drawing(context);

Drawing.createImage = function(src, width, height) {
  let image = new Image(width, height);
  image.src = src;
  return image;
};

Drawing.prototype.clear = function() {
  let canvas = this.context.canvas;
  
  this.context.clearRect(0, 0, canvas.width, canvas.height);
  
  this.context.fillStyle = "#212121";
  this.context.fillRect(0, 0, canvas.width, canvas.height);
};

Drawing.prototype.drawSelf = function(x, y, size) {
  this.context.save();
  this.context.beginPath();
  this.context.fillStyle = "#FF6F00";
  this.context.arc(x, y, size, 0, Math.PI * 2);
  this.context.fill();
  this.context.restore();
};

Drawing.prototype.drawOther = function(x, y, size) {
  this.context.save();
  this.context.beginPath();
  this.context.fillStyle = "red";
  this.context.arc(x, y, size, 0, Math.PI * 2);
  this.context.fill();
  this.context.restore();
};
