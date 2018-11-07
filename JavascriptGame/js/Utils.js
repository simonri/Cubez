var toIso = function(x, y, z, w, h) {
  var retX =
    (x * w) / 2 +
    (y * w) / 2 +
    ctx.canvas.width / 2 +
    props.scrollX -
    ((props.cols * w) / 2 + (props.cols * w) / 2) / 2;

  var retY =
    y * (h - props.offset) -
    x * (h - props.offset) +
    ctx.canvas.height / 2 +
    props.scrollY -
    ((props.rows / 2) * (h - props.offset)) / 2;
    
  retY -= z;

  return [retX + props.scrollX, retY + props.scrollY];
};

var inside = function(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

window.Utils = {
  toIso: toIso,
  inside: inside,
  shuffle: shuffle
};
