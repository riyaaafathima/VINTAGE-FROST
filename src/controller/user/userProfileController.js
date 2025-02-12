const userModel = require("../../model/user/user");
const addressModel = require("../../model/user/address");
const bcrypt = require('bcrypt'); 

const userProfileRender = async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    const userDetails = await userModel.findById(userId);
    res.render("user/userProfile", { userDetails, user:userDetails });
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

    res.render("user/address", { userAddress ,user:true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


const getUserAddress = async (req, res) => {
  try {                                    
    const { place, state, phone, landmark, addressType, pincode, locality, city, address } = req.body;
    const userId = req.session?.user?._id;

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
    const { place, state, phone, landmark, addressType, pincode, locality, city, address,id } = req.body;

    const userAddress = await addressModel.findOne({ 'addresses._id': id, user: req.session?.user?._id });

    if (!userAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

   
    const updatedAddress = userAddress.addresses.id(id);
    

    if (! updatedAddress) {
      return res.status(404).json('address not found');
    }

    updatedAddress.place = place;
    updatedAddress.state = state;
    updatedAddress.phoneNumber = phone;
    updatedAddress.landMark = landmark;
    updatedAddress.address = address;
    updatedAddress.addressType = addressType;
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

const deleteAddress = async (req, res) => {   
  try {

    const { id } = req.params;  
    if (!id) {
      return res.status(400).json({error:'address id is required'})
      
    }
    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    const userAddress = await addressModel.findOne({ user:userId });    
    console.log(userAddress,'useradresss == ');
    
    if (!userAddress) {
      return res.status(404).json({ error: "User address not found" });
    }

    
    const addressIndex = userAddress.addresses.findIndex(
      (address) => address._id.toString() === id      
    );


    if (addressIndex === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    userAddress.addresses.splice(addressIndex, 1);

    await userAddress.save();

    return res.status(200).json({ message: "Address deleted successfully" });

  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};



const recentPasswordPage=(req,res)=>{
  try {
    
    res.render('user/recentPassword',{user:true})
  } catch (error) {
    
  }
}

const updatePassword= async (req,res)=>{
  try {
    const userId=req.session?.user?._id
    const{newPassword,currentPassword}=req.body

    if (!userId ) {
    return res.status(400).json({message:'please login'})
      
    }
    const userData=await userModel.findById(userId)
    console.log(userData);
    

   const isValidPassword= await bcrypt.compare(currentPassword,userData.password)

    if (!isValidPassword) {
    return  res.status(400).json({message:'incorrect password'})
      
    }

    const hashedpassword=await bcrypt.hash(newPassword,10);
    
    await userModel.findByIdAndUpdate(userId,{password:hashedpassword})

    res.status(200).json({message:'password updated successfully'})

  } catch (error) {
    console.log(error);
    
    res.status(500).json({message:'error in updating',error})
    
  }
}


module.exports = {   
  userProfileRender,
  editUserProfile,
  userAddressRender,
  getUserAddress,
  editAddress,
  deleteAddress,
  recentPasswordPage,
  updatePassword
  
};
   