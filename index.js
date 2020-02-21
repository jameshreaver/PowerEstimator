const Simulation = require('./src/Simulation');


let lines = [
  "1544206562 TurnOff",
  "1544206563 Delta +0.5",
  "1544210163 Delta -0.25",
  "1544211963 Delta +0.75",
  "1544211963 Delta +0.75",
  "1544213763 TurnOff"
];

let simulation = new Simulation(5);
simulation.run(lines);
simulation.print();
