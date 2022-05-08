
const userModel = require('../models/userModel.js')
const appError = require('../utils/appError.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { loginValidation, signupValidation } = require('../utils/validator.js')

exports.genHashedPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

exports.signup = async function (req, res) {

    // validating data before sending it to database
    const { error } = signupValidation(req.body)
    if (error) return res.status(400).send(new appError(400, error.details[0].message))

    // check if user already exists with same email
    const userExists = await userModel.findOne({ email: req.body.email })
    if (userExists) return res.status(400).send(new appError(400, 'user exists already!'))

    hashedPassword = await exports.genHashedPassword(req.body.password)


    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        newUser = await user.save()
        res.send(newUser)
    }
    catch (err) {
        res.status(400).send(new appError(400, err.message))

    }
}

exports.login = async function (req, res) {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(new appError(400, error.details[0].message))

    const user = await userModel.findOne({ email: req.body.email })
    if (!user) return res.status(400).send(new appError(400, "email doesnt't exist"))

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send(new appError(400, 'password is incorrect'))

    const jwtToken = jwt.sign({ _id: user._id, role: 'user' }, process.env.jwtToken)

    res.header('auth-token', jwtToken)
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjc3ODY4ZGRiY2I4MjYwOTBkY2JlMWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTY1MjAyMTUyNn0.d8kQFVHAIhSkBccZ-WPQeTpy0wl2cBtHsTk21Er9gt4
    res.send({
        status: 'success',
        token: jwtToken
    })
}

exports.verifyToken = function auth(req, res, next) {
    const token = req.header('auth-token')

    if (!token) { return res.status(400).send(new appError(400, 'Access denied')) }

    try {
        const verified = jwt.verify(token, process.env.jwtToken)
        const user = verified
        req.user = user
        next()
    }
    catch (err) {
        res.status(400).send(new appError(400, 'Invalid token'))
    }
}

exports.restrictTo = (role) => {
    return (req, res, next) => {
        if (role !== req.user.role) {
            res.status(403).send(new appError(403, 'Access forbidden'))
            next()
        }
        next()
    }
}


