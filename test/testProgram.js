const assert = require('assert');
const Program = require('../src/Program');

describe('Program', function() {

  let program;

  it('should work on no input', function() {
    let lines = [];
    program.compute();
    assert.equal(program.estimator.estimate, 0);
  });

  it('should work for turn-off messages only', function() {
    let lines = [
      "1500003600 TurnOff",
      "1500007200 TurnOff",
      "1500010800 TurnOff",
      "1500014400 TurnOff"
    ];
    lines.forEach(line => program.feed(line));
    program.compute();
    assert.equal(program.estimator.estimate, 0);
  });

  it('should handle duplicate messages', function() {
    let lines = [
      "1500000000 TurnOff",
      "1500000000 Delta +1.0",
      "1500003600 TurnOff",
      "1500003600 Delta +1.0",
      "1500007200 TurnOff",
      "1500007200 Delta +1.0",
      "1500010800 TurnOff",
    ];
    lines.forEach(line => program.feed(line));
    program.compute();
    assert.equal(program.estimator.estimate, 15);
  });

  it('should handle out-of-order messages', function() {
    let lines = [
      "1500000000 Delta +0.5",
      "1500021600 TurnOff",
      "1500014400 Delta +0.25",
      "1500003600 Delta +0.5",
      "1500007200 TurnOff",
    ];
    lines.forEach(line => program.feed(line));
    program.compute();
    assert.equal(program.estimator.estimate, 10);
  });
  
  it('should not handle all out-of-order messages when optimised', function() {
    program.optimise = true;
    let lines = [
      "1500000000 Delta +0.5",
      "1500021600 TurnOff",
      "1500014400 Delta +0.25",
      "1500003600 Delta +0.5",
      "1500007200 TurnOff",
    ];
    lines.forEach(line => program.feed(line));
    program.compute();
    assert.notEqual(program.estimator.estimate, 10);
  });
  
  it('should perform space-based optimisation', function() {
    program.optimise = true;
    let lines = [
      "1500000000 TurnOff",
      "1500000001 Delta +1.0",
      "1500000002 TurnOff",
      "1500000003 Delta +1.0",
      "1500000004 TurnOff",
      "1500000005 Delta +1.0",
      "1500000006 TurnOff",
    ];
    lines.forEach((line) => {
      program.feed(line);
      assert(!program.store.full());
    });
  });
  
  it('should perform time-based optimisation', function() {
    program.optimise = true;
    let lines = [
      "1500000000 TurnOff",
      "1500000001 Delta +0.25",
      "1500014400 Delta -0.5"
    ];
    lines.forEach(line => program.feed(line));
    assert.equal(program.store.size(), 1);
  });

  beforeEach(function() {
    program = new Program(5, 3, 1);
  });

});
