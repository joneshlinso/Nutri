const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Breakfast", "Lunch", "Dinner", "Snack"], required: true },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  emoji: { type: String, default: "🍽️" },
  createdAt: { type: Date, default: Date.now }
});

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    meals: [mealSchema],
    waterCups: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      required: false,
    }
  },
  { timestamps: true }
);

// Ensure a user can only have one log per date
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyLog", dailyLogSchema);
