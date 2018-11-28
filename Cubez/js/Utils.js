var toIso = function(x, y, z, w, h) {
  x += z;
  y -= z;

  var retX =
    (x * w + w * y - props.cols * w + ctx.canvas.width) / 2 + props.scrollX;

  var retY =
    y * (h - props.offset) -
    x * (h - props.offset) +
    (2 * ctx.canvas.height - props.rows * (h - props.offset)) / 4 +
    props.scrollY + 50;

  return [retX + props.scrollX, retY + props.scrollY];
};

var inside = function(point, vs) {
  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

var insideRect = function(point, vs, size) {
  var x = point[0],
    y = point[1];

  var inside = false;
  if (x > vs[0] && x < vs[0] + size[0] && y > vs[1] && y < vs[1] + size[1])
    inside = !inside;

  return inside;
};

var shuffle = function(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

window.Utils = {
  toIso: toIso,
  inside: inside,
  shuffle: shuffle,
  insideRect: insideRect
};
