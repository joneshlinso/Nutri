const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

/**
 * Generates content using a list of models in order, falling back if a model
 * fails due to quota limit (429) or service unavailability (503/500).
 */
async function generateContentWithFallback(contents, configOptions = {}) {
  const primaryModel = process.env.GOOGLE_MODEL || 'gemini-2.5-flash-lite';
  const modelsToTry = [
    primaryModel,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite'
  ];

  // Deduplicate list of models
  const uniqueModels = [...new Set(modelsToTry)];
  let lastError;

  for (const model of uniqueModels) {
    try {
      console.log(`[GeminiService] Attempting generateContent using model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: configOptions
      });
      console.log(`[GeminiService] Success with model: ${model}`);
      return response;
    } catch (err) {
      lastError = err;
      const code = err.status || err.statusCode || (err.error && err.error.code);
      console.warn(`[GeminiService] Model ${model} failed (status: ${code}): ${err.message || err}`);
      
      // If it's a client/permission/not-found error (except 429 quota and 503/500 backend issues),
      // we shouldn't attempt fallbacks as they will fail with the same issue.
      if (code && code !== 429 && code !== 503 && code !== 500) {
        throw err;
      }
    }
  }
  
  throw lastError;
}

module.exports = { ai, generateContentWithFallback };
