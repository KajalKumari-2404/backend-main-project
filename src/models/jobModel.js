const mongoose = require("mongoose");
// const userModel = require("./userModel");

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    skills: [{
        type: String
    }],


    location: {
        type: String,
        required: true
    },

    salary: {
        type:Number,
        required:true
    },

    employmentType: {
        type: String,
        enum: ["Full-time", "Part-time", "internship", "contract"],
        required: true
    },

    status: {
        type: String,
        default: "active"
    },

    isDeleted: {
          type: Boolean,
          default: false
},

   deletedAt: {
         type: Date,
         default: null
   },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

}, { timestamps: true });

const jobModel = mongoose.model("Job", jobSchema);

module.exports = jobModel;