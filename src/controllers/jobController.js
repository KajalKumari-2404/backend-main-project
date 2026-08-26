const jobModel = require("../models/jobModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jobQueue = require("../queues/jobQueue");
const emailQueue = require("../queues/emailQueue");

const createJobController = async (req,res) => {
    try {
        const { title, description, company, skills, location, salary, employmentType, status, priority } = req.body

        if (!title || !description || !company || !skills || !location || !salary || !employmentType || !status) {
            return res.status(500).send({
                success:false,
                message:'Please provide all fields'
            })
        }
        const newJob = new jobModel({title,description,company, skills, location, salary, employmentType, status,priority: priority || 5,createdBy: req.user._id});
        await newJob.save()

        

         const queueJob = await jobQueue.add(
            "jobCreated",
            {
                jobId: newJob._id,
                title: newJob.title,
                company: newJob.company,
                createdBy: newJob.createdBy
            },
            {
                priority: priority || 5,
                delay: 10000,

                attempts: 3,
                backoff: {
                    type: "fixed",
                    delay: 5000
                } 
            }
        );

        await emailQueue.add("sendJobEmail", {
            jobId: newJob._id,
            title: newJob.title,
            company: newJob.company,
            createdBy: newJob.createdBy
        });
      

        res.status(200).send({
            success:true,
            message:'job created successfully',
            newJob,
            queueJobId: queueJob.id
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
// const getAllJobsController = async (req,res) => {
//     try {
        // const jobs = await jobModel.find({})
        // // console.log(foods);
        // if(jobs.length===0) {
        //     return res.status(404).send({
        //         success:false,
        //         message:'No job was found'
        //     });
        // }
//         res.status(200).send({
//             success:true,
//             totaljobs: jobs.length,
//             jobs,
//         });
//     } catch (error){
//         // console.log("ERROR => ")
//         console.log(error)
//         res.status(500).send({
//             success:false,
//             message:'Error in get all job api',
//             error
//         })
//     }
// };

const getAllJobsController = async (req, res) => {
    try {

        const { search, title, company, location, minSalary, maxSalary, sortBy, order, page = 1,
    limit = 10} = req.query;

        // let filter = {
        //     isDeleted: false
        // };

        let filter = {
            isDeleted: { $ne: true }
        };

        //searching

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex:search,
                        $options:"i"
                    }
                },
                {
                    company: {
                        $regex:search,
                        $options:'i'
                    }
                },
                {
                    location:{
                        $regex:search,
                        $options:"i"
                    }
                }
            ]
        }

        // Title filter
        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }

        // Company filter
        if (company) {
            filter.company = { $regex: company, $options: "i" };
        }

        // Location filter
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        // Salary filter
        if (minSalary || maxSalary) {
            filter.salary = {};

            if (minSalary) {
                filter.salary.$gte = Number(minSalary);
            }

            if (maxSalary) {
                filter.salary.$lte = Number(maxSalary);
            }
        }

        // Sorting
        let sort = {};
        if (sortBy) {
            sort[sortBy] = order === "desc" ? -1 : 1;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const jobs = await jobModel.find(filter).sort(sort).skip(skip)
    .limit(Number(limit));

    const totalJobs = await jobModel.countDocuments(filter);


        // const jobs = await jobModel.find(filter);

        // if (jobs.length === 0) {
        //     return res.status(404).send({
        //         success: false,
        //         message: "No job found"
        //     });
        // }

        res.status(200).send({
            success: true,
            // totaljobs: jobs.length,
            totaljobs: totalJobs,
            currentPage: Number(page),
            totalPages: Math.ceil(totalJobs / Number(limit)),
            limit: Number(limit),
            jobs
        });

    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in get all job API",
            error
        });
    }
}
    

           

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
        // const job = await jobModel.findById(jobId)

        // const job = await jobModel.findOne({
        //     _id: jobId,
        //     isDeleted: false
        // })

        const job = await jobModel.findOne({
            _id: jobId,
            isDeleted: { $ne: true }
        })
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
        // const job = await jobModel.findById(jobId)

        // const job = await jobModel.findOne({
        //     _id: jobId,
        //     isDeleted: false
        // })

        const job = await jobModel.findOne({
            _id: jobId,
            isDeleted: { $ne: true }
        })
        if(!job){
            return res.status(404).send({
                success:false,
                message:'No job found'
            })
        }
        const { title,description,company, skills, location, salary, employmentType, status, priority} = req.body

        const updatejob = await jobModel.findByIdAndUpdate(jobId, { 
            title,
            description,
            company,
            skills,
            location,
            salary,
            employmentType,
            status,
            priority
       }, {new:true});
       res.status(200).send({
        success:true,
        message:'job was updated',
        updatejob
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
        // await jobModel.findByIdAndDelete(jobId);

        await jobModel.findByIdAndUpdate(
           jobId,
    {
        isDeleted: true,
        deletedAt: new Date()
    },
       { new: true }
   );
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

// Update Job Status
const updateJobStatusController = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { status } = req.body;

        if (!jobId) {
            return res.status(400).send({
                success: false,
                message: "Please provide job id"
            });
        }

        if (!status) {
            return res.status(400).send({
                success: false,
                message: "Please provide status"
            });
        }

        const updatedJob = await jobModel.findByIdAndUpdate(
            jobId,
            { status },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).send({
                success: false,
                message: "No job found with this id"
            });
        }

        res.status(200).send({
            success: true,
            message: "Job status updated successfully",
            updatedJob
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in update job status API",
            error
        });
    }
};

// Cancel Job
const cancelJobController = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).send({
                success: false,
                message: "Please provide job id"
            });
        }

        const job = await jobQueue.getJob(jobId);

        if (!job) {
            return res.status(404).send({
                success: false,
                message: "Job not found in queue"
            });
        }

        await job.remove();

        res.status(200).send({
            success: true,
            message: "Job cancelled successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in cancel job API",
            error
        });
    }
};


// Get Job Progress
const getJobProgressController = async (req, res) => {
    try {
        const queueJobId = req.params.id;

        if (!queueJobId) {
            return res.status(400).send({
                success: false,
                message: "Please provide queue job id"
            });
        }

        const job = await jobQueue.getJob(queueJobId);

        if (!job) {
            return res.status(404).send({
                success: false,
                message: "Job not found in queue"
            });
        }

        const progress = await job.getState();

        res.status(200).send({
            success: true,
            queueJobId: job.id,
            progress: job.progress,
            state: progress
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in get job progress API",
            error
        });
    }
};


module.exports = {createJobController, getAllJobsController, getSingleJobController, updatejobController, deleteJobController, updateJobStatusController,cancelJobController, getJobProgressController}
