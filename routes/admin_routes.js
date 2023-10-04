const express = require('express');
const adminController = require('../controllers/admin_controller');
const { verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

router.route('/product')
    .get((req, res, next) => res.status(405).json({ error: "GET method is not allowed" }))
    .put((req, res, next) => res.status(405).json({ error: 'PUT method is not allowed' }))
    .delete((req, res, next) => res.status(405).json({ error: 'DELETE method is not allowed' }))
    .post(verifyAdmin, adminController.addProduct);


module.exports = router;