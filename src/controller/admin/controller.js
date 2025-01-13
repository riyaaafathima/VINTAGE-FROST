const userModel=require('../../model/user/user')
const dashboardRender = (req, res) => {
  try {
    res.render("admin/index");
  } catch (error) {
    console.log(error);
  }
};



const userDetailsRender = async (req, res) => {

 
  try {
    const allUser = await userModel.find({})

    res.render("admin/page-user-list",{
      allUser
    });

  } catch (error) {
    console.log(error);
  }
};



module.exports = { dashboardRender ,userDetailsRender};
