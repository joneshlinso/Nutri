import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Plus, RefreshCw } from "lucide-react";

const QUICK_ACTIONS = [
  "📋 Generate today's diet",
  "🍗 Fix my protein intake",
  "🥗 Suggest a healthy dinner",
  "💧 Hydration tips",
  "📊 Analyse my week",
];

const INIT_MESSAGES = [
  {
    id: 1, from: "ai",
    text: "Hey! 👋 I'm your AI nutrition coach. Based on today's log, you've eaten 1,420 kcal (77% of goal) and you're 57g short on protein. What would you like help with?",
    timestamp: new Date(Date.now() - 60000),
    suggestions: ["Fix protein", "Generate dinner plan", "Weekly summary"],
  },
];

const AI_RESPONSES = {
  "Fix protein": "Great choice! To hit your 145g protein target today you still need ~57g more. Here are quick options:\n\n• **Grilled Chicken Breast** (100g) → 31g protein, 165 kcal\n• **Protein Shake** (1 scoop) → 25g protein, 120 kcal\n• **Greek Yogurt** (200g) → 34g protein, 120 kcal\n\nI recommend adding the chicken + Greek yogurt with dinner. Want me to add them to your log?",
  "Generate dinner plan": "Based on your remaining macros (57g protein, 23g carbs, 17g fat), here's tonight's ideal dinner:\n\n🍗 **Grilled Chicken** (150g) — 46g protein\n🥦 **Steamed Broccoli** (200g) — 5g protein, 14g carbs\n🫒 **Olive Oil drizzle** (1 tbsp) — 14g fat\n\nTotal: ~470 kcal | 51g protein | 14g carbs | 18g fat\n\nThis fills your gaps perfectly! Want me to add this to your meal log?",
  "Weekly summary": "Here's your week at a glance 📊:\n\n• **Avg calories:** 1,774 / 1,850 kcal (96% — excellent!)\n• **Best day:** Wednesday (1,650 kcal, all macros on target)\n• **Streak:** 5 days logged in a row 🔥\n• **Protein avg:** 96g/day (goal: 145g) — needs improvement\n• **Hydration:** 6.2 / 8 glasses avg\n\n**Top suggestion:** Increase protein at breakfast with eggs or yogurt. It'll improve satiety and energy!",
};

export default function AICoach() {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput(""); setTyping(true);

    setTimeout(() => {
      const reply = AI_RESPONSES[text] || `Thanks for asking about "${text}". Let me analyse your nutrition data...\n\nBased on your current macros and goals, I'd recommend focusing on whole foods with balanced protein sources. Would you like a specific meal suggestion or a full day plan?`;
      const aiMsg = {
        id: Date.now() + 1, from: "ai", text: reply, timestamp: new Date(),
        suggestions: text === "Fix protein" ? ["Add to log", "Other options"] : ["Generate full plan", "Tell me more"],
      };
      setTyping(false);
      setMessages(m => [...m, aiMsg]);
    }, 1600);
  };

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ margin:"3px 0", lineHeight:1.6 }} />;
    });
  };

  return (
    <main style={{ display:"flex", flexDirection:"column", height:"100vh", background:"var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div style={{ width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,var(--primary-light),var(--primary))",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Sparkles size={22} style={{ color:"#fff" }} />
          </div>
          <div>
            <h1 className="t-h3">AI Nutrition Coach</h1>
            <div className="flex items-center gap-1">
              <div style={{ width:7,height:7,borderRadius:"50%",background:"var(--success)" }} />
              <span className="t-xs text-muted">Online • Analysing your data</span>
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm flex items-center gap-2" onClick={() => setMessages(INIT_MESSAGES)}>
          <RefreshCw size={14} /> New Chat
        </button>
      </div>

      {/* Quick Action chips */}
      <div className="flex gap-2 p-4" style={{ flexWrap:"wrap", borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
        {QUICK_ACTIONS.map(a => (
          <button key={a} className="chip" onClick={() => sendMessage(a.slice(2))}>{a}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"var(--sp-6)", display:"flex", flexDirection:"column", gap:"var(--sp-4)" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display:"flex", flexDirection:"column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap:8 }}>
            {msg.from === "ai" && (
              <div className="flex items-center gap-2">
                <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,var(--primary-light),var(--primary))",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <Sparkles size={14} style={{ color:"#fff" }} />
                </div>
                <span className="t-xs text-muted">NutriAI</span>
              </div>
            )}
            <div className={`chat-bubble ${msg.from}`} style={{ maxWidth:"78%" }}>
              {msg.from === "ai" ? formatText(msg.text) : msg.text}
            </div>
            {msg.suggestions && (
              <div className="flex gap-2" style={{ flexWrap:"wrap" }}>
                {msg.suggestions.map(s => (
                  <button key={s} className="btn btn-secondary btn-sm" onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-2 fade-up">
            <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,var(--primary-light),var(--primary))",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Sparkles size={14} style={{ color:"#fff" }} />
            </div>
            <div className="chat-bubble ai" style={{ padding:"12px 16px" }}>
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:"var(--sp-4) var(--sp-6)", borderTop:"1px solid var(--border)", background:"var(--surface)" }}>
        <form className="flex items-center gap-3"
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
          <input
            className="input" style={{ flex:1 }}
            placeholder="Ask me anything about your nutrition…"
            value={input} onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!input.trim() || typing}
            style={{ padding:"11px 18px", borderRadius:"var(--r-md)" }}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}
