const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const { create, update, getContact } = require("../controller/contact");

//"/api/v1"
router.route("/").post(create).put(update).get(protect, getContact);
module.exports = router;
