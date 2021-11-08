const Job = require('../models/jobs')
const geoCoder = require('../utils/geocoder')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')

//get all jobs  => /api/v1/jobs 
exports.getJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find()
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    })
})

//creat new job => /api/v1/job/new
exports.newJob = catchAsyncError(async (req, res, next) => {
    const job = await Job.create(req.body)

    res.status(200).json({
        success: true,
        message: 'New job created',
        data: job
    })
})

//search job in radius => /api/v1/jobs/:zipcode/:distance 
exports.getJobInRadius = catchAsyncError(async (req, res, next) => {
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
})

//update job => /api/v1/job/:id 
exports.updateJob = catchAsyncError(async (req, res, next) => {
    const id = req.params.id
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        let job = await Job.findById(req.params.id)

        if (!job) {
            return next(new ErrorHandler('Jobs not found', 404))
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            message: 'job updated',
            data: job
        })
    } else {
        return next(new ErrorHandler('Invalid ID', 404))
    }

})

//delete job => /api/v1/job/:id 

exports.deleteJob = catchAsyncError(async (req, res, next) => {
    let job = await Job.findById(req.params.id)

    if (!job) {
        return next(new ErrorHandler('Jobs not found', 404))
    }

    job = await Job.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: 'Job deleted successfully'
    })
})

//get a single job with id and slug => /api/v1/job/:id/:slug 
exports.getJob = catchAsyncError(async (req, res, next) => {
    let job = await Job.find({
        $and: [
            { _id: req.params.id },
            { slug: req.params.slug }
        ]
    })

    if (!job || job.length === 0) {
        return next(new ErrorHandler('Jobs not found', 404))
    }

    res.status(200).json({
        success: true,
        data: job
    })
})

//get stats about a topic => /api/v1/stats/:topic
exports.getStats = catchAsyncError(async (req, res, next) => {
    let stats = await Job.aggregate([
        { $match: { $text: { $search: "\"" + req.params.topic + "\"" } } },
        {
            $group: {
                _id: { $toUpper: '$experience' },
                totalJobs: { $sum: 1 },
                avgPosition: { $avg: '$positions' },
                avgSalary: { $avg: '$salary' },
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' }
            }
        }
    ])

    if (stats.length === 0) {
        return next(new ErrorHandler(`no stats found on ${req.params.topic}`, 200))
    }

    res.status(200).json({
        success: true,
        data: stats
    })
})