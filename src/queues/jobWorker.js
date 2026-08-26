const jobHistoryModel = require("../models/jobHistoryModel");
const { Worker } = require("bullmq");

const connectDB = require("../config/db");
require("dotenv").config();

async function startWorker() {

    // MongoDB connection
    await connectDB();

const worker = new Worker(
    "jobQueue",
    
        // throw new Error("Testing Retry Mechanism");


        // Yaha baad me actual job processing ka code aayega

        async (job) => {
            console.log("Job received:", job.name);
            console.log("Job data:", job.data);

    const history = await jobHistoryModel.create({
    queueJobId: String(job.id),
    jobId: job.data.jobId,
    status: "started",
    progress: 0
});

try {

        // Testing ke liye
        throw new Error("Testing Failed Job");


    await job.updateProgress(25);
    console.log("Job progress: 25%");

    history.progress = 25;
    await history.save();

    await new Promise(resolve => setTimeout(resolve, 2000));

    await job.updateProgress(50);
    console.log("Job progress: 50%");

    history.progress = 50;
    await history.save();

    await new Promise(resolve => setTimeout(resolve, 2000));

    await job.updateProgress(75);
    console.log("Job progress: 75%");

    history.progress = 75;
    await history.save();

    await new Promise(resolve => setTimeout(resolve, 2000));

    await job.updateProgress(100);
    console.log("Job progress: 100%");

    history.progress = 100;
    history.status = "completed";
    history.completedAt = new Date();
    await history.save();
} catch (error) {

        history.status = "failed";
        history.failedAt = new Date();
        history.error = error.message;

        await history.save();

        throw error;
    }
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
    console.log(`Job failed: ${job?.id}`, err);
});

worker.on("error", (err) => {
    console.log("Worker error:", err);
});

console.log("Job Worker Started...");

}

startWorker();