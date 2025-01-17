import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('WaterFill', () => {
  console.log('turn off motor!');
  setTimeout(()=> {
    console.log("reminder turn off");
  },3000)
});
console.log("other operations before WaterFill")
myEmitter.emit('WaterFill');
console.log("other operations after WaterFill")