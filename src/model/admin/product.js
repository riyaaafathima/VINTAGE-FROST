const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
  
    productName: {
      type: String,
      required: true,
    },
    varients: [
      {
        kg: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
        },
      },
    ],
    preperationHour: {
      type: Number,
      required: true,
    },
    numberOfReviews: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    categoryOfferModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoryOffers",
      default: null,
    },
    productOfferModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productOffers",
      default: null,
    },
    offerPercentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productSchema);
