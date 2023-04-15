const mongoose = require('mongoose');

schema = mongoose.Schema;


user = new schema({
    fullName: {
        type: String,
        require: [true, "Please enter fullname"]
    },
    email: {
        type: String,
        unique: [true, "email already exists in database!"],
        lowercase: true,
        trim: true,
        required: [true, "email not provided"],
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: '{VALUE} is not a valid email!'
        }

    },
    role: {
        type: String,
        enum: ["normal", "admin"],
        required: [true, "Please specify user role"]
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', user);