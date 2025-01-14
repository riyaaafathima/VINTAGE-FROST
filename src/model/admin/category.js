const mongoose= require('mongoose')


const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    isActive:{
        type:String,
        default:'Active'
    },
},{timestamps:true,
    
})

module.exports=mongoose.model('categories',categorySchema)