const express = require('express');
const cookieParser = require("cookie-parser")

const authRoutes = require('./routes/authRoute')

const jobRoutes = require('./routes/jobRoute')

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/job', jobRoutes)



module.exports = app;