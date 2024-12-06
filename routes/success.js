const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "QR-UVS Finally Update 2: 2024/11/21/",
    success: true,
  });
});
module.exports = router;