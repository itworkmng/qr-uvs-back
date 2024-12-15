const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "QR-UVS Finally Update 4: 2024/12/15",
    success: true,
  });
});
module.exports = router;