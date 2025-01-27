const categoryModel = require("../../model/admin/category");
const mongoose = require("mongoose");

const addCategory = async (req, res) => {
  try {
    const { categoryName, isActive } = req.body;
    console.log(req.body);

    const iscategoryexist = await categoryModel.find({ categoryName });

    if (!iscategoryexist) {
      return res.status(409).json("categoryName already exist");
    }

    const newCategory = await categoryModel.create({
      categoryName,
      isActive,
    });

    console.log("Created category:", newCategory);

    res.status(200).json(newCategory);
  } catch (error) { 
    console.log(error);
  }
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.render("commmon/404");
    }

    const category = await categoryModel.findById(id);
    res.render("admin/edit-category", { category });
  } catch (error) {
    console.log;
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryName, _id } = req.body;

    await categoryModel.findByIdAndUpdate(_id, { categoryName }, { new: true });

    return res.status(200).json("sucess");
  } catch (error) {
    console.log(error);
    return res.status(600).json("sucess");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.render("commmon/404");
    }

    const preCategory = await categoryModel.findById(id);

    if (!preCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const oldValue = preCategory.isActive;
    await categoryModel.findByIdAndUpdate(
      id,
      { $set: { isActive: !oldValue } },
      { new: true } // Return the updated document
    );

    return res
      .status(200)
      .json({ message: "Category status updated successfully" , isActive: !oldValue});
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating the category status",
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({});
    res.render("admin/add-category", { allCategory });
  } catch (error) {}
};

module.exports = {
  addCategory,
  getAllCategory,
  editCategory,
  updateCategory,
  deleteCategory,
};
