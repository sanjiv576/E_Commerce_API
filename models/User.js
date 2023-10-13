
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
    passwordLastChanged: {
        type: Date,
        default: Date.now,
    },

    passwordHistory: [],

    // Note: STATUS is disable when the users enter the wrong password for more than 3 times
    //  , otherwise, it is active
    status: {
        type: String,
        enum: ['active', 'disable'],
        default: 'active'
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


// method for returning bool to check whether password is need to be changed in every 90 days or not
const isPasswordChangeRequired = function (lastPasswordChangedDate) {
    const expirationDays = 90; // Change password every 90 days
    const lastChanged = lastPasswordChangedDate;
    console.log(`Last password changed date: ${lastChanged}`)
    const today = new Date();
    const expirationDate = new Date(lastChanged);
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    return today > expirationDate;
};




const User = new mongoose.model('User', userSchema);

module.exports = { User, userSchema, isPasswordChangeRequired };