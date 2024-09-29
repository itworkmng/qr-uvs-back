const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const { update, getAbout} = require("../controller/about");

//"/api/v1"
router.route("/").post(protect,update).get(getAbout);
module.exports = router;
