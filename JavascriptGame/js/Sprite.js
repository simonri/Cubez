function Sprite(posX, posY, width, height, clipX, clipY, texture) {
    this.posX = posX;
    this.posY = posY;
    
    this.width = width;
    this.height = height;
    
    this.clipX = clipX;
    this.clipY = clipY;
    
    this.texture = texture;
}

Sprite.prototype.render = function(ctx, props) {
    let posX =
        (this.posX * this.width) / 2 +
        (this.posY * this.width) / 2 +
        ctx.canvas.width / 2 +
        props.scrollX -
        ((props.cols * this.width) / 2 + (props.cols * this.width) / 2) / 2;
        
    let posY =
        this.posY * (this.height - props.offset) -
        this.posX * (this.height - props.offset) +
        ctx.canvas.height / 2 +
        props.scrollY -
        ((props.rows / 2) * (this.height - props.offset)) / 2;
    
    ctx.drawImage(
        this.texture,
        this.clipX / 2,
        this.clipY / 2,
        this.texture.width - this.clipX,
        this.texture.height - this.clipY,
        posX,
        posY,
        this.width,
        this.height
    );
};

Sprite.prototype.update = function(posX, posY) {
    this.posX = posX;
    this.posY = posY;
};