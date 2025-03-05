// import { EventEmitter } from 'node:events';

// class MyEmitter extends EventEmitter {}

// const myEmitter = new MyEmitter();
// myEmitter.on('WaterFill', () => {
//   console.log('turn off motor!');
//   setTimeout(()=> {
//     console.log("reminder turn off");
//   },3000)
// });
// console.log("other operations before WaterFill")
// myEmitter.emit('WaterFill');
// console.log("other operations after WaterFill")


const EventEmitter = require('events');

//Create an instance of an event emitter

const emitter = new EventEmitter();

//Register an event listener for a 'greet' event

emitter.on('greet' , (name) => {
  console.log(`Hello , ${name}! Welcome to nodejs event handling `);
});

emitter.emit('greet' , 'Alice')