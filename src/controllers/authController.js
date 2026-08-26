require("dotenv").config();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

async function registerUser(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
       { username },
       { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({ message: "User already exists" })
    }

    const hash = await bcrypt.hash(password, 10)

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const user = await userModel.create({
        username,
        email,
        password: hash,
        emailVerificationToken: emailVerificationToken
    })

    // const token = jwt.sign({
    //     id: user._id,
    // }, process.env.JWT_SECRET)


    const token = jwt.sign(
    {
        _id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}


async function loginUser(req, res) {

    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
    }


const isPasswordValid = await bcrypt.compare(password, user.password)


if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" })
}

// const token = jwt.sign({
//     id: user._id,
// }, process.env.JWT_SECRET)

const token = jwt.sign(
    {
        _id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

const refreshToken = jwt.sign(
    {
        _id: user._id
    },
    process.env.JWT_REFRESH_SECRET,
    {
        expiresIn: "30d"
    }
);

user.refreshToken = refreshToken;
await user.save();

res.cookie("token", token)

res.status(200).json({
    success:true,
    message: "User logged in successfully",
    token:token,
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
})
}


async function forgotPassword(req, res) {

    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset token generated successfully",
        resetToken: resetToken
    });
}


async function resetPassword(req, res) {

    const { token } = req.params;
    const { password } = req.body;

    const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired reset token"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
}


async function refreshAccessToken(req, res) {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token required"
        });
    }

    const user = await userModel.findOne({
        refreshToken: refreshToken
    });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        });
    }

    try {

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // New Access Token
        const newAccessToken = jwt.sign(
            {
                _id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // New Refresh Token
        const newRefreshToken = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "30d"
            }
        );

        // Old refresh token replace
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Token rotated successfully",
            token: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Refresh token expired or invalid"
        });
    }
}


module.exports = { registerUser, loginUser, forgotPassword, resetPassword, refreshAccessToken}