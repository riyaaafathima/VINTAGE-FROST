const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    status:{
        type:Boolean,
        default:true

    }

},{timestamps:true})

const userModel=mongoose.model('users',userSchema)

module.exports=userModel
