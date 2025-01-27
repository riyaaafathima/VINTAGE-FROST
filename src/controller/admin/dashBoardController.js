
const dashboardRender = (req, res) => {
  try {
    res.render("admin/index");
  } catch (error) {
    console.log(error);
  }
};

const logoutAdmin = (req, res) => {
  try {
    req.session.isAdmin = null;
    res.redirect("/login");
  } catch (error) {}
};

module.exports = {
  dashboardRender,
  logoutAdmin,
};
