const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    failedLoginAttempts: {
    type: Number,
    default: 0
},

    lockUntil: {
    type: Date,
    default: null
},
    role: {
        type: String,
        enum: ["user", "admin", "recruiter"],
        default: "user"
    },

    resetPasswordToken: {
    type: String,
},

resetPasswordExpire: {
    type: Date,
},

isEmailVerified: {
    type: Boolean,
    default: false
},

emailVerificationToken: {
    type: String
},

refreshToken: {
    type: String
},

    // User ke dwara create ki gayi jobs
   jobs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
    },
],
});



const userModel = mongoose.model("user", userSchema)



module.exports = userModel;