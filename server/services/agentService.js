/**
 * Macro Correction Agent
 *
 * An autonomous agent that analyzes a user's logged meals vs their goals
 * and proactively suggests or updates the planner if macros are off track.
 *
 * Tools available to the agent:
 *   - get_daily_status: reads today's logs vs goals
 *   - suggest_correction_meal: generates a corrective meal suggestion
 */

const { GoogleGenAI } = require("@google/genai");
const DailyLog = require("../models/DailyLog");
const UserGoal = require("../models/UserGoal");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const modelName = process.env.GOOGLE_MODEL || "gemini-2.5-flash-lite";

/**
 * Analyzes the user's day and produces a correction plan if they are off-track.
 * Returns: { status, caloriesRemaining, proteinRemaining, correctionMeal, message }
 */
async function runMacroCorrectionAgent(userId) {
  // ─── Step 1: Gather context ────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD" string
  
  const [goals, todayLog] = await Promise.all([
    UserGoal.findOne({ user: userId }),
    DailyLog.findOne({ user: userId, date: today }), // exact string match
  ]);

  if (!goals) {
    return { status: "no_goals", message: "Set your nutrition goals first in the Profile section." };
  }

  const targetCalories  = goals.calories  || 2000;
  const targetProtein   = goals.protein   || 150;
  const targetCarbs     = goals.carbs     || 250;
  const targetFat       = goals.fat       || 70;

  // Aggregate today's nutrition from the log
  const consumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  if (todayLog?.meals?.length) {
    todayLog.meals.forEach(m => {
      consumed.calories += m.calories || 0;
      consumed.protein  += m.protein  || 0;
      consumed.carbs    += m.carbs    || 0;
      consumed.fat      += m.fat      || 0;
    });
  }

  const remaining = {
    calories: targetCalories - consumed.calories,
    protein:  targetProtein  - consumed.protein,
    carbs:    targetCarbs    - consumed.carbs,
    fat:      targetFat      - consumed.fat,
  };

  const percentageUsed = ((consumed.calories / targetCalories) * 100).toFixed(1);

  // ─── Step 2: Decide if intervention needed ─────────────────────────────
  const isOverCalories = remaining.calories < -200;
  const isLowProtein   = remaining.protein > 30 && new Date().getHours() >= 18;
  const isOnTrack      = !isOverCalories && !isLowProtein;

  if (isOnTrack) {
    return {
      status: "on_track",
      percentageUsed,
      consumed,
      remaining,
      message: `You're perfectly on track — ${percentageUsed}% of daily calories consumed. Keep it up.`,
    };
  }

  // ─── Step 3: Agent generates a corrective meal ─────────────────────────
  const agentPrompt = `You are NutriAI, an elite autonomous nutrition agent. 

A user has the following remaining nutritional budget for today:
- Calories remaining: ${remaining.calories} kcal
- Protein remaining: ${remaining.protein}g
- Carbs remaining: ${remaining.carbs}g
- Fat remaining: ${remaining.fat}g

Current situation:
${isOverCalories ? "⚠️ The user has EXCEEDED their calorie target by " + Math.abs(remaining.calories) + " kcal." : ""}
${isLowProtein ? "⚠️ It is evening and the user is still " + remaining.protein + "g short of their protein goal." : ""}

Generate ONE elegant corrective meal suggestion that fits within the remaining budget.
Return ONLY a valid JSON object:
{
  "mealName": "Elegant meal name",
  "description": "One sentence description",
  "estimatedCalories": number,
  "estimatedProtein": number,
  "agentMessage": "A short, encouraging explanation of why this meal was chosen (1-2 sentences, professional tone)"
}`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: agentPrompt,
    config: { temperature: 0.5, responseMimeType: "application/json" },
  });

  const correctionMeal = JSON.parse(response.text);

  return {
    status: isOverCalories ? "over_calories" : "low_protein",
    percentageUsed,
    consumed,
    remaining,
    correctionMeal,
    message: correctionMeal.agentMessage,
  };
}

module.exports = { runMacroCorrectionAgent };
