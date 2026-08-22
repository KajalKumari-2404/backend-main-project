const express = require('express');
const { createJobController } = require('../controllers/jobController');

const router = express.Router();

router.post('/create', createJobController)


module.exports = router;
