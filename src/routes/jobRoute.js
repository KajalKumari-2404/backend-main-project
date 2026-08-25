const express = require('express');
const { createJobController, getAllJobsController, getSingleJobController, updatejobController, deleteJobController, updateJobStatusController } = require('../controllers/jobController');
const { authUser } = require('../middlewares/authMiddleware');
const router = express.Router();

const { authorizeRoles } = require('../middlewares/roleMiddleware');

// router.post('/create', authUser, createJobController);
router.get('/getAll', authUser, getAllJobsController);
router.get('/get/:id', getSingleJobController);
router.put('/update/:id', updatejobController);

router.patch('/status/:id', authUser, authorizeRoles('recruiter', 'admin'), updateJobStatusController);

router.delete('/delete/:id', deleteJobController);

router.post('/create',authUser,authorizeRoles('recruiter', 'admin'),createJobController);


module.exports = router;
