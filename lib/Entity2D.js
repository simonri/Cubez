const Util = require("../shared/Util");

const DIMENSIONS = 2;

function Entity2D(position, velocity, acceleration, orientation, mass, hitbox) {
  this.position = position || [0, 0];
  this.velocity = velocity || [0, 0];
  this.acceleration = acceleration || [0, 0];
  this.orientation = orientation || [0, 0];
  this.mass = mass || 1;
  this.hitbox = hitbox || 0;

  this.lastUpdateTime = 0;
  this.deltaTime = 0;

  Util.splitProperties(this, ["x", "y"], "position");
  Util.splitProperties(this, ["vx", "vy"], "velocity");
  Util.splitProperties(this, ["ax", "ay"], "acceleration");
}

Entity2D.prototype.applyForce = function(force) {
  for (var i = 0; i < DIMENSIONS; i++) {
    this.acceleration[i] += force[i] / this.mass;
  }
};

Entity2D.prototype.isCollidedWith = function(other) {
  var minDistance = this.hitbox + other.hitbox;

  return (
    Util.getEuclideanDistance2(this._position, other.position) <=
    minDistance * minDistance
  );
};

Entity2D.prototype.update = function(deltaTime) {
  var currentTime = new Date().getTime();

  if (deltaTime) {
    this.deltaTime = deltaTime;
  } else if (this.lastUpdateTime === 0) {
    this.deltaTime = 0;
  } else {
    this.deltaTime = (currentTime - this.lastUpdateTime) / 1000;
  }

  for (var i = 0; i < DIMENSIONS; i++) {
    this.position[i] += this.velocity[i] * this.deltaTime;
    this.velocity[i] += this.acceleration[i] * this.deltaTime;
    this.acceleration[i] = 0;
  }
  this.lastUpdateTime = currentTime;
};

module.exports = Entity2D;
