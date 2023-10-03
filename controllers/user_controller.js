const { User } = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userRegister = (req, res, next) => {


    const { fullName, email, role, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            // If user found that means there is already user with that email
            if (user) return res.status(400).json({ error: `${req.body.email}, this email is already taken.` });

            const saltRound = 10;
            // hashing the original password here

            bcrypt.hash(password, saltRound, (err, hashedPassword) => {

                if (!err) {


                    // store user details in the db
                    User.create({ fullName, email, role, password: hashedPassword })
                        .then(user => res.status(201).json(user))
                        .catch(err => {
                            res.status(400).json({ error: err.message });
                        });
                }
                else {
                    console.log(`Error wile registering. Error message: ${err}`);
                }
            });

        })
        .catch((err => {
            res.status(400).json({ error: err.message });
        }));

};


module.exports = {
    userRegister,
}