const { Queue } = require("bullmq");

const jobQueue = new Queue("jobQueue", {
    connection: {
        host: "localhost",
        port: 6379
    },

    defaultJobOptions: {
        attempts: 3,

        backoff: {
            type: "fixed",
            delay: 2000
        },

        removeOnComplete: true,
        removeOnFail: false
    }
});

module.exports = jobQueue;























// const { Queue } = require("bullmq");

// const jobQueue = new Queue("jobQueue", {
//     connection: {
//         host: "localhost",
//         port: 6379
//     }
// });

// module.exports = jobQueue;