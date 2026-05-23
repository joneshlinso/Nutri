const mongoose = require("mongoose");

const userGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user has one set of goals
    },
    goal: {
      type: String,
      default: "Maintenance",
    },
    calories: {
      type: Number,
      default: 2000,
    },
    protein: {
      type: Number,
      default: 150,
    },
    carbs: {
      type: Number,
      default: 250,
    },
    fat: {
      type: Number,
      default: 70,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserGoal", userGoalSchema);
