const userModel = require('../models/userModel.js')
const appError = require('../utils/appError.js')
const { updateValidation } = require('../utils/validator.js')
const authController = require('./authController.js')



exports.getPosts = async function (req, res) {
    res.send({
        name: 'This is my first post',
        data: 'First post begins with this'
    })
}

exports.getAllUsers = async function (req, res) {


    try {
        const doc = await userModel.find().select('-_id name email')
        // console.log(allUsers)
        res.send({
            status: 'success',
            count: doc.length,
            data: {
                data: doc
            }
        })
    }
    catch (err) {
        res.status(400).send(new appError(400, err.message))
    }
}


exports.getUser = async function (req, res) {

    try {
        const doc = await userModel.findById(req.params.id);
        res.send(doc)
    }
    catch (err) {

        res.status(400).send(new appError(400, 'Invalid user id'))
    }

}

exports.updateUser = async function (req, res) {

    const { error } = updateValidation(req.body)

    if (error) return res.status(400).send(new appError(400, error.details[0].message))

    req.body.password = await authController.genHashedPassword(req.body.password)

    try {
        const doc = await userModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.send(doc)
    }
    catch (err) {

        res.status(400).send(new appError(400, err.message))
    }


}

exports.deleteUser = async function (req, res) {

    try {
        const doc = await userModel.findByIdAndDelete(req.params.id)
        res.send(doc)
    }
    catch (err) {
        res.status(400).send(new appError(400, err.message))
    }

}