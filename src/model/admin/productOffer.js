const mongoose = require("mongoose");

const productOfferschema=new mongoose. Schema({

    product_id: {
        type: mongoose.Schema.Types.ObjectId, 
        unique: true,
        ref: "products",
    },
    offerPercentage: {
        type:Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})



module.exports=mongoose.model('productOffer',productOfferschema)

