const express = require("express");
const router = express.Router();
const { chatWithAI, generateCoutureRecipe, analyzeMealImage, generateGroceryList, runCorrectionAgent, getRagStats } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// All AI routes are protected
router.use(protect);

router.post("/chat", chatWithAI);
router.post("/recipe", generateCoutureRecipe);
router.post("/vision-log", analyzeMealImage);
router.post("/grocery", generateGroceryList);
router.post("/agent/correct", runCorrectionAgent);
router.get("/rag/stats", getRagStats);

module.exports = router;
