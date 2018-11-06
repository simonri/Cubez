class TextureManager {
  constructor() {
    this.textures = [];
  }

  preloadImages(srcs) {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = img.onabort = () => {
          reject(img);
        };
        img.src = src;
      });
    }
    const promises = [];
    for (let i = 0; i < srcs.length; i++) {
      promises.push(loadImage("assets/voxelTile_" + srcs[i] + ".png"));

      console.log("Loaded: voxelTile_" + srcs[i] + ".png");
    }
    return Promise.all(promises);
  }
}