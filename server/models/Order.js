const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  customerInfo: Object,
  totalAmount: Number,
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Order', orderSchema);
