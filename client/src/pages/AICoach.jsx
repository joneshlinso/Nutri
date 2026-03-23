import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "../components/TiltCard";

const QUICK_ACTIONS = [
  "📋 Generate matrix",
  "🍗 Optimize protein synthesis",
  "🥗 Calculate dinner",
  "💧 Hydration protocols",
  "📊 Telemetry analysis",
];

const INIT_MESSAGES = [
  {
    id: 1, from: "ai",
    text: "System initialized. 👋 Based on today's telemetry, you've metabolized 1,420 kcal (77% of target) and you're 57g short on protein. What operation would you like to execute?",
    timestamp: new Date(Date.now() - 60000),
    suggestions: ["Fix protein", "Sequence dinner", "Weekly variance"],
  },
];

const FADE_UP = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } };

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
        id: Date.now() + 1, from: "ai", text: `Computing parameters for: "${text}"...\n\nBased on your biometric profile, I recommend prioritizing whole food sources. Awaiting further commands.`, timestamp: new Date(),
        suggestions: ["Give me a recipe", "Other options"],
      };
      setTyping(false);
      setMessages(m => [...m, aiMsg]);
    }, 1800);
  };

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ margin:"4px 0", lineHeight:1.6 }} />;
    });
  };

  return (
    <motion.main initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)", margin: "var(--sp-6) 0" }}>
      
      <TiltCard className="flex-col" style={{ flex: 1, overflow: "hidden", background: "rgba(0,0,0,0.6)", borderColor: "var(--primary-glow)" }}>
        
        {/* ─── Header ─── */}
        <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--glass-border)", background: "var(--glass-1)", zIndex: 10 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div style={{ width:48,height:48,borderRadius:12,background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(0,230,118,0.4)" }}>
                <Sparkles size={24} style={{ color:"#000" }} />
              </div>
              <div>
                <h1 className="t-h2 text-text">Nutri<span className="text-primary">AI</span> Core</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--primary)",boxShadow:"0 0 12px var(--primary)", animation: "pulse 2s infinite" }} />
                  <span className="t-xs text-primary">Neural Link Established</span>
                </div>
              </div>
            </div>
            <button className="btn-icon" style={{ background: "transparent" }} onClick={() => setMessages(INIT_MESSAGES)} title="Reset Link">
              <RefreshCw size={20} className="text-muted hover:text-text transition-colors" />
            </button>
          </div>
        </div>

        {/* ─── Quick Actions ─── */}
        <div className="flex gap-2" style={{ padding: "var(--sp-4) 40px", flexWrap: "wrap", borderBottom: "1px solid var(--glass-border)", background: "var(--glass-1)" }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a} className="chip text-xs" style={{ background: "var(--glass-2)", border: "1px solid var(--glass-border)" }} onClick={() => sendMessage(a.slice(2))}>{a}</button>
          ))}
        </div>

        {/* ─── Chat Thread ─── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px", display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity:0, y:20, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ type:"spring", damping:24 }}
                style={{ display:"flex", flexDirection:"column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap:8 }}>
                
                {msg.from === "ai" && (
                  <div className="flex items-center gap-3 mb-1">
                    <div style={{ width:24,height:24,borderRadius:6,background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <Sparkles size={12} style={{ color:"#000" }} />
                    </div>
                    <span className="t-xs text-secondary">NutriAI</span>
                  </div>
                )}
                
                <div className="chat-bubble" style={{ 
                  maxWidth:"80%", 
                  background: msg.from === "user" ? "var(--text)" : "var(--glass-2)",
                  color: msg.from === "user" ? "#000" : "var(--text)",
                  border: `1px solid ${msg.from === "user" ? "var(--text)" : "var(--glass-border)"}`,
                  boxShadow: msg.from === "user" ? "0 4px 20px rgba(255,255,255,0.15)" : "0 4px 20px rgba(0,0,0,0.5)",
                  borderBottomRightRadius: msg.from === "user" ? 4 : "var(--r-lg)",
                  borderBottomLeftRadius: msg.from === "ai" ? 4 : "var(--r-lg)",
                }}>
                  {msg.from === "ai" ? formatText(msg.text) : msg.text}
                </div>

                {msg.suggestions && (
                  <div className="flex gap-2 mt-3" style={{ flexWrap:"wrap" }}>
                    {msg.suggestions.map(s => (
                      <button key={s} className="btn btn-secondary btn-sm" onClick={() => sendMessage(s)} style={{ borderRadius: "var(--r-pill)" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-2">
              <div style={{ width:24,height:24,borderRadius:6,background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Sparkles size={12} style={{ color:"#000" }} />
              </div>
              <div className="chat-bubble ai" style={{ padding:"16px 20px" }}>
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ─── Input Terminal ─── */}
        <div style={{ padding: "32px 40px", borderTop: "1px solid var(--glass-border)", background: "var(--glass-1)" }}>
          <form className="flex items-center gap-4" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <div className="search-bar" style={{ flex: 1, height: 60, borderRadius: "var(--r-md)", padding: "0 24px", background: "rgba(0,0,0,0.5)" }}>
              <input placeholder="Transmit command to AI Core..." value={input} onChange={e => setInput(e.target.value)} style={{ fontSize: "1rem" }} />
            </div>
            <button type="submit" className="btn btn-neon" disabled={!input.trim() || typing} style={{ width: 60, height: 60, padding: 0, borderRadius: "var(--r-md)" }}>
              <Send size={24} />
            </button>
          </form>
        </div>

      </TiltCard>
    </motion.main>
  );
}
