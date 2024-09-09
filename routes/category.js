const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const {
  create,
  getCategories,
  getCategory,
  removeCategory,
  update,
  topCategories,
  getCategoryInTravel,
} = require("../controller/category");

//"/api/v1/category"
router.route("/").post(protect, create).get(getCategories);
router.route("/top").get(topCategories);
router
  .route("/:id")
  .delete(protect, removeCategory)
  .put(protect, update)
  .get(getCategory);
router.route("/travel/:id").get(getCategoryInTravel);
module.exports = router;
