const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const { newMenu, getMenu, getMenus, removeMenu, updateMenu, getActiveMenu } = require("../controller/menu");

//"/api/v1"
router.route("/").post(protect, newMenu).get(protect, getMenus);
router.route("/active").get(protect, getActiveMenu);
router.route("/:id").get(protect, getMenu).delete(protect, removeMenu).put(protect, updateMenu);
module.exports = router;
