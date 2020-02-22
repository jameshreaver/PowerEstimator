const MessageStore = require('./MessageStore');
const MessageParser = require('./MessageParser');
const Estimator = require('./PowerEstimator');

class Program {

  constructor(power, size = 200, hours = 24, optimise = false) {
    this.optimise = optimise;
    this.parser = new MessageParser();
    this.store  = new MessageStore(size, hours);
    this.estimator = new Estimator(power);
  }

  // Parse line and store message
  feed(line) {
    let message = this.parser.parse(line);
    this.store.add(message);

    if (this.optimise && this.store.full()) {
      let removed = this.store.pruneByTime();
      if (!removed.length)
        removed = this.store.pruneBySpace();
      this.estimator.process(removed);
    }
  }
  
  // Compute and update estimate
  compute() {
    let ordered = this.store.get();
    this.estimator.process(ordered);
  }

  // Outputs current estimate
  print() {
    let e = this.estimator.estimate;
    console.log(`Estimated energy used: ${e} Wh`);
  }
}

module.exports = Program;
