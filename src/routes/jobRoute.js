const express = require('express');
const { createJobController, getAllJobsController, getSingleJobController, updatejobController, deleteJobController, updateJobStatusController, cancelJobController, getJobProgressController, getJobsByLocationController, getJobsByCompanyController, getJobsWithUserController, getTotalJobsCountController,getJobsFacetController, getJobsWithSkipController, getJobsWithLimitController, getJobsWithAddFieldsController, getJobsWithCondController, getSalaryStatsController } = require('../controllers/jobController');
const { authUser } = require('../middlewares/authMiddleware');
const router = express.Router();

const { authorizeRoles } = require('../middlewares/roleMiddleware');

// router.post('/create', authUser, createJobController);
router.get('/getAll', authUser, getAllJobsController);

router.get('/filter', authUser, getJobsByLocationController);

router.get('/group', authUser, getJobsByCompanyController);

router.get('/lookup', authUser, getJobsWithUserController);

router.get('/count', authUser, getTotalJobsCountController);

router.get('/facet', authUser, getJobsFacetController);

router.get('/skip', authUser, getJobsWithSkipController);

router.get('/limit', authUser, getJobsWithLimitController);

router.get('/add-fields', authUser, getJobsWithAddFieldsController);

router.get('/cond', authUser, getJobsWithCondController);

router.get('/salary-stats', authUser, getSalaryStatsController);

router.get('/get/:id', getSingleJobController);

router.get('/progress/:id', authUser, getJobProgressController);


router.put('/update/:id', updatejobController);

router.patch('/status/:id', authUser, authorizeRoles('recruiter', 'admin'), updateJobStatusController);

router.delete('/delete/:id', deleteJobController);

router.delete('/cancel/:id', authUser, cancelJobController);

router.post('/create', authUser, authorizeRoles('recruiter', 'admin'), createJobController);

module.exports = router;
