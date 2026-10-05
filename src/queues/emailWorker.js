const { Worker } = require("bullmq");

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        console.log("Email Job received:", job.name);
        console.log("Email Job data:", job.data);

        // Baad me yaha actual email send karenge

        return {
            success: true,
            message: "Email job processed"
        };
    },
    {
        connection: {
            host: "localhost",
            port: 6379
        }
    }
);

emailWorker.on("completed", (job) => {
    console.log(`Email Job completed: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
    console.log(`Email Job failed: ${job?.id}`, err);
});

emailWorker.on("error", (err) => {
    console.log("Email Worker error:", err.message);
});


console.log("Email Worker Started...");