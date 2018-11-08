class Input {
  constructor() {
    this.pressedKeys = {};
    this.mouseMov = [0, 0];
    this.mouse = [];
  
    document.addEventListener("keydown", e => {
      this.setKey(e, true);
    });
  
    document.addEventListener("keyup", e => {
      this.setKey(e, false);
    });
    
    window.addEventListener("blue", e => {
      pressedKeys = {};
    });
    
    window.Input = {
      isDown: function(key) {
        return pressedKeys[key.toUpperCase()];
      },
      mouse: this.mouse
    };
  }
  
  setMouseEvents() {
    document.onmousedown = e => {
      gui.mouseDown(e);
      world.mouseDown(e);
      
      document.onmousemove = e => {
        this.mouseMov[0] += e.movementX;
        this.mouseMov[1] += e.movementY;
        
        this.mouse[0] = e.clientX;
        this.mouse[1] = e.clientY;
      };
    };
    
    document.onmousemove = e => {
      this.mouse[0] = e.clientX;
      this.mouse[1] = e.clientY;
    };
  
    document.onmouseup = (e) => {
      gui.mouseUp();
      
      document.onmousemove = e => {
        this.mouse[0] = e.clientX;
        this.mouse[1] = e.clientY;
      };
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