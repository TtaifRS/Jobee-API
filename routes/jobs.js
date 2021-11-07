const express = require('express')

//importing controllers 
const { getJobs } = require('../controllers/jobsController')

const router = express.Router()


router.route('/jobs').get(getJobs)

module.exports = router