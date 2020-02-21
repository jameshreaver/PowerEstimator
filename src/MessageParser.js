const Message = require('./Message');

class MessageParser {

  // Parses lines to Message objects
  parse(lines) {
    return lines.map((line) => {
      return this.parseOne(line);
    });
  }

  parseOne(line) {
    let parts = line.split(' ');
    let timestamp = parseInt(parts[0]);
    let hasDelta = parts[1] === 'Delta';
    let delta = hasDelta ? parseFloat(parts[2]) : -1;
    return new Message(timestamp, delta);
  }

}

module.exports = MessageParser;
