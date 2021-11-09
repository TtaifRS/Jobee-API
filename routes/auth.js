const express = require('express')
const { register, login, forgotPassword, resetPassword, logout } = require('../controllers/authController')
const { isAuthenticated } = require('../middlewares/auth')


const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)

router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(isAuthenticated, logout)

module.exports = router