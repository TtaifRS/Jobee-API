const jwt = require('jsonwebtoken')

const User = require('../models/users')
const catchAsyncError = require('./catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ErrorHandler('Please login to access', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decoded.id)

    next()
})

// exports.authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(new ErrorHandler(`Role(${req.user.name}) is not allowed to access this resource`, 403))
//         }
//         next()
//     }

// }
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.purpose)) {

            return next(new ErrorHandler(`Role(${req.user.purpose}) is not allowed to access this resource.`, 403))

        }
        next();
    }
}