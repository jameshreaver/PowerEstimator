class Lamp {

  constructor() {
    this.brightness = 0;
  }

  // Adjust brightness between 0 and 1
  adjust(delta) {
    let brightness = this.brightness + delta;
    brightness = Math.min(Math.max(brightness, 0), 1);
    this.brightness = brightness;
  }

}

module.exports = Lamp;
