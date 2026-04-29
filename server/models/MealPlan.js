const mongoose = require("mongoose");

const plannedMealSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Unique within the week for frontend tracking
  name: { type: String, required: true },
  type: { type: String, enum: ["Morning", "Midday", "Evening", "Snack"], required: true },
  cal: { type: Number, default: 0 },
  emoji: { type: String, default: "🍽️" }
});

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // For now, one main plan per user
    },
    weekStartDate: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    plan: {
      Mon: [plannedMealSchema],
      Tue: [plannedMealSchema],
      Wed: [plannedMealSchema],
      Thu: [plannedMealSchema],
      Fri: [plannedMealSchema],
      Sat: [plannedMealSchema],
      Sun: [plannedMealSchema],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
