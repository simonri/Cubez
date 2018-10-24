function Sound(sounds) {
  this.sounds = sounds;
}

Sound.BASE_URL = "/public/shound";

Sound.SOUND_SRCS = {};

Sound.create = function() {
  return new Sound(
    Sound.SOUND_SRCS.map(src => {
      return new Howl({ src: Sound.BASE_URL + src });
    })
  );
};

Sound.prototype.play = function(sound, volume, rate) {
  var sound = this.sounds[sound];
  var id = sound.play();
  if (typeof volume === "number") {
    sound.volume(Util.bound(volume, 0, 1), id);
  }
  if (typeof rate === "number") {
    sound.rate(Util.bound(rate, 0.5, 4), id);
  }
};
