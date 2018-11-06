class Input {
  constructor() {
    this.pressedKeys = {};
    this.mouse = { x: 0, y: 0 };
  
    document.addEventListener("keydown", e => {
      this.setKey(e, true);
    });
  
    document.addEventListener("keyup", e => {
      this.setKey(e, false);
    });
    
    window.addEventListener("blue", e => {
      pressedKeys = {};
    });
    
    document.onmousedown = e => {
      document.onmousemove = e => {
        this.mouse.x += e.movementX;
        this.mouse.y += e.movementY;
      };
    };
  
    document.onmouseup = () => {
      document.onmousemove = null;
    };
    
    window.Input = {
      isDown: function(key) {
        return pressedKeys[key.toUpperCase()];
      },
      mouse: this.mouse
    };
  }

  setKey(event, status) {
    let code = event.keyCode;
    let key;
    
    switch(code) {
      case 32:
        key = "SPACE"; break;
      case 37:
        key = "LEFT"; break;
      case 38:
        key = "UP"; break;
      case 39:
        key = "RIGHT"; break;
      case 40:
        key = "DOWN"; break;
      default:
        key = String.fromCharCode(code);
    }
    
    this.pressedKeys[key] = status;
  }
}