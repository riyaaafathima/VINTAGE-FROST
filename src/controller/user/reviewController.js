const reviewModel = require("../../model/user/review");
const orderModel = require("../../model/user/order");
const mongoose = require("mongoose");

const createReview = async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Please login" });
    }

    const { order, product, Description, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(order)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const existingOrder = await orderModel.findOne({
      _id: new mongoose.Types.ObjectId(order),
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const existingReview = await reviewModel.findOne({
      userId,
      product,   
      order,
    });
    
    if (existingReview) {
      return res
        .status(400)
        .json({
          message:
            "You have already reviewed this product go to view for editing",
        });
    }

    const newReview = new reviewModel({
      userId,
      product,
      order,
      rating,
      Description,
    });

    await newReview.save();

    res
      .status(200)
      .json({ message: "Successfully review added", review: newReview });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const editReview = async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Please login" });
    }

const existingreview=await reviewModel.find({userId,product})
if (!existingreview) {
  return res.status(500).json('review not found')
}
    res.status(200).json({existingreview})
  } catch (error) {
    console.log(error);
    
  }
};

module.exports = { createReview,editReview };
