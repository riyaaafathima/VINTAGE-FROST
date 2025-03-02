const userModel = require("../../model/user/user");

const userDetailsRender = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 10;

    // Search logic
    const searchQuery = {
      isAdmin: false,
      $or: [
        { name: { $regex: search, $options: "i" } }, // 'i' for case-insensitive
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const totalUsers = await userModel.countDocuments(searchQuery);

    const allUser = await userModel
      .find(searchQuery)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalUsers / perPage);

    res.render("admin/page-user-list", {
      allUser,
      currentPage,
      totalPages,
      totalUsers,
      search,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users");
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
