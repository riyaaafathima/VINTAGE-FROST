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

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const userAddress = await addressModel.findOne({ user: userId });

    res.render("user/address", { userAddress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


const getUserAddress = async (req, res) => {
  try {                                    
    const { place, state, phone, landmark, addressType, pincode, locality, city, address } = req.body;
    const userId = req.session?.user?._id;
console.log( req.body);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    let userAddress = await addressModel.findOne({ user: userId });

    if (!userAddress) {
      userAddress = new addressModel({
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
      return res.status(200).json({ message: "Address added successfully" });
    } else {
      userAddress.addresses.push({
        place,
        state,
        phoneNumber: phone,
        landMark: landmark,
        address,
        addressType,
        pincode,
        locality,
        city,
      });

      await userAddress.save();
      return res.status(200).json({ message: "Address added successfully" });
    }
  } catch (error) {
    console.log("Error updating address:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
    
const editAddress = async (req, res) => {
  try {
    // const { id } = req.params; 
    const { place, state, phone, landmark, addressType, pincode, locality, city, address,id } = req.body;

    const userAddress = await addressModel.findOne({ 'addresses._id': id, user: req.session?.user?._id });
console.log("userAdd",userAddress);

    if (!userAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

   
    const updatedAddress = userAddress.addresses.id(id);
    console.log(updatedAddress,'updated adress');
    

    if (! updatedAddress) {
      return res.status(404).json('address not found');
    }

    updatedAddress.place = place;
    updatedAddress.state = state;
    updatedAddress.phoneNumber = phone;
    updatedAddress.landMark = landmark;
    updatedAddress.address = address;
    updatedAddress.adressType = addressType;
    updatedAddress.pincode = pincode;
    updatedAddress.locality = locality;
    updatedAddress.city = city;

    await userAddress.save();

    return res.status(200).json({ message: 'Address updated successfully', userAddress });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// const getEditAddress = async (req, res) => {
//   try {
//     const { id } = req.params; // Get address ID from URL params
//     const userId = req.session?.user?._id;

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized request' });
//     }

//     const userAddress = await addressModel.findOne({ 'addresses._id': id, user: userId });

//     if (!userAddress) {
//       return res.status(404).json({ message: 'Address not found' });
//     }

//     const address = userAddress.addresses.id(id); // Fetch the specific address by ID
//     return res.status(200).json(address); // Send the address data as response
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



module.exports = {   
  userProfileRender,
  editUserProfile,
  userAddressRender,
  getUserAddress,
  editAddress,
  
};
   