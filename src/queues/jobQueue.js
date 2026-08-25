const { Queue } = require("bullmq");

const jobQueue = new Queue("jobQueue", {
    connection: {
        host: "localhost",
        port: 6379
    }
});

module.exports = jobQueue;