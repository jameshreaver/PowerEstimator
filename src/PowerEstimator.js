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
      this.processMessage(message);
    });
  }

  processMessage(message) {
    // Ignore if older than last timestamp
    if (message.timestamp < this.timestamp) 
      return;
    
    // Compute and update estimate
    let hours = this.computeHours(message);
    this.estimate += hours * this.power * this.lamp.brightness;
    
    // Update variables
    this.timestamp = message.timestamp;
    this.lamp.adjust(message.delta);
  }

  computeHours(message) {
    if (this.timestamp === undefined) return 0;
    return (message.timestamp - this.timestamp)/3600;
  }
  
}

module.exports = PowerEstimator;
