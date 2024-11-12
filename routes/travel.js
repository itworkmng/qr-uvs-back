const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const {
  create,
  getTravels,
  removeTravel,
  updateTravel,
  getTravel,
} = require("../controller/travel");

//"/api/v1/travel"
router.route("/").post(protect, create).get(getTravels);
router
  .route("/:id")
  .delete(protect, removeTravel)
  .put(protect, updateTravel)
  .get(getTravel);
module.exports = router;
