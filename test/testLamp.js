const assert = require('assert');
const Lamp = require('../src/Lamp');

describe('Lamp', function() {

  let lamp;

  it('should be off when created', function() {
    assert.equal(lamp.brightness, 0);
  });

  it('should be made brighter', function() {
    lamp.adjust(0.5);
    assert.equal(lamp.brightness, 0.5);
  });

  it('should be made darker', function() {
    lamp.adjust(1.0);
    lamp.adjust(-0.75);
    assert.equal(lamp.brightness, 0.25);
  });

  it('should not be brighter than 100%', function() {
    lamp.adjust(1.5);
    assert.equal(lamp.brightness, 1);
  });

  it('should not be darker than 0%', function() {
    lamp.adjust(-1.5);
    assert.equal(lamp.brightness, 0);
  });

  it('should not be darker than 0%', function() {
    lamp.adjust(-1.5);
    assert.equal(lamp.brightness, 0);
  });

  beforeEach(function() {
    lamp = new Lamp();
  });

});