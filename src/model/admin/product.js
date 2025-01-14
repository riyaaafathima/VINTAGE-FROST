const mongoose= require ('mongoose')
const { array } = require('../../config/multer/multer')


const productSchema= new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:[{
        kg:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }],
   
    stock:{
        type:Number,
        required:true,

    },
    category:{
        type:mongoose.Schema.Types.ObjectId,ref:'category',required:true

    },
    description:{
        type:String

    },
    image:{
        type:[]
    },  

},{
     timestamps:true
})

module.exports=mongoose.model('products',productSchema)