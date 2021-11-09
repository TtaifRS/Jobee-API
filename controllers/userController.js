const User = require('../models/users')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/sendToken')

//get current user profile => /api/id/profile 
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

//update current user password => /api/v1/password/update
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    const isMatched = await user.comparePassword(req.body.currentPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 401))
    }

    user.password = req.body.newPassword
    await user.save()

    sendToken(user, 200, res)
})

//update user => /api/v1/profile/update
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})


//delete current user => /api/v1/profile/delete 
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user.id)

    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Your accound has been deleted'
    })
})