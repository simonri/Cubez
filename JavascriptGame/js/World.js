function World(props) {
    const seed = [
            [1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1]
        ];
        
    this.props = props;
    this.data = new Data("world", props, this.toData(seed));
}

World.prototype.toData = function(seed) {
    const data = [];
    
    for (let posX = 0; posX < seed.length; posX++) {
        for (let posY = seed.length - 1; posY >= 0; posY--) {
            data.push({
                texture: resources.get(seed[posX][posY]),
                posX,
                posY,
                width: (this.props.width / this.props.cols) * (111 / 128),
                height: this.props.height / this.props.rows
            });
        }
    }
    
    return data;
};
    
World.prototype.render = function(ctx) {
    ctx.fillStyle = "#90c0ff";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    this.data.sprites
        .slice()
        .reverse()
        .map(i => {
        i.render(ctx, this.props);
    });
};