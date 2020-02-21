const util = require('./util');
const assert = require('assert');
const Message = require('../src/Message');
const Estimator = require('../src/PowerEstimator');

describe('PowerEstimator', function() {

  let estimator;

  it('should estimate no messages correctly', function() {
    let messages = [];
    estimator.process(messages);
    assert.equal(estimator.estimate, 0);
  });

  it('should estimate separate messages correctly', function() {
    estimator.process([new Message(0, 1)]);
    estimator.process([new Message(3600, 0)]);
    assert.equal(estimator.estimate, 5);
  });

  it('should estimate full power for an hour', function() {
    let messages = [
      new Message(0, 1),
      new Message(3600, 0)
    ];
    estimator.process(messages);
    assert.equal(estimator.estimate, 5);
  });

  it('should estimate half power for two hours', function() {
    let messages = [
      new Message(0, 0.5),
      new Message(7200, 0)
    ];
    estimator.process(messages);
    assert.equal(estimator.estimate, 5);
  });

  it('should estimate triple power for two hours', function() {
    estimator = new Estimator(15);
    let messages = [
      new Message(0, 1),
      new Message(7200, 0)
    ];
    estimator.process(messages);
    assert.equal(estimator.estimate, 30);
  });

  it('should estimate first case correctly', function() {
    let messages = [
      new Message(1544206562, -1),
      new Message(1544206563, 0.5),
      new Message(1544210163, -1),
    ];
    estimator.process(messages);
    assert.equal(estimator.estimate, 2.5);
  });

  it('should estimate second case correctly', function() {
    let messages = [
      new Message(1544206562, -1),
      new Message(1544206563, 0.5),
      new Message(1544210163, -0.25),
      new Message(1544211963, 0.75),
      new Message(1544211963, 0.75),
      new Message(1544213763, -1),
    ];
    estimator.process(messages);
    assert.equal(estimator.estimate, 5.625);
  });

  beforeEach(function() {
    estimator = new Estimator(5);
  });

});
