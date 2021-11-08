const express = require('express')

//importing controllers 
const { getJobs, newJob, getJobInRadius, updateJob, deleteJob, getJob, getStats } = require('../controllers/jobsController')

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth')

const router = express.Router()


router.route('/jobs').get(getJobs)
router.route('/job/:id/:slug').get(getJob)
router.route('/jobs/:zipcode/:distance').get(getJobInRadius)
router.route('/stats/:topic').get(getStats)

router.route('/job/new').post(isAuthenticated, authorizeRoles('admin', 'employer'), newJob)

router.route('/job/:id').put(isAuthenticated, updateJob)

router.route('/job/:id').delete(isAuthenticated, deleteJob)

module.exports = router