const express = require('express');
const router = express.Router();
const { createCart, getCart, addToCart } = require('../controllers/cartController');

router.post('/', createCart);
router.get('/:id', getCart);
router.post('/:id/items', addToCart);

module.exports = router;
