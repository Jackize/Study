const {parentPort} = require('worker_threads');

let counter = 0
while (counter < 20_000_000_000) {
    counter++;
}
parentPort.postMessage(`Result: ${counter}`)