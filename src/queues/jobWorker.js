const { Worker } = require("bullmq");

const worker = new Worker(
    "jobQueue",
    async (job) => {
        console.log("Job received:", job.name);
        console.log("Job data:", job.data);

        // Yaha baad me actual job processing ka code aayega
    },
    {
        connection: {
            host: "localhost",
            port: 6379
        }
    }
);

worker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.log(`Job failed: ${job.id}`, err);
});

worker.on("error", (err) => {
    console.log("Worker error:", err.message);
});

console.log("Job Worker Started...");