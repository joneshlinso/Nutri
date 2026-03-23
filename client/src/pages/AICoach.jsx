import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

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

const FADE_UP = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

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
      const aiMsg = {
        id: Date.now() + 1, from: "ai", text: `I'm analyzing your data regarding "${text}"...\n\nBased on your profile, I'd suggest focusing on whole foods today. Let me know if you want a specific recipe!`, timestamp: new Date(),
        suggestions: ["Give me a recipe", "Other options"],
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
    <motion.main className="page-content" style={{ display:"flex", flexDirection:"column", height:"100vh", padding: 0 }} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      
      {/* ─── Header ─── */}
      <motion.div variants={FADE_UP} style={{ padding: "var(--sp-6) var(--sp-8)", borderBottom: "1px solid var(--border)", background: "rgba(9, 9, 11, 0.8)", backdropFilter: "blur(20px)", zIndex: 10 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#34D399,#047857)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--shadow-glow)" }}>
              <Sparkles size={22} style={{ color:"#fff" }} />
            </div>
            <div>
              <h1 className="t-h3 text-text">Nutri<span className="text-primary">AI</span> Coach</h1>
              <div className="flex items-center gap-2 mt-1">
                <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--success)",boxShadow:"0 0 8px var(--success)" }} />
                <span className="t-xs text-muted" style={{ fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Online</span>
              </div>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setMessages(INIT_MESSAGES)} title="New Chat">
            <RefreshCw size={18} />
          </button>
        </div>
      </motion.div>

      {/* ─── Quick Actions ─── */}
      <motion.div variants={FADE_UP} className="flex gap-2" style={{ padding: "var(--sp-4) var(--sp-8)", flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
        {QUICK_ACTIONS.map(a => (
          <button key={a} className="chip" onClick={() => sendMessage(a.slice(2))}>{a}</button>
        ))}
      </motion.div>

      {/* ─── Messages Area ─── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--sp-8)", display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ type:"spring", damping:24 }}
            style={{ display:"flex", flexDirection:"column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap:8 }}>
            
            {msg.from === "ai" && (
              <div className="flex items-center gap-2 mb-1">
                <div style={{ width:24,height:24,borderRadius:8,background:"linear-gradient(135deg,#34D399,#047857)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <Sparkles size={12} style={{ color:"#fff" }} />
                </div>
                <span className="t-xs text-muted" style={{ fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>NutriAI</span>
              </div>
            )}
            
            <div className={`chat-bubble ${msg.from}`} style={{ maxWidth:"75%", boxShadow: msg.from === "user" ? "var(--shadow-neon)" : "var(--shadow-md)" }}>
              {msg.from === "ai" ? formatText(msg.text) : msg.text}
            </div>

            {msg.suggestions && (
              <div className="flex gap-2 mt-2" style={{ flexWrap:"wrap" }}>
                {msg.suggestions.map(s => (
                  <button key={s} className="btn btn-secondary btn-sm" onClick={() => sendMessage(s)} style={{ borderRadius: "var(--r-sm)" }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-2">
            <div style={{ width:24,height:24,borderRadius:8,background:"linear-gradient(135deg,#34D399,#047857)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Sparkles size={12} style={{ color:"#fff" }} />
            </div>
            <div className="chat-bubble ai" style={{ padding:"12px 16px" }}>
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ─── Input ─── */}
      <motion.div variants={FADE_UP} style={{ padding: "var(--sp-6) var(--sp-8)", borderTop: "1px solid var(--border)", background: "rgba(9, 9, 11, 0.8)", backdropFilter: "blur(20px)" }}>
        <form className="flex items-center gap-3" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
          <div className="search-bar" style={{ flex: 1, height: 56, borderRadius: "var(--r-md)", padding: "0 var(--sp-4)" }}>
            <input placeholder="Ask me anything about your nutrition…" value={input} onChange={e => setInput(e.target.value)} style={{ fontSize: "1rem" }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!input.trim() || typing} style={{ width: 56, height: 56, padding: 0, borderRadius: "var(--r-md)" }}>
            <Send size={20} />
          </button>
        </form>
      </motion.div>
    </motion.main>
  );
}
