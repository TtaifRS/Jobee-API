const express = require('express')

//importing controllers 
const { getJobs, newJob, getJobInRadius } = require('../controllers/jobsController')

const router = express.Router()


router.route('/jobs').get(getJobs)
router.route('/jobs/:zipcode/:distance').get(getJobInRadius)

router.route('/job/new').post(newJob)

module.exports = router