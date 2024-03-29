const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email.']
    },
    purpose: {
        type: String,
        enum: {
            values: ['user', 'employer'],
            message: 'Please select correct role',
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter password for your account.'],
        minlength: [8, 'Your password must be at least 8 characters long'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //hash and set to resetPasswordToken
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    //set token expire time 
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken
}


module.exports = mongoose.model('User', userSchema)

