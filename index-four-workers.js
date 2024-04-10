const express = require("express");

const app = express();
const port = 3000;
const { Worker } = require("worker_threads");
  // Windows: wmic cpu get NumberOfCores,NumberOfLogicalProcessors
  // Linux: nproc
  // Use command to get the number of cores
  // Choose the number that you want
const THREAD_COUNT = 4;
app.get("/non-blocking", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

const createWorker = () => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./four-workers.js", {
        workerData: {
            thread_count: THREAD_COUNT
        }
    });
    worker.on("message", (message) => {
      resolve(message);
    });
    worker.on("error", (error) => {
      reject(error);
    });
  });
};
app.get("/blocking", async (req, res) => {
    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
        workerPromises.push(createWorker());
    }
    const results = await Promise.all(workerPromises);
    console.log("results", results);
    res.status(200).send(results.join(" "));

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
