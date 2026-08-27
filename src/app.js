const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("@exortek/express-mongo-sanitize");

const authRoutes = require('./routes/authRoute')

const jobRoutes = require('./routes/jobRoute')

const errorMiddleware = require("./middlewares/errorMiddleware");


const app = express();
app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(mongoSanitize());

app.use(cookieParser());

app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/job', jobRoutes)

// Centralized Error Handler
app.use(errorMiddleware);




module.exports = app;