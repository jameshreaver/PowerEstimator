const readline = require('readline');
const Simulation = require('./src/Simulation');


let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lines = [];


rl.on('line', function(line){
    lines.push(line);
})

rl.on('close', function() {
    let simulation = new Simulation(5);
    simulation.run(lines);
    simulation.print();
});
