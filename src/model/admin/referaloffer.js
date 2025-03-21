const mongoose=require('mongoose');

const referalSchema= new mongoose.Schema({
    reward: { 
        type: Number, 
        required: true
     },
    isActive: { 
        type: Boolean,
         default: true 
        },
    userCount : {
         type: Number,
          default:0
        }
  },
  { timestamps:
     true 
    })

    module.exports=mongoose.model('referal',referalSchema);