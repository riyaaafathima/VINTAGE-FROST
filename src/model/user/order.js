const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
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
  totalAmount: {
    type: Number,
    required: true,
  },
  PaymentMethod: {
    type: String,
    enum: ["credit card", "debit card", "UPI", "COD"],
    required: true,
  },
  PaymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  shippingAddress: {
    fullName: {
        type:String,
        required:true,

    addressLine1:{
    type:String,
    required:true,
    } ,

    addressLine2:{
        type:String,
    } ,

    city:{
        type:String
    },
    state: {
        type:String,
        required:true
    },

    pinCode:{
     type:String
    } ,

    country:{
     type:String
    } 
  },
  deliveryDate:{
    type:Date
  }
  
}
});


module.exports=mongoose.model('order',orderSchema)