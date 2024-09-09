const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Finally Update 1: 2024/07/29",
    success: true,
  });
});
module.exports = router;
