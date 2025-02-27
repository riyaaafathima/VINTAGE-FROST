const mongoose = require("mongoose");
const Counter = require("./counter");
const { Schema } = mongoose;

const AddressSchema = new Schema({
  name:{
    type:String,
    
  },
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
  addressType: {
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
});



const ProductSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Processing", "Delivered","Cancelled"],
    default:'Pending'
  },
  kg: {
    type: Number,
    required: true,
  },
  actualPrice: {
    type: Number,
    required: true,
  },
  image:{
    type:[]
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
});

const OrderSchema = new Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    address: AddressSchema,
    subTotal: {
      type: Number,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    products: [ProductSchema],
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Online", "Wallet"],
    },
    totalQuantity: {
      type: Number,
      min: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Failed", "Pending", "Success"],
      default: "Pending",
    },
    coupon: {
      type: mongoose.Types.ObjectId,
      ref:"coupon",
    },
    couponDiscount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    packagingPrice:{
      type:Number
    }
  },
  { timestamps: true }
);

// Order ID generation
OrderSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const counter = await Counter.findOne({ model: "Order", field: "orderId" });

    // Checking if order counter already exist
    if (counter) {
      this.orderId = counter.count + 1;
      counter.count += 1;
      await counter.save();
    } else {
      await Counter.create({ model: "Order", field: "orderId" });
      this.orderId = 1000;
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("Order", OrderSchema);



