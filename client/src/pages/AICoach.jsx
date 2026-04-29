import { useState, useRef, useEffect } from "react";
import { CornerDownLeft, Sparkles, ChefHat, Clock, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosInstance";

const QUICK_ACTIONS = ["Analyze today's meal", "Suggest a healthy snack", "Recipe: Quinoa Bowl"];
const INIT_MSGS = [{
  id: 1, from: "ai",
  text: "Welcome to your NutriAI Coach. I am here to provide elite nutritional guidance and craft couture recipes for your meals. How can I assist you today?",
  suggestions: ["Recipe: Salmon & Rice", "Suggest a high-protein breakfast"]
}];

const RecipeCard = ({ recipe }) => (
  <div style={{ background: "var(--card-bg)", border: "1px solid var(--gold)", borderRadius: 2, padding: 24, width: "100%", maxWidth: 500, boxShadow: "0 8px 32px rgba(184,146,74,.08)" }}>
    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1, marginBottom: 8 }}>{recipe.title}</h3>
    <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--ink-60)", marginBottom: 20 }}>{recipe.description}</p>
    
    <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "1px solid var(--ink-10)", paddingBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--ink)", letterSpacing: "0.02em",  }}>
        <Clock size={14} color="var(--gold)" /> {recipe.prepTime}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--ink)", letterSpacing: "0.02em",  }}>
        <Flame size={14} color="var(--rust)" /> {recipe.calories} kcal
      </div>
    </div>

    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", marginBottom: 12 }}>Ingredients</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.6 }}>
        {recipe.ingredients.map((ing, i) => (
          <li key={i} style={{ borderBottom: "1px dashed var(--ink-10)", paddingBottom: 4, marginBottom: 4 }}>• {ing}</li>
        ))}
      </ul>
    </div>

    <div>
      <h4 style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", marginBottom: 12 }}>Method</h4>
      <ol style={{ paddingLeft: 16, margin: 0, fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.6 }}>
        {recipe.instructions.map((step, i) => (
          <li key={i} style={{ marginBottom: 8, paddingLeft: 8 }}>{step}</li>
        ))}
      </ol>
    </div>
  </div>
);

export default function AICoach() {
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = async (text) => {
    if (!text.trim()) return;
    
    // Add user message to UI immediately
    setMsgs(m => [...m, { id: Date.now(), from: "user", text, timestamp: new Date() }]);
    setInput("");
    setTyping(true);

    try {
      // Check if it's a recipe request (starts with "Recipe:" or "recipe:")
      const isRecipeRequest = text.toLowerCase().startsWith("recipe:");
      
      let aiResponse;
      if (isRecipeRequest) {
        const mealName = text.substring(7).trim();
        const res = await api.post("/ai/recipe", { mealName });
        aiResponse = {
          id: Date.now() + 1,
          from: "ai",
          recipe: res.data.recipe
        };
      } else {
        // Prepare simple context from previous messages (last 4)
        const context = msgs.slice(-4).map(m => `${m.from}: ${m.text || "Recipe Card"}`).join(" | ");
        const res = await api.post("/ai/chat", { message: text, context });
        aiResponse = {
          id: Date.now() + 1,
          from: "ai",
          text: res.data.text
        };
      }
      setMsgs(m => [...m, aiResponse]);
    } catch (err) {
      console.error("AI Communication error:", err);
      setMsgs(m => [...m, {
        id: Date.now() + 1,
        from: "ai",
        text: "I apologize, but I am currently unable to process your request. Please ensure the server is configured correctly."
      }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <main className="page-content" style={{ height: "100vh", paddingBottom: 0, paddingTop: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, margin: "32px 0", display: "flex", flexDirection: "column", background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ padding: "28px", borderBottom: "1px solid var(--ink-10)", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 2, background: "var(--cream-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={22} style={{ color: "var(--ink)" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>NutriAI Coach</h2>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", marginTop: 4 }}>Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: "16px 28px", display: "flex", gap: 12, flexWrap: "wrap", background: "var(--cream-dark)", borderBottom: "1px solid var(--ink-10)" }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a} style={{ background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.2)", padding: "8px 16px", borderRadius: 2, fontSize: "0.75rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", cursor: "pointer", boxShadow: "0 2px 8px rgba(26,22,18,.04)" }} onClick={() => send(a)}>{a}</button>
          ))}
        </div>

        {/* Chat */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 24, background: "var(--cream)" }}>
          <AnimatePresence>
            {msgs.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                
                {msg.recipe ? (
                  <RecipeCard recipe={msg.recipe} />
                ) : (
                  <div style={{ 
                    padding: "16px 20px", borderRadius: 2, maxWidth: "80%", lineHeight: 1.6, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif",
                    background: msg.from === "user" ? "var(--ink)" : "var(--card-bg)", 
                    color: msg.from === "user" ? "var(--cream)" : "var(--ink)",
                    border: msg.from === "ai" ? "1px solid rgba(184,146,74,.3)" : "none",
                    boxShadow: msg.from === "ai" ? "0 4px 16px rgba(26,22,18,.05)" : "none"
                  }}>
                    {msg.text}
                  </div>
                )}

                {msg.suggestions && (
                  <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    {msg.suggestions.map(s => (
                      <button key={s} style={{ background: "transparent", border: "1px solid var(--ink-30)", color: "var(--ink)", padding: "6px 14px", borderRadius: 2, fontSize: "0.7rem", fontFamily: "'Montserrat', sans-serif", cursor: "pointer" }} onClick={() => send(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <div style={{ padding: "16px 20px", borderRadius: 2, background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.3)", boxShadow: "0 4px 16px rgba(26,22,18,.05)" }}>
                  <span style={{ letterSpacing: 4, color: "var(--ink-30)", fontSize: 18 }}>•••</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "24px 28px", background: "var(--card-bg)", borderTop: "1px solid var(--ink-10)" }}>
          <form style={{ display: "flex", alignItems: "center", gap: 16 }} onSubmit={e => { e.preventDefault(); send(input); }}>
            <div style={{ flex: 1, background: "var(--cream-dark)", borderRadius: 2, padding: "0 20px", height: 52, display: "flex", alignItems: "center", border: "1px solid var(--ink-10)" }}>
              <input style={{ flex: 1, border: "none", background: "none", fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} placeholder="Ask your AI coach or type 'Recipe: [Meal]'" value={input} onChange={e => setInput(e.target.value)} />
            </div>
            <button type="submit" disabled={!input.trim() || typing} style={{ width: 52, height: 52, padding: 0, borderRadius: 2, flexShrink: 0, background: "var(--ink)", color: "var(--cream)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!input.trim() || typing) ? 0.5 : 1 }}>
              <CornerDownLeft size={20} />
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
