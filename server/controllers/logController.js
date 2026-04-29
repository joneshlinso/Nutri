const DailyLog = require("../models/DailyLog");
const UserGoal = require("../models/UserGoal");

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

// @desc    Update daily weight
// @route   PATCH /api/logs/weight
// @access  Private
const updateWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0];
    const { weight } = req.body;

    if (weight === undefined) {
      return res.status(400).json({ message: "Weight value is required" });
    }

    const log = await DailyLog.findOneAndUpdate(
      { user: userId, date },
      { weight },
      { new: true, upsert: true }
    );

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get progress summary (last 30 days)
// @route   GET /api/logs/progress
// @access  Private
const getProgressSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split("T")[0];

    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: dateStr },
    }).sort({ date: 1 });

    const goal = await UserGoal.findOne({ user: userId });
    const calorieGoal = goal ? goal.calories : 2000;

    // Format for charts
    const weightTrend = logs
      .filter((l) => l.weight)
      .map((l) => ({ date: l.date, weight: l.weight }));

    const calorieData = logs.map((l) => {
      const totalEaten = l.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      return {
        day: l.date.split("-")[2], // Just the day number
        eaten: totalEaten,
        goal: calorieGoal,
      };
    });

    // Summary stats
    const currentWeight = weightTrend.length > 0 ? weightTrend[weightTrend.length - 1].weight : null;
    const startWeight = weightTrend.length > 0 ? weightTrend[0].weight : null;
    const weightLost = currentWeight && startWeight ? (startWeight - currentWeight).toFixed(1) : 0;

    res.json({
      weightTrend,
      calorieData,
      stats: {
        currentWeight: currentWeight ? `${currentWeight} kg` : "--",
        weightLost: `${weightLost} kg`,
        avgWater: (logs.reduce((s, l) => s + (l.waterCups || 0), 0) / (logs.length || 1)).toFixed(1) + " L", // Assuming 1 cup = 0.25L roughly, or just keep as cups? Frontend shows L, let's assume 1 cup = 0.25L
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDailyLog, addMealEntry, updateWater, deleteMealEntry, updateWeight, getProgressSummary };
