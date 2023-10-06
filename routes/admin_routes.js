const express = require('express');
const adminController = require('../controllers/admin_controller');
const { verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

// for adding prouct only by admin
router.route('/product')
    .get((req, res, next) => res.status(405).json({ error: "GET method is not allowed" }))
    .put((req, res, next) => res.status(405).json({ error: 'PUT method is not allowed' }))
    .delete((req, res, next) => res.status(405).json({ error: 'DELETE method is not allowed' }))
    .post(verifyAdmin, adminController.addProduct);

// for updating and deleting a product only by admin
router.route('/product/:product_id')
    .get((req, res, next) => res.status(405).json({ error: "GET method is not allowed" }))
    .post((req, res, next) => res.status(405).json({ error: 'POST method is not allowed' }))
    .delete(verifyAdmin, adminController.deleteSingleProduct)
    .put(verifyAdmin, adminController.updateProduct);





module.exports = router;