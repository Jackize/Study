const { parentPort, workerData } = require("worker_threads");

let counter = 0;
while (counter < 20_000_000_000 / workerData.thread_count) {
  counter++;
}
parentPort.postMessage(`Result: ${counter}`);
