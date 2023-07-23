const mongoose = require('mongoose')
const Members = require('./members');
const Drinks = require('./drinks');

const Schema = mongoose.Schema

const orderSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },
  table: {
    type: Number,
    require: true
  },
  orders: [Drinks.schema],
  totalAmount: {
    type: Number,
    require: true,
    min: 0
  },
  paid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }
)
var Orders = mongoose.model('Order', orderSchema);
module.exports = Orders;