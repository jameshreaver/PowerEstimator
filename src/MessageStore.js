const BTree = require('sorted-btree').default;

class MessageStore {

  constructor() {
    this.store = new BTree();
  }

  // Add message to store
  add(message) {
    this.store.set(
      message.timestamp,
      message
    );
  }

  size() {
    return this.store.size;
  }

  has(message) {
    return this.store.has(
      message.timestamp
    );
  }
  
  get() {
    return this.store.valuesArray();
  }
  
}

module.exports = MessageStore;
