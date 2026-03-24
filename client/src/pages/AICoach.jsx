import { useState, useRef, useEffect } from "react";
import { CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = [
  "Analyze today's intake",
  "Suggest an evening recipe",
  "Calculate dinner macros",
];

const INIT_MESSAGES = [
  {
    id: 1, from: "ai",
    text: "Good evening. You've consumed 1,420 kcal today. You are 57g short on target protein. How can I assist you in optimizing your remaining schedule?",
    timestamp: new Date(Date.now() - 60000),
    suggestions: ["Optimize protein target", "Log dinner automatically"],
  },
];

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition:{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

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
        id: Date.now() + 1, from: "ai", text: `Processing context: "${text}".\n\nI recommend prioritizing whole food sources like wild-caught salmon or lean poultry to align with your physiological protocol.`, timestamp: new Date(),
        suggestions: ["Show me a recipe"],
      };
      setTyping(false);
      setMessages(m => [...m, aiMsg]);
    }, 1800); // Slower, "thinking" response time typical for premium AIs
  };

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ margin:"6px 0", lineHeight:1.6 }} />;
    });
  };

  return (
    <motion.main className="page-content flex-col" style={{ height: "100vh", paddingBottom: 0, paddingTop: 0 }} initial="hidden" animate="visible" variants={STAGGER}>
      <motion.div variants={FADE_UP} className="card flex-col" style={{ flex: 1, margin: "var(--sp-8) 0", overflow: "hidden", background: "var(--surface-solid)" }}>
        
        {/* Header */}
        <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--border-dark)" }}>
          <h1 className="t-h2 text-text">NutriAI Concierge</h1>
          <p className="t-body mt-2">Intelligent dietary planning assistant.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3" style={{ padding: "24px 40px", flexWrap: "wrap", borderBottom: "1px solid var(--border-dark)", background: "var(--bg)" }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a} className="badge" onClick={() => sendMessage(a)} style={{ cursor: "pointer", border: "none", transition: "all 0.4s var(--ease-spring)" }}>
              {a}
            </button>
          ))}
        </div>

        {/* Chat Thread */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px", display: "flex", flexDirection: "column", gap: "var(--sp-8)" }}>
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                style={{ display:"flex", flexDirection:"column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap:8 }}>
                
                <div style={{
                  padding: "16px 24px",
                  borderRadius: "var(--r-md)",
                  maxWidth: "75%", lineHeight: 1.6, fontSize: ".9375rem",
                  background: msg.from === "ai" ? "var(--bg)" : "var(--text)",
                  color: msg.from === "ai" ? "var(--text)" : "#FFF",
                  border: msg.from === "ai" ? "1px solid var(--border-dark)" : "none",
                  borderBottomLeftRadius: msg.from === "ai" ? 4 : "var(--r-md)",
                  borderBottomRightRadius: msg.from === "user" ? 4 : "var(--r-md)",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  {msg.from === "ai" ? formatText(msg.text) : msg.text}
                </div>

                {msg.suggestions && (
                  <div className="flex gap-2 mt-3" style={{ flexWrap:"wrap" }}>
                    {msg.suggestions.map(s => (
                      <button key={s} className="badge" style={{ cursor: "pointer", border: "1px solid var(--border-dark)", background: "transparent", color: "var(--text-secondary)" }} onClick={() => sendMessage(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {typing && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                <div style={{ padding:"16px 24px", background: "var(--bg)", border: "1px solid var(--border-dark)", borderRadius: "var(--r-md)", borderBottomLeftRadius: 4 }}>
                  <span className="text-secondary t-sm" style={{ letterSpacing: "0.04em" }}>Synthesizing response...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input Terminal */}
        <div style={{ padding: "32px 40px", borderTop: "1px solid var(--border-dark)" }}>
          <form className="flex items-center gap-6" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <div className="search-bar" style={{ flex: 1, height: 64, borderRadius: "var(--r-pill)", background: "var(--bg)", padding: "0 var(--sp-6)" }}>
              <input placeholder="Ask the concierge..." value={input} onChange={e => setInput(e.target.value)} style={{ fontSize: "1rem" }} />
            </div>
            <button type="submit" className="btn-icon" disabled={!input.trim() || typing} style={{ width: 64, height: 64, padding: 0, background: "var(--text)", color: "#FFF" }}>
              <CornerDownLeft size={20} />
            </button>
          </form>
        </div>

      </motion.div>
    </motion.main>
  );
}
