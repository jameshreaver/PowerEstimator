const BTree = require('sorted-btree').default;

class MessageStore {

  constructor() {
    this.store = new BTree();
  }

  // Add messages to store
  add(messages) {
    messages.forEach((message) => {
      this.addOne(message);
    });
  }

  addOne(message) {
    this.store.set(
      message.timestamp,
      message
    );
  }

  // Wrapper methods

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
