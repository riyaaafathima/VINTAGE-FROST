const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  addresses: [
    {
      place: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },

      phoneNumber: {
        type: Number,
        required: true,
      },
      landMark: {
        type: String,
      },
      address: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      adressType: {
        enum: ["home", "work"],
        type: String,
      },
      locality: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("address", addressSchema);
