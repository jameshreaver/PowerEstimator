const readline = require('readline');
const Program = require('./src/Program');
const power = 5; // Wh

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


let program = new Program(power);

rl.on('line', function(line){
    program.feed(line);
})

rl.on('close', function() {
    program.compute();
    program.print();
});
