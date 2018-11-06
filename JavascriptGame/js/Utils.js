var toIso = function(x, y, w, h) {
  var retX =  (x * w) / 2 + (y * w) / 2 + ctx.canvas.width / 2 + props.scrollX - ((props.cols * w) / 2 + (props.cols * w) / 2) / 2;
  var retY = y * (h - props.offset) - x * (h - props.offset) + ctx.canvas.height / 2 + props.scrollY - ((props.rows / 2) * (h - props.offset)) / 2;
  
  return [retX, retY];
};

window.Utils = {
  toIso: toIso,
};