const crypto = require('crypto')

const User = require('../models/users')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/sendToken')
const sendEmail = require('../utils/sendEmail')

//register user => /api/v1/register 
exports.register = catchAsyncError(async (req, res, next) => {
    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendToken(user, 200, res)
})

//login user => /api/v1/login 
exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler('Please enter Email and Password'), 400)
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 200, res)

})

//forget password => /api/v1/password/forgot 
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    //check user
    if (!user) {
        return next(new ErrorHandler('No user found with this email.', 404))
    }

    //get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    //creat reset password url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset link is as follow:\n\n${resetUrl}\n\n If you have not request this, then please ignore that.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Jobee-API Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent successfylly to: ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler('Email is not sent, Please try again after a momemnt.'), 500)
    }
})

//reset password => /api/v1/password/reset/:token
// exports.resetPassword = catchAsyncError(async (req, res, next) => {
//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

//     const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() }
//     })

//     if (!user) {
//         return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
//     }

//     user.password = req.body.password

//     user.resetPasswordToken = undefined
//     user.resetPasswordExpire = undefined

//     await user.save()

//     sendToken(user, 200, res)
// })

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // Hash url token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password Reset token is invalid or has been expired.', 400));
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//logout => /api/v1/logout 
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})