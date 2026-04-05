const express = require("express");
const router = express.Router();
const { getUserGoal, updateUserGoal } = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

// All goal routes are protected
router.use(protect);

router.get("/", getUserGoal);
router.put("/", updateUserGoal);

module.exports = router;
