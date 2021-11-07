const express = require('express')

//importing controllers 
const { getJobs, newJob } = require('../controllers/jobsController')

const router = express.Router()


router.route('/jobs').get(getJobs)

router.route('/job/new').post(newJob)

module.exports = router