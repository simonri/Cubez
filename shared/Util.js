function Util() {
  throw new Error("Util should not be instantiated!");
}

Util.splitProperties = function(object, propertyNames, propertyFrom) {
  for (var i = 0; i < propertyNames.length; ++i) {
    (function(j) {
      Object.defineProperty(object, propertyNames[j], {
        enumerable: true,
        configurable: true,
        get: function() {
          return this[propertyFrom][j];
        },
        set: function(property) {
          this[propertyFrom][j] = property;
        }
      });
    })(i);
  }
};

Util.extend = function(child, parent) {
  child.prototype = Object.create(parent);
  child.prototype.parent = parent.prototype;
};

Util.bind = function(context, method) {
  return function() {
    return method.apply(context, arguments);
  };
};

Util.getSign = function(x) {
  if (x > 0) {
    return 1;
  } else if (x < 0) {
    return -1;
  }
  return 0;
};

Util.linearScale = function(x, a1, a2, b1, b2) {
  return ((x - a1) * (b2 - b1)) / (a2 - a1) + b1;
};

Util.sum = function(array) {
  return array.reduce((total, value) => total + value);
};

Util.getManhattanDistance = function(p1, p2) {
  if (p1.length != p2.length) {
    throw new Error(`Cannot compute distance between ${p1} and ${p2}`);
  }
  return Util.sum(
    p1.map((value, index) => {
      return Math.abs(value - p2[index]);
    })
  );
};

Util.getEuclideanDistance2 = function(p1, p2) {
  if (p1.length != p2.length) {
    throw new Error(`Cannot compute distance between ${p1} and ${p2}`);
  }
  return Util.sum(
    p1.map((value, index) => {
      return (value - p2[index]) * (value - p2[index]);
    })
  );
};

Util.getEuclideanDistance = function(p1, p2) {
  return Math.sqrt(Util.getEuclideanDistance2(p1, p2));
};

Util.inBound = function(val, min, max) {
  if (min > max) {
    return val >= max && val <= min;
  }
  return val >= min && val <= max;
};

Util.bound = function(val, min, max) {
  if (min > max) {
    return Math.min(Math.max(val, max), min);
  }
  return Math.min(Math.max(val, min), max);
};

Util.randRange = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.random() * (max - min) + min;
};

Util.randRangeInt = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

Util.choiceArray = function(array) {
  return array[Util.randRangeInt(0, array.length)];
};

if (typeof module === "object") {
  module.exports = Util;
} else {
  window.Util = Util;
}
