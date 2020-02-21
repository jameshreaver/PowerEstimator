const util = require('./util');
const assert = require('assert');
const Message = require('../src/Message');

describe('Message', function() {

  it('should have timestamp', function() {
    let timestamp = util.timestamp();
    let message = new Message(timestamp, 0.5);
    assert.equal(message.timestamp, timestamp);
  });

  it('should have delta', function() {
    let delta = util.delta();
    let message = new Message(1544206562, delta);
    assert.equal(message.delta, delta);
  });

});
