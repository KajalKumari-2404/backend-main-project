const mongoose = require("mongoose");

const jobHistorySchema = new mongoose.Schema(
    {
        queueJobId: {
            type: String,
            required: true
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        status: {
            type: String,
            enum: ["started", "completed", "failed"],
            default: "started"
        },

        progress: {
            type: Number,
            default: 0
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        completedAt: {
            type: Date,
            default: null
        },

        failedAt: {
            type: Date,
            default: null
        },

        error: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("JobHistory", jobHistorySchema);