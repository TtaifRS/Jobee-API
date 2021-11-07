const Job = require('../models/jobs')

//get all jobs  => /api/v1/jobs 
exports.getJobs = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "This routes will display all jobs"
    })
}

//creat new job => /api/v1/job/new
exports.newJob = async (req, res, next) => {
    const job = await Job.create(req.body)

    res.status(200).json({
        success: true,
        message: 'New job created',
        data: job
    })
}