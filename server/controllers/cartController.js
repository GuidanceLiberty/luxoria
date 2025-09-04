const Cart = require('../models/Cart');

exports.createCart = async (req, res) => {
  const cart = new Cart({ items: [] });
  await cart.save();
  res.json(cart);
};

exports.getCart = async (req, res) => {
  const cart = await Cart.findById(req.params.id).populate('items.productId');
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findById(req.params.id);
  cart.items.push({ productId, quantity });
  await cart.save();
  res.json(cart);
};
