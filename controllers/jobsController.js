const Job = require('../models/jobs')
const geoCoder = require('../utils/geocoder')

//get all jobs  => /api/v1/jobs 
exports.getJobs = async (req, res, next) => {
    const jobs = await Job.find()
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
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

//search job in radius => /api/v1/jobs/:zipcode/:distance 
exports.getJobInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params

    const loc = await geoCoder.geocode(zipcode)
    const latitude = loc[0].latitude
    const longitude = loc[0].longitude
    const radius = distance / 3963

    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    })

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    })
}