const Lamp = require('./Lamp');

class PowerEstimator {

  constructor(power) {
    this.lamp = new Lamp();
    this.power = power;
    this.estimate = 0;
  }

  // Processes ordered messages
  process(messages) {
    messages.forEach((message) => {
      this.processOne(message);
    });
  }

  processOne(message) {
    let hours = this.computeHours(message);
    this.estimate += hours * this.power * this.lamp.brightness;
    this.timestamp = message.timestamp;
    this.lamp.adjust(message.delta);
  }

  computeHours(message) {
    if (this.timestamp === undefined) return 0;
    return (message.timestamp - this.timestamp)/3600;
  }
  
}

module.exports = PowerEstimator;
