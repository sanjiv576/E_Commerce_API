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

    const productId = req.params.product_id;
    const { text } = req.body;

    if (text === '') return res.status(400).json({ error: 'Review text cannot be empty.' });

    Product.findByIdAndUpdate(productId,
        {
            $push: { reviews: { userId: req.user.id, text, userName: req.user.fullName, userPicture: req.user.picture } }
        },
        { new: true }
    )
        .then(updatedProduct => {
            if (!updatedProduct) return res.status(400).json({ error: 'No product found with this id.' });
            res.status(201).json(updatedProduct);
        })
        .catch((err => res.status(400).json({ error: err.message })));

};

// const get all reviews by all users

const getAllReviews = async (req, res, next) => {
    const productId = req.params.product_id;

    try {
        const foundProduct = await Product.findById(productId);
        if (!foundProduct) return res.status(400).json({ error: 'No product found with this id.' });
        const reviews = foundProduct.reviews;
        res.status(200).json(reviews);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }

};


//  get a single review by all users
const getSingleReview = async (req, res, next) => {
    const reviewId = req.params.review_id;
    const productId = req.params.product_id;

    try {
        const foundProduct = await Product.findById(productId);
        if (!foundProduct) return res.status(400).json({ error: 'No product found with this id.' });
        const foundReview = foundProduct.reviews.id(reviewId);
        if (!foundReview) return res.status(400).json({ error: 'No review found with this id.' });
        res.status(200).json(foundReview);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// update a single review by registered users who created the review
const updateSingleReview = async (req, res, next) => {
    const reviewId = req.params.review_id;
    const productId = req.params.product_id;
    const { text } = req.body;
    try {

        const foundProduct = await Product.findById(productId);

        if (!foundProduct) return res.status(400).json({ error: 'No product found with this id.' });

        const foundReview = foundProduct.reviews.id(reviewId);
        if (!foundReview) return res.status(400).json({ error: 'No review found with this id.' });
        if (foundReview.userId.toString() !== req.user.id) return res.status(400).json({ error: 'You are not authorized to update this review.' });

        // update the review
        const foundReviews = await Product.findOneAndUpdate(
            { _id: productId, 'reviews._id': reviewId, },
            { $set: { 'reviews.$.text': text } },
            { new: true }
        );
        if (!foundReviews) return res.status(400).json({ error: 'No review found with this id.' });

        const updatedReview = foundReviews.reviews.id(reviewId);
        res.status(200).json(updatedReview);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// delete a single review by registered users who created the review
const deleteSingleReview = async (req, res, next) => {
    const reviewId = req.params.review_id;
    const productId = req.params.product_id;
    try {
        const foundProduct = await Product.findById(productId);

        if (!foundProduct) return res.status(400).json({ error: 'No product found with this id.' });

        const foundReview = foundProduct.reviews.id(reviewId);
        if (!foundReview) return res.status(400).json({ error: 'No review found with this id.' });
        if (foundReview.userId.toString() !== req.user.id) return res.status(400).json({ error: 'You are not authorized to delete this review.' });


        // save all the reviews except the review to be deleted
        const otherReviews = foundProduct.reviews.filter(review => review._id.toString() !== reviewId);


        // update the reviews array by deleting the review
        foundProduct.reviews = otherReviews;
        // save the updated product
        await foundProduct.save();
        res.status(204).end();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};


module.exports = {

    getAllProducts,
    getSingleProduct,
    addReview,
    getAllReviews,
    getSingleReview,
    updateSingleReview,
    deleteSingleReview,
}

