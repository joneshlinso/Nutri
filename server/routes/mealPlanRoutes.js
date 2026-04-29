const express = require("express");
const router = express.Router();
const { getMealPlan, saveMealPlan, generateMealPlan } = require("../controllers/mealPlanController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getMealPlan);
router.post("/", saveMealPlan);
router.post("/generate", generateMealPlan);

module.exports = router;
