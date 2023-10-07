const { User } = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require("../models/Product");


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
            res.status(500).json({ error: err.message });
        }));
};

// for user login
const userLogin = ('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email == '' || password == '') {
        return res.status(400).json({ error: 'Email or password is empty.' });
    }

    // find email from the database
    User.findOne({ email: email })
        .then(user => {
            // if (!user) return res.status(400).json({ error: 'Provided email is not registered.' });
            if (!user) return res.status(400).json({ error: 'Account has not been registered.' });


            // compare given password with hashing password of db
            bcrypt.compare(password, user.password, (err, success) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                else {
                    // password does not match 
                    if (!success) return res.status(400).json({ error: 'Account has not been registered.' });

                    const payload = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        fullName: user.fullName,
                        picture: user.picture,
                    };


                    jwt.sign(
                        payload,
                        process.env.SECRET,
                        { expiresIn: '4h' },  // expires token in 4 hours
                        (err, token) => {
                            if (err) return res.status(500).json({ error: err.message });

                            console.log(`User id : ${user.id}`);
                            console.log(`User name : ${user.fullName}`);
                            console.log(`TOken: ${token}`);
                            // save the online status
                            user.save()
                                .then(success => res.json({ token: token, user: user }))
                                .catch((err => {
                                    res.status(500).json({ error: err.message });
                                }));
                        }
                    );

                }

            });

        })
        .catch((err => res.status(500).json({ error: err.message })));

});


// get all products by all admin + registered users + guests
const getAllProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            if (!products) return res.status(200).json({ error: 'No Products Available.' });
            res.status(200).json(products);
        })
        .catch((err => res.status(400).json({ error: err.message })));

}


// get a single product by  all admin + registered users + guests
const getSingleProduct = (req, res, next) => {
    const productId = req.params.product_id;
    Product.findById(productId)
        .then(foundProduct => {
            if(!foundProduct) return res.status(400).json({error: 'No product found with this id.'});
            res.status(200).json(foundProduct);
        })
        .catch((err => res.status(400).json({ error: err.message })));

};
module.exports = {
    userRegister,
    userLogin,
    getAllProducts,
    getSingleProduct,
}