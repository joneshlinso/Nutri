const MealPlan = require("../models/MealPlan");
const UserGoal = require("../models/UserGoal");
const { generateContentWithFallback } = require('../services/geminiService');

const PLANNER_EMOJIS = {
  Morning: "🍳",
  Midday: "🥗",
  Evening: "🍲",
  Snack: "🍎"
};

// @desc    Get user's weekly meal plan
// @route   GET /api/plans
// @access  Private
const getMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    let plan = await MealPlan.findOne({ user: userId });

    if (!plan) {
      // Return empty structure if no plan exists
      return res.json({
        user: userId,
        weekStartDate: new Date().toISOString().split("T")[0],
        plan: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
      });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save or update weekly meal plan
// @route   POST /api/plans
// @access  Private
const saveMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weekStartDate, plan } = req.body;

    const mealPlan = await MealPlan.findOneAndUpdate(
      { user: userId },
      { weekStartDate, plan },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto-generate a meal plan
// @route   POST /api/plans/generate
// @access  Private
const generateMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user goals
    const goal = await UserGoal.findOne({ user: userId });
    const calories = goal ? goal.calories : 2000;
    const protein = goal ? goal.protein : 150;
    const carbs = goal ? goal.carbs : 250;
    const fat = goal ? goal.fat : 70;
    const primaryGoal = goal ? goal.goal : "Maintenance";

    const prompt = `Act as an elite luxury nutritionist. Create a 7-day personalized meal plan (Mon-Sun).
    The user's primary goal is "${primaryGoal}", targeting around ${calories} kcal, ${protein}g protein, ${carbs}g carbs, and ${fat}g fat per day.
    
    Format the response strictly as a JSON object where keys are the days of the week ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun").
    Each day should contain an array of exactly 3 meals (Morning, Midday, Evening).
    Each meal object must have these exact properties:
    {
      "id": a unique integer number (e.g., from 1 to 21),
      "type": "Morning", "Midday", or "Evening",
      "name": "Elegant meal name",
      "cal": number (estimated calories),
      "emoji": "emoji representing the food"
    }
    
    Ensure the JSON is valid.`;

    const response = await generateContentWithFallback(prompt, {
      temperature: 0.8,
      responseMimeType: "application/json",
    });

    let cleanText = response.text.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    const generatedPlan = JSON.parse(cleanText);

    // Normalize emojis to the 4 core emojis based on type
    for (const day of Object.keys(generatedPlan)) {
      if (Array.isArray(generatedPlan[day])) {
        generatedPlan[day] = generatedPlan[day].map(meal => {
          meal.emoji = PLANNER_EMOJIS[meal.type] || "🍲";
          return meal;
        });
      }
    }

    const weekStartDate = new Date().toISOString().split("T")[0];

    const mealPlan = await MealPlan.findOneAndUpdate(
      { user: userId },
      { weekStartDate, plan: generatedPlan },
      { new: true, upsert: true }
    );

    res.json(mealPlan);
  } catch (error) {
    console.error("Meal Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMealPlan, saveMealPlan, generateMealPlan };
