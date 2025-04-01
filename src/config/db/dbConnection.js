const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

const connectDb = async () => {
  console.log("MONGO_URL:", process.env.MONGO_URL); 
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Mongoose connected");
  } catch (err) {
    console.error("Mongoose connection error:", err);
    process.exit(1); 
  }
};

module.exports = connectDb;