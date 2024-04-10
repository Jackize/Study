const express = require("express");

const app = express();
const port = 3000;
const {Worker} = require('worker_threads');
app.get("/non-blocking", (req, res) => {
    res.status(200).send("This page is non-blocking");
});

app.get("/blocking", async(req, res) => {
    // When a task consum a lot of resources, it will block the main thread
    // So it will not be able to do anything else, event try to request path /non-blocking
    // CODE: 
    // let counter = 0
    // while (counter < 10_000_000_000) {
    //     counter++;
    // }
    // res.status(200).send(`This page is blocking - result ${counter}`);

    // Solution: use worker threads
    // We need to create a new worker thread for request consume a lot of resources and then send a message to the worker thread
    // Then the worker thread will send a message back to the main thread
    // So the main thread can do something else
    // CODE:
    const worker = new Worker("./worker.js");
    worker.on("message", (message) => {
        res.status(200).send(message);
    })
    worker.on("error", (error) => {
        res.status(500).send(error);
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
