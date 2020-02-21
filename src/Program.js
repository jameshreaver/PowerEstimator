const MessageStore = require('./MessageStore');
const MessageParser = require('./MessageParser');
const Estimator = require('./PowerEstimator');

class Program {

  constructor(power) {
    this.parser = new MessageParser();
    this.batch  = new MessageStore();
    this.estimator = new Estimator(power);
  }

  // Parse line and store message
  feed(line) {
    let message = this.parser.parse(line);
    this.batch.add(message);
  }
  
  // Compute and update estimate
  compute() {
    let ordered = this.batch.get();
    this.estimator.process(ordered);
  }

  // Outputs current estimate
  print() {
    let e = this.estimator.estimate;
    console.log("Estimated energy used: "+e+" Wh");
  }
}

module.exports = Program;
