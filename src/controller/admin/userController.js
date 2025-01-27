const userModel = require("../../model/user/user");

const userDetailsRender = async (req, res) => {
  try {
    const allUser = await userModel.find({ isAdmin: false });

    res.render("admin/page-user-list", {
      allUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const blockuser = async (req, res) => {
  try {
    const userId = req.params.id;

    // if (!mongoose.Types.isValidObjectId(userId)) {
    //   return res.render("common/404");
    // }

    const exisitingUser = await userModel.findById(userId);
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { status: !exisitingUser.status } },
      { new: true } // new return updated doc
    );

    if (!updateUser) {
      res.status(404).json({ message: "user not found" , isActive: !exisitingUser.status });
      return;
    }

    const action = updateUser.status ? "blocked" : "unblocked";
    res
      .status(200)
      .json({ message: `user succesfully ${action}`, user: updateUser });
  } catch (error) {
    console.log("error blocking/unvlocking user", error);

    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  userDetailsRender,
  blockuser,
};
