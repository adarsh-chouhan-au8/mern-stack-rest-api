const Joi = require('@hapi/joi')


const signupValidation = function (data) {

    const schema = Joi.object({
        name: Joi.string().
            required().
            min(6),
        email: Joi.string().
            required().
            min(6).
            email(),
        password: Joi.string().
            required().
            min(6)
    })

    return schema.validate(data)


}

const loginValidation = function (data) {
    const schema = Joi.object({
        email: Joi.string().
            required().
            min(6).
            email(),
        password: Joi.string().
            required().
            min(6)
    })

    return schema.validate(data)

}

const updateValidation = signupValidation

module.exports = { loginValidation, signupValidation, updateValidation }