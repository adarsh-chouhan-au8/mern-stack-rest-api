const mongoose = require('mongoose')

userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 5,
        maxlength: 255
    },
    email : {
        type : String,
        required : true,
        minLength: 5,
        maxLength: 255

    },
    password : {
        type : String,
        required : true,
        maxlength:1024,
        minlength:[6,'Password is too short'],
        validate : {
            validator: function(value) {
                return !value.includes('password')

            },
            message: 'Password cannot contain password'
        }
    },
    date: {
        type : Date,
        default : Date.now()

    }

})


module.exports = mongoose.model('User',userSchema)