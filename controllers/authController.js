const User = require('../models/users')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')

//register user => /api/v1/register 
exports.register = catchAsyncError(async (req, res, next) => {
    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    const token = user.getJwtToken()

    res.status(200).json({
        success: true,
        message: "User is registered",
        token
    })
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

    const token = user.getJwtToken()

    res.status(200).json({
        success: true,
        token
    })

})