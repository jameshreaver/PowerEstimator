const util = require('./util');
const assert = require('assert');
const MessageParser = require('../src/MessageParser');

describe('MessageParser', function() {

  let parser;
  let timestamp;

  it('should parse TurnOff message', function() {
    let line = timestamp + " TurnOff";
    let message = parser.parse(line);
    assert.equal(message.timestamp, timestamp);
    assert.equal(message.delta, -1);
  });

  it('should parse positive Delta message', function() {
    let line = timestamp + " Delta +0.5";
    let message = parser.parse(line);
    assert.equal(message.timestamp, timestamp);
    assert.equal(message.delta, 0.5);
  });

  it('should parse negative Delta message', function() {
    let line = timestamp + " Delta -0.75";
    let message = parser.parse(line);
    assert.equal(message.timestamp, timestamp);
    assert.equal(message.delta, -0.75);
  });

  it('should parse TurnOff message with value', function() {
    let line = timestamp + " TurnOff 0.75";
    let message = parser.parse(line);
    assert.equal(message.timestamp, timestamp);
    assert.equal(message.delta, -1);
  });

  before(function() {
    parser = new MessageParser();
  });

  beforeEach(function() {
    timestamp = util.timestamp();
  });

});
