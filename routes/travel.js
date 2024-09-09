const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const {
  create,
  getTravels,
  removeTravel,
  update,
  getTravel,
} = require("../controller/travel");

//"/api/v1/category"
router.route("/").post(protect, create).get(getTravels);
router
  .route("/:id")
  .delete(protect, removeTravel)
  .put(protect, update)
  .get(getTravel);
module.exports = router;
