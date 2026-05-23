const UserGoal = require("../models/UserGoal");

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
const getUserGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    let goal = await UserGoal.findOne({ user: userId });

    // Auto-create goal with defaults if missing
    if (!goal) {
      goal = await UserGoal.create({ user: userId });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user goals
// @route   PUT /api/goals
// @access  Private
const updateUserGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal, calories, protein, carbs, fat } = req.body;

    const updatedGoal = await UserGoal.findOneAndUpdate(
      { user: userId },
      { goal, calories, protein, carbs, fat },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserGoal, updateUserGoal };
