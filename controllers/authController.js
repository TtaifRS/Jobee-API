const User = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError')

//register user => /api/v1/register 
exports.register = catchAsyncError(async (req, res, next) => {
    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    res.status(200).json({
        success: true,
        message: "User is registered",
        data: user
    })
})