

//get all jobs  => /api/v1/jobs 
exports.getJobs = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "This routes will display all jobs"
    })
}