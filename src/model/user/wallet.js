const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transaction: [
    {
      transaction_id: {
        type: Number,
        unique: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ["Credit", "Debit"],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports=mongoose.model('wallet',walletSchema)