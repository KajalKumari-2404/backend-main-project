const express = require('express');
const cookieParser = require("cookie-parser")

const authRoutes = require('./routes/authRoute')

const jobRoutes = require('./routes/jobRoute')

const errorMiddleware = require("./middlewares/errorMiddleware");


const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/job', jobRoutes)

// Centralized Error Handler
app.use(errorMiddleware);




module.exports = app;