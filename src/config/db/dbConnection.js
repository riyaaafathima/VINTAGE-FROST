const mongoose = require("mongoose");
const env=require('dotenv')
env.config()


const connectDb = async () => {
    
    
  await mongoose.connect(process.env.MONGO_URL)
    
    .then(() => {
      console.log("mongose connected");
    })
    .catch((err) => {
      console.log(err);
    });
};


module.exports=connectDb