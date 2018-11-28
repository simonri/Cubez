class Debug {
  constructor() {
    this.mode = false;
    this.FPSRecords = [];
    
    document.getElementById("dev").onclick = function() {
      this.mode = !this.mode;
    };
  }
  
  calcFPS() {
    const now = performance.now();
    
    while (this.FPSRecords.length > 0 && this.FPSRecords[0] <= now - 1000)
      this.FPSRecords.shift();
    
    this.FPSRecords.push(now);
    document.getElementById("fps").innerHTML = this.FPSRecords.length;
  }
  
  log(msg, time) {
    console.log(msg + " (" + (Date.now() - time) + "ms)");
  }
}