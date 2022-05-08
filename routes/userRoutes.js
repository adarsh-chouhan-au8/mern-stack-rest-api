const router = require('express').Router()
const authController = require('../controllers/authController.js')
const userController = require('../controllers/userController.js')
const Joi = require('@hapi/joi')
const verify = require('jsonwebtoken/verify')


router.post('/signup',authController.signup )


router.post('/login',authController.login)


router.use(authController.verifyToken)
// protected router using verifyToken middleware
router.post('/get-posts',userController.getPosts)


//admin routes
router.use(authController.restrictTo('user'))

router.get('/', userController.getAllUsers)

router 
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);


module.exports = router
