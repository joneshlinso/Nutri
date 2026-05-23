const mongoose = require("mongoose");

const nutritionKnowledgeSchema = new mongoose.Schema({
  content: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "macros", "vitamins", "goals"
  source: { type: String, default: "USDA / WHO Guidelines" },
  embedding: { type: [Number], required: true },
}, { timestamps: true });

// Create a vector search index — Atlas Index name must be "nutrition_vector_index"
nutritionKnowledgeSchema.index({ category: 1 });

module.exports = mongoose.model("NutritionKnowledge", nutritionKnowledgeSchema);
