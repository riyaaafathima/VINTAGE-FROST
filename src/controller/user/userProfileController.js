const userModel = require("../../model/user/user");
const addressModel = require("../../model/user/address");

const userProfileRender = async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    const userDetails = await userModel.findById(userId);
    res.render("user/userProfile", { userDetails });
  } catch (error) {
    console.log(error);
  }
};

const editUserProfile = async (req, res) => {
  try {
    const { username } = req.body; // Extract username from req.body
    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    let image;
    if (req.file) {
      image = req.file.filename;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: username,
          ...(image && { image }),
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const userAddressRender = async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    const userAddress = await addressModel.findOne({ user: userId });
    console.log("addreass", userAddress);

    res.render("user/address", { userAddress });
  } catch (error) {
    console.log(error);
  }
};

const editUserAddress = async (req, res) => {
    console.log('edit ');
    
  try {
    const {
      place,
      state,
      phone,
      landmark,
      addressType,
      pincode,
      locality,
      city,
      address,
    } = req.body;
    const userId = req.session?.user?._id;

    const userAddress = await addressModel.findOne({ user: userId });
    if (!userAddress) {
      const address = new addressModel({
        user: userId,
        addresses: [
          {
            place,
            state,
            phoneNumber: phone,
            landMark: landmark,
            address,
            addressType,
            pincode,
            locality,
            city,
          },
        ],
      });
      await userAddress.save();

      return res.status(200).json('address is added');
    } else {
   const address=  {
    place,
    state,
    phoneNumber: phone,
    landMark: landmark,
    address,
    addressType,
    pincode,
    locality,
    city,
  }
  userAddress.addresses.push(address);

  await userAddress.save()
  console.log(userAddress);
  
  return res.status(200).json('address added successfully')
}
    
  } catch (error) {
console.log(error);

  }
};

module.exports = {
  userProfileRender,
  editUserProfile,
  userAddressRender,
  editUserAddress,
};
