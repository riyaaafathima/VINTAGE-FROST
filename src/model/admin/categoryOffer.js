const mongoose=require('mongoose')


const categoryOfferschema=new mongoose. Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId, 
        unique: true,
        ref: 'categories',
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

module.exports= mongoose.model('categoryOffer',categoryOfferschema)