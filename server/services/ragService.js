/**
 * RAG Service — Nutritional Knowledge Base
 * 
 * Uses Gemini's text-embedding-004 model to embed nutrition facts,
 * then performs cosine similarity search to retrieve relevant context
 * before sending it to the chat model (no Atlas Vector Index required —
 * we do in-process cosine similarity for portability).
 */

const { GoogleGenAI } = require("@google/genai");
const NutritionKnowledge = require("../models/NutritionKnowledge");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// ─── Embed text using Gemini embedding model ───────────────────────────────
async function embedText(text) {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
  });
  return result.embeddings[0].values;
}

// ─── Cosine similarity (in-process) ───────────────────────────────────────
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// ─── Retrieve top-K relevant knowledge chunks ─────────────────────────────
async function retrieveRelevantContext(query, topK = 4) {
  try {
    const queryEmbedding = await embedText(query);
    const allDocs = await NutritionKnowledge.find({}, "content embedding category source");
    
    if (!allDocs.length) return "";

    const scored = allDocs.map((doc) => ({
      content: doc.content,
      category: doc.category,
      source: doc.source,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);
    const topDocs = scored.slice(0, topK).filter((d) => d.score > 0.3);

    if (!topDocs.length) return "";

    return topDocs
      .map((d) => `[${d.category.toUpperCase()} — ${d.source}]\n${d.content}`)
      .join("\n\n");
  } catch (err) {
    console.error("RAG retrieval error:", err.message);
    return ""; // Graceful fallback — chat still works without RAG context
  }
}

// ─── Seed a single knowledge document (with embedding) ───────────────────
async function seedKnowledgeDocument(content, category, source) {
  try {
    const existing = await NutritionKnowledge.findOne({ content });
    if (existing) return { skipped: true };

    const embedding = await embedText(content);
    await NutritionKnowledge.create({ content, category, source, embedding });
    return { created: true };
  } catch (err) {
    console.error("Seed error:", err.message);
    throw err;
  }
}

// ─── Count documents in knowledge base ───────────────────────────────────
async function getKnowledgeCount() {
  return NutritionKnowledge.countDocuments();
}

module.exports = { retrieveRelevantContext, seedKnowledgeDocument, getKnowledgeCount, embedText };
