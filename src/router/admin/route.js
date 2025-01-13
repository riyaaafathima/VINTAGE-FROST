const {
  dashboardRender,
  userDetailsRender,
} = require("../../controller/admin/controller");

const router = require("express").Router();

router.get("/dashboard", dashboardRender);

router.get("/users", userDetailsRender);

module.exports = router;
