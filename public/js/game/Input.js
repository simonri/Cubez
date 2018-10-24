function Input() {
  throw new Error("Input should not me instantiated!");
}

Input.LEFT_CLICK = false;
Input.RIGHT_CLICK = false;
Input.MOUSE = [0, 0];

Input.LEFT = false;
Input.UP = false;
Input.RIGHT = false;
Input.DOWN = false;
Input.MISC_KEYS = {};

Input.onMouseDown = function(event) {
  if (event.which === 1) {
    Input.LEFT_CLICK = true;
  } else if (event.which === 3) {
    Input.RIGHT_CLICK = true;
  }
};

Input.onMouseUp = function(event) {
  if (event.which === 1) {
    Input.LEFT_CLICK = false;
  } else if (event.which === 3) {
    Input.RIGHT_CLICK = false;
  }
};

Input.onKeyDown = function(event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      Input.LEFT = true;
      break;
    case 38:
    case 87:
      Input.UP = true;
      break;
    case 39:
    case 68:
      Input.RIGHT = true;
      break;
    case 40:
    case 83:
      Input.DOWN = true;
      break;
    default:
      Input.MISC_KEYS[event.keyCode] = true;
      break;
  }
};

Input.onKeyUp = function(event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      Input.LEFT = false;
      break;
    case 38:
    case 87:
      Input.UP = false;
      break;
    case 39:
    case 68:
      Input.RIGHT = false;
      break;
    case 40:
    case 83:
      Input.DOWN = false;
      break;
    default:
      Input.MISC_KEYS[event.keyCode] = false;
      break;
  }
};

Input.applyEventHandlers = function() {
  document.addEventListener("mousedown", Input.onKeyDown);
  document.addEventListener("mouseup", Input.onMouseUp);
  document.addEventListener("keyup", Input.onKeyUp);
  document.addEventListener("keydown", Input.onKeyDown);
};

Input.addMouseTracker = function(element) {
  document.addEventListener("mousemove", event => {
    Input.MOUSE = [
      event.pageX - element.offsetLeft,
      event.pageY - element.offsetTop
    ];
  });
};
