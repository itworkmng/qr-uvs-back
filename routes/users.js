const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getUsers,
  signin,
  signup,
  getInfo,
  change_password,
  updateUser,
  removeUser,
  forgot_password,
} = require("../controller/users");

//"/api/v1/user"
router.route("/").get(protect, authorize("admin"), getUsers);
router
  .route("/info")
  .get(protect, getInfo);

router.route("/forgot-password").post(forgot_password);
router
  .route("/password/:id")
  .post(protect, authorize("admin"), change_password);
router.route("/signin").post(signin);
router.route("/signup").post(signup);

router
  .route("/:id")
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), removeUser);
module.exports = router;
