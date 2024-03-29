const Message = require('../src/Message');

// TESTING UTILITIES

// Random delta value
function delta() {
  let rand = Math.random();
  let delta = rand.toFixed(2);
  return rand > 0.5 ? delta : -delta;
}

// Random timestamp value
function timestamp() {
  let rand = Math.random();
  let timestamp = Math.round(rand * 10000000);
  return timestamp;
}

// Random message with optional timestamp
function message(time = timestamp()) {
  return new Message(
    time, delta()
  );
}


module.exports = {
  delta,
  timestamp,
  message
};
