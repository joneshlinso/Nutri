const express = require("express");
const router = express.Router();
const {
  getDailyLog,
  addMealEntry,
  updateWater,
  deleteMealEntry,
  updateWeight,
  getProgressSummary,
} = require("../controllers/logController");
const { protect } = require("../middleware/authMiddleware");

// All log routes are protected
router.use(protect);

router.get("/progress", getProgressSummary);
router.get("/day/:date?", getDailyLog);
router.post("/meal", addMealEntry);
router.patch("/water", updateWater);
router.patch("/weight", updateWeight);
router.delete("/meal/:mealId", deleteMealEntry);

module.exports = router;
