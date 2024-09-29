const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const {
  create,
  getAllMessage,
  removeMessage,
  getMessage,
} = require("../controller/message");

//"/api/v1"
router.route("/").post(create).get(protect, getAllMessage);
router.route("/:id").get(protect, getMessage).delete(protect, removeMessage);
module.exports = router;
