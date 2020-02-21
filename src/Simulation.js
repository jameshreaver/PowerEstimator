const MessageStore = require('./MessageStore');
const MessageParser = require('./MessageParser');
const Estimator = require('./PowerEstimator');

class Simulation {

  constructor(power) {
    this.parser = new MessageParser();
    this.batch  = new MessageStore();
    this.estimator = new Estimator(power);
  }

  // Start simulation
  run(lines) {
    // Parse and store messages
    let messages = this.parser.parse(lines);
    this.batch.add(messages);

    // Compute estimate
    let ordered = this.batch.get();
    this.estimator.process(ordered);
  }

  print() {
    let e = this.estimator.estimate;
    console.log("Estimated energy used: "+e+" Wh");
  }
}

module.exports = Simulation;
