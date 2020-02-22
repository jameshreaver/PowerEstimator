const BTree = require('sorted-btree').default;

class MessageStore {

  constructor(maxSize, maxHours) {
    this.maxSize = maxSize;
    this.maxSecs = maxHours * 3600;
    this.store = new BTree();
  }

  // Add message to store
  add(message) {
    this.store.set(
      message.timestamp,
      message
    );
  }
  
  // Remove and return oldest message
  pruneBySpace() {
    let key = this.store.minKey();
    let oldest = this.store.get(key);
    this.store.delete(key);
    return [oldest];
  }

  // Remove and return oldest messages
  pruneByTime() {
    let min = this.store.minKey();
    let max = this.store.maxKey() - this.maxSecs;
    let oldest = this.store.getRange(min, max);
    this.store.deleteRange(min, max);
    return oldest.map((pair) => {
      return pair.pop();
    });
  }

  size() {
    return this.store.size;
  }

  full() {
    return this.store.size == this.maxSize;
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
