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
    image:{
        type:String,
        default:"ef14ce73-49fe-49c8-bb07-6acfb1cb6fa5.jpg"
    },
    status:{
        type:Boolean,
        default:true

    }

},{timestamps:true})

const userModel=mongoose.model('users',userSchema)

module.exports=userModel
