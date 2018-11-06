function Input() {
   this.keys = [];
   this.mouse = { x: 0, y: 0 };
   
   document.body.addEventListener("keyup", event => {
      this.keys[event.key] = true;
   });
   
   document.body.addEventListener("keydown", event => {
      this.keys[event.key] = false;
   });
   
   document.body.addEventListener("mousedown", () => {
      document.body.onmousemove = event => {
         this.mouse.x += event.movementX;
         this.mouse.y += event.movementY;
      };
   });
   
   document.body.onmouseup = () => document.body.onmousemove = null;
}