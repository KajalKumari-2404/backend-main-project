const jobModel = require("../models/jobModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createJobController = async (req,res) => {
    try {
        const { title, description, company, skills, location, salary, employmentType, status } = req.body

        if (!title || !description || !company || !skills || !location || !salary || !employmentType || !status) {
            return res.status(500).send({
                success:false,
                message:'Please provide all fields'
            })
        }
        const newJob = new jobModel({title,description,company, skills, location, salary, employmentType, status,createdBy: req.user._id});
        await newJob.save()
        res.status(200).send({
            success:true,
            message:'job created successfully',
            newJob,
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in create job API",
            error
        })
    }

};


//Get all jobs
const getAllJobsController = async (req,res) => {
    try {
        const jobs = await jobModel.find({})
        // console.log(foods);
        if(jobs.length===0) {
            return res.status(404).send({
                success:false,
                message:'No job was found'
            });
        }
        res.status(200).send({
            success:true,
            totaljobs: jobs.length,
            jobs,
        });
    } catch (error){
        // console.log("ERROR => ")
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in get all job api',
            error
        })
    }
};


// Get single job
const getSingleJobController = async (req,res) => {
    try {
        const jobId = req.params.id
        if(!jobId){
            return res.status(404).send({
                success:false,
                message:'Please provide id'
            })
        }
        const job = await jobModel.findById(jobId)
        if(!job){
            return res.status(404).send({
                success:false,
                message:'No job found with this id'
            })
        }
        res.status(200).send({
            success:true,
            job,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in get single job api',
            error
        })
    }
};



// Update job
const updatejobController = async (req,res) => {
    try {
        const jobId = req.params.id
        if(!jobId){
            return res.status(404).send({
                success:false,
                message:'No job id was found'
            })
        }
        const job = await jobModel.findById(jobId)
        if(!job){
            return res.status(500).send({
                success:false,
                message:'No job found'
            })
        }
        const { title,description,company, skills, location, salary, employmentType, status } = req.body

        const updatejob = await jobModel.findByIdAndUpdate(jobId, { 
            title,
            description,
            company,
            skills,
            location,
            salary,
            employmentType,
            status
       }, {new:true});
       res.status(200).send({
        success:true,
        message:'job was updated',
       });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in update job api',
            error
        })
    }
};


// delete job item
const deleteJobController = async (req,res) => {
    try {
        const jobId = req.params.id
        if(!jobId){
            return res.status(404).send({
                success:false,
                message:'provide job id'
            })
        }
        const job = await jobModel.findById(jobId)
        if(!job){
            return res.status(500).send({
                success:false,
                message:'No job found with this id'
            })
        }
        await jobModel.findByIdAndDelete(jobId);
        res.status(200).send({
            success:true,
            message:'job deleted successfully'
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in delete job api',
            error
        })
    }
};


module.exports = {createJobController, getAllJobsController, getSingleJobController, updatejobController, deleteJobController}
