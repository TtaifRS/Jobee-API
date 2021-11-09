const express = require('express')

const { getUserProfile, updatePassword, updateUser, deleteUser } = require('../controllers/userController')
const { isAuthenticated } = require('../middlewares/auth')

const router = express.Router()

router.route('/profile').get(isAuthenticated, getUserProfile)

router.route('/password/update').put(isAuthenticated, updatePassword)
router.route('/profile/update').put(isAuthenticated, updateUser)

router.route('/profile/delete').delete(isAuthenticated, deleteUser)

module.exports = router