const DailyLog = require("../models/DailyLog");

// @desc    Get daily log by date (defaults to today)
// @route   GET /api/logs/day/:date?
// @access  Private
const getDailyLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.params.date || new Date().toISOString().split("T")[0];

    let log = await DailyLog.findOne({ user: userId, date });

    // Auto-create log if not found
    if (!log) {
      log = await DailyLog.create({ user: userId, date, meals: [], waterCups: 0 });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a meal to the daily log
// @route   POST /api/logs/meal
// @access  Private
const addMealEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0]; // Use server date for posts
    const { name, type, calories, protein, carbs, fat, emoji } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Meal name and type are required" });
    }

    let log = await DailyLog.findOne({ user: userId, date });
    if (!log) {
      log = await DailyLog.create({ user: userId, date, meals: [], waterCups: 0 });
    }

    log.meals.push({ name, type, calories, protein, carbs, fat, emoji });
    await log.save();

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hydration count
// @route   PATCH /api/logs/water
// @access  Private
const updateWater = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0];
    const { waterCups } = req.body;

    if (waterCups === undefined) {
      return res.status(400).json({ message: "waterCups count is required" });
    }

    const log = await DailyLog.findOneAndUpdate(
      { user: userId, date },
      { waterCups },
      { new: true, upsert: true }
    );

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meal from log
// @route   DELETE /api/logs/meal/:mealId
// @access  Private
const deleteMealEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mealId } = req.params;

    const log = await DailyLog.findOne({ user: userId, "meals._id": mealId });
    if (!log) {
      return res.status(404).json({ message: "Meal log entry not found" });
    }

    log.meals = log.meals.filter((m) => m._id.toString() !== mealId);
    await log.save();

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDailyLog, addMealEntry, updateWater, deleteMealEntry };
