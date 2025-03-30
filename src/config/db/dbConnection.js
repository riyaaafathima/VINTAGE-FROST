const mongoose = require("mongoose");
const env=require('dotenv')
env.config()


const connectDb = async () => {
    
    
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,   // Increase timeout to 30 seconds
    socketTimeoutMS: 45000             // Increase socket timeout
  })
    
    .then(() => {
      console.log("mongose connected");
    })
    .catch((err) => {
      console.log(err);
    });
};


module.exports=connectDb