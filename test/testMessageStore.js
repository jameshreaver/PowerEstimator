const util = require('./util');
const assert = require('assert');
const MessageStore = require('../src/MessageStore');

describe('MessageStore', function() {

  let store;

  it('should be empty when created', function() {
    assert.equal(store.size(), 0);
  });

  it('should not be empty after message', function() {
    let message = util.message();
    store.add([message]);
    assert.equal(store.size(), 1);
  });

  it('should contain added message', function() {
    let message = util.message();
    store.add([message]);
    assert(store.has(message.timestamp));
  });

  it('should not contain duplicates', function() {
    let message = util.message();
    let duplicate = util.message(message.timestamp);
    store.add([message, duplicate]);
    assert.equal(store.size(), 1);
    assert(store.has(message.timestamp));
  });

  beforeEach(function() {
    store = new MessageStore();
  });

});
