const mongoose = require("mongoose");
const Drinks = require("./drinks");
const User = require("./users");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    table: {
      type: Number,
      require: true,
    },
    orders: [Drinks.schema],
    totalAmount: {
      type: Number,
      require: true,
      min: 0,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
var Orders = mongoose.model("Order", orderSchema);
module.exports = Orders;
