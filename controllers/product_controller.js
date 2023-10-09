const Product = require("../models/Product");

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
            if (!foundProduct) return res.status(400).json({ error: 'No product found with this id.' });
            res.status(200).json(foundProduct);
        })
        .catch((err => res.status(400).json({ error: err.message })));

};



// registered users can add reviews to the products

const addReview = (req, res, next) => {
    // res.json({message: 'add review'});
    res.status(200).json({ message: 'add review' });
};


module.exports = {

    getAllProducts,
    getSingleProduct,
    addReview,
}

