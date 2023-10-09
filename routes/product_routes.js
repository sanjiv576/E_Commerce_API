const express = require('express');

const productController = require('../controllers/product_controller');
const { verifyUser } = require('../middlewares/auth');
const router = express.Router();


router.get('/reviews', verifyUser, productController.addReview);



// get products by admin + registered users + guests
router.route('/')
    .post((req, res, next) => res.status(405).json({ error: "POST method is not allowed" }))
    .delete((req, res, next) => res.status(405).json({ error: "DELETE method is not allowed" }))
    .put((req, res, next) => res.status(405).json({ error: "PUT method is not allowed" }))
    .get(productController.getAllProducts);


// for a single product by admin + registered users + guests
router.route('/:product_id')
    .post((req, res, next) => res.status(405).json({ error: "POST method is not allowed" }))
    .delete((req, res, next) => res.status(405).json({ error: "DELETE method is not allowed" }))
    .put((req, res, next) => res.status(405).json({ error: "PUT method is not allowed" }))
    .get(productController.getSingleProduct);


module.exports = router;