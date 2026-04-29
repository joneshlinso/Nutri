const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const modelName = process.env.GOOGLE_MODEL || 'gemini-2.5-flash-lite';

// @desc    Chat with NutriAI Coach
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const systemPrompt = `You are a high-end, luxury nutritionist and wellness coach named 'NutriAI'. 
    Your tone is encouraging, highly professional, slightly elegant, and concise. 
    You provide practical, science-backed nutritional advice. 
    Keep responses relatively short (2-3 sentences) unless asked for details.
    Context about the user's current state: ${context || "None provided."}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: "Failed to communicate with AI Coach" });
  }
};

// @desc    Generate a Couture Recipe
// @route   POST /api/ai/recipe
// @access  Private
const generateCoutureRecipe = async (req, res) => {
  try {
    const { mealName } = req.body;
    
    if (!mealName) {
      return res.status(400).json({ message: "Meal name is required" });
    }

    const prompt = `Act as an elite culinary chef and luxury nutritionist. 
    Create a 'Couture Recipe' for a meal inspired by: "${mealName}".
    
    Format the response as a strict JSON object with exactly these keys:
    {
      "title": "A sophisticated name for the dish",
      "description": "A 1-2 sentence elegant description",
      "prepTime": "e.g., 15 mins",
      "calories": "estimated kcal as a number",
      "ingredients": ["list", "of", "ingredients with precise measurements"],
      "instructions": ["Step 1", "Step 2", "Step 3"]
    }
    
    Ensure the JSON is valid and contains no markdown formatting outside the JSON itself.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
      }
    });

    // The SDK with responseMimeType="application/json" returns the JSON string.
    const recipeJson = JSON.parse(response.text);

    res.json({ recipe: recipeJson });
  } catch (error) {
    console.error("AI Recipe Error:", error);
    res.status(500).json({ message: "Failed to generate couture recipe" });
  }
};

// @desc    Analyze a meal photo using Vision AI
// @route   POST /api/ai/vision-log
// @access  Private
const analyzeMealImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ message: "Image data is required" });
    }

    const prompt = `Analyze this food image. Provide a luxurious name for the meal, and estimate its nutritional content.
    Return ONLY a valid JSON object with the following structure:
    {
      "name": "Elegant meal name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }`;

    // Remove the data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        prompt
      ],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    });

    const mealData = JSON.parse(response.text);
    res.json(mealData);

  } catch (error) {
    console.error("Vision AI Error:", error);
    res.status(500).json({ message: "Failed to analyze meal image" });
  }
};

// @desc    Generate a Gourmet Grocery List
// @route   POST /api/ai/grocery
// @access  Private
const generateGroceryList = async (req, res) => {
  try {
    const { meals } = req.body;
    
    if (!meals || !meals.length) {
      return res.status(400).json({ message: "Meals data is required" });
    }

    const prompt = `Act as an elite luxury nutritionist and personal shopper. 
    Analyze this list of meals planned for the week: ${JSON.stringify(meals)}.
    Extract all necessary ingredients and categorize them into high-end "Boutiques" 
    (e.g., "The Butcher", "The Fromagerie", "The Green Grocer", "The Pantry").
    
    Return ONLY a valid JSON object with the following structure:
    {
      "boutiques": [
        {
          "name": "The Green Grocer",
          "items": ["Organic Kale (2 bunches)", "Avocados (4)"]
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.5,
        responseMimeType: "application/json",
      }
    });

    const groceryData = JSON.parse(response.text);
    res.json(groceryData);

  } catch (error) {
    console.error("AI Grocery Error:", error);
    res.status(500).json({ message: "Failed to generate grocery list" });
  }
};

module.exports = { chatWithAI, generateCoutureRecipe, analyzeMealImage, generateGroceryList };
