const MealPlan = require("../models/MealPlan");

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
    
    // Mock generation logic - in a real app, this could call an LLM or use an algorithm
    const generatedPlan = {
      "Mon":[{id:1,type:"Morning",name:"Egg Scramble",cal:350,emoji:"🍳"},{id:2,type:"Midday",name:"Quinoa Bowl",cal:500,emoji:"🥗"},{id:3,type:"Evening",name:"Steak & Potato",cal:650,emoji:"🥩"}],
      "Tue":[{id:4,type:"Morning",name:"Smoothie",cal:280,emoji:"🥤"},{id:5,type:"Midday",name:"Turkey Wrap",cal:420,emoji:"🌯"},{id:6,type:"Evening",name:"Baked Cod",cal:400,emoji:"🐟"}],
      "Wed":[{id:7,type:"Morning",name:"Greek Yogurt",cal:250,emoji:"🫙"},{id:8,type:"Midday",name:"Tuna Salad",cal:380,emoji:"🥗"},{id:9,type:"Evening",name:"Stir-fry",cal:550,emoji:"🥢"}],
      "Thu":[{id:10,type:"Morning",name:"Avocado Toast",cal:320,emoji:"🥑"},{id:11,type:"Midday",name:"Lentil Soup",cal:350,emoji:"🍲"},{id:12,type:"Evening",name:"Pork Chop",cal:600,emoji:"🍖"}],
      "Fri":[{id:13,type:"Morning",name:"Oatmeal",cal:300,emoji:"🥣"},{id:14,type:"Midday",name:"Caesar Salad",cal:450,emoji:"🥗"},{id:15,type:"Evening",name:"Pizza",cal:700,emoji:"🍕"}],
      "Sat":[{id:16,type:"Morning",name:"Pancakes",cal:500,emoji:"🥞"},{id:17,type:"Midday",name:"Burger",cal:650,emoji:"🍔"},{id:18,type:"Evening",name:"Pasta",cal:580,emoji:"🍝"}],
      "Sun":[{id:19,type:"Morning",name:"Bacon & Eggs",cal:450,emoji:"🍳"},{id:20,type:"Midday",name:"Sandwich",cal:400,emoji:"🥪"},{id:21,type:"Evening",name:"Roast Chicken",cal:600,emoji:"🍗"}],
    };

    const weekStartDate = new Date().toISOString().split("T")[0];

    const mealPlan = await MealPlan.findOneAndUpdate(
      { user: userId },
      { weekStartDate, plan: generatedPlan },
      { new: true, upsert: true }
    );

    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMealPlan, saveMealPlan, generateMealPlan };
