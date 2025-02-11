const userModel = require("../../model/user/user");

const addressModel = require("../../model/user/address");

const checkoutRender =async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    const address= await addressModel.findOne({user:userId})

    res.render("user/checkout", { user: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { checkoutRender };
