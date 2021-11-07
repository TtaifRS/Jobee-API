const express = require('express')

//importing controllers 
const { getJobs, newJob, getJobInRadius, updateJob, deleteJob, getJob } = require('../controllers/jobsController')

const router = express.Router()


router.route('/jobs').get(getJobs)
router.route('/job/:id/:slug').get(getJob)
router.route('/jobs/:zipcode/:distance').get(getJobInRadius)

router.route('/job/new').post(newJob)

router.route('/job/:id').put(updateJob)

router.route('/job/:id').delete(deleteJob)

module.exports = router