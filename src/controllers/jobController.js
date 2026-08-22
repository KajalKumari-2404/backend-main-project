const jobModel = require("../models/jobModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createJobController = async (req,res) => {
    try {


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in create job API",
            error
        })
    }

};


module.exports = {createJobController}
