const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  couponOffer: {
    type: Number,
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      kg: {
        type: Number,
        required: true,
      },
      actualPrice: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
      },
      instruction: {
        type: String,
      },
      isEggless: {
        type: Boolean,
        required: true,
      },
    },
  ],
  subTotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("cart", cartSchema);
