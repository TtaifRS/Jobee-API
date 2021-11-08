const sendToken = (user, statusCode, res) => {
    //create JWT token 
    const token = user.getJwtToken()

    //options for cookie 
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_DATE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}

module.exports = sendToken