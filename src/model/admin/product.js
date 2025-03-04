  const mongoose = require("mongoose");
  const { array } = require("../../config/multer/multer");

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
      preperationHour:{
      type:Number,
      required:true
      },
      numberOfReviews: {
         type: Number
         },
      rating: { 
        type: Number
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
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("products", productSchema);
