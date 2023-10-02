
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        minLength: [2, 'Length of full name cannot be smaller than 2']
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',

    },
    email: {
        type: String,
        unique: true,
        minLength: [6, 'Length of email cannot be smaller than 6'],
        required: true
    },

    password: {
        type: String,
        minLength: [8, 'Length of password cannot be smaller than 8'],
        required: true
    },
    picture: {
        type: String,
        default: 'defaultImage.jpg'

    },

}, { timestamps: true });

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString();

        delete returnedDocument._id;
        delete returnedDocument.__v;
        delete returnedDocument.password;
    }
});

const User = new mongoose.model('User', userSchema);

module.exports = { User, userSchema };