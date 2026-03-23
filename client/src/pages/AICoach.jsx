import { useState, useRef, useEffect } from "react";
import { Send, CornerDownLeft } from "lucide-react";

const QUICK_ACTIONS = [
  "Analyze today's intake",
  "Suggest a recipe",
  "Calculate dinner macros",
];

const INIT_MESSAGES = [
  {
    id: 1, from: "ai",
    text: "Good evening. You've consumed 1,420 kcal today (77% of target). You are 57g short on target protein. How can I assist you in optimizing your remaining meals?",
    timestamp: new Date(Date.now() - 60000),
    suggestions: ["Fix protein target", "Log dinner automatically"],
  },
];

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
        id: Date.now() + 1, from: "ai", text: `I am processing your request: "${text}".\n\nI recommend prioritizing whole food sources like lean plain chicken breast to align with your health protocol.`, timestamp: new Date(),
        suggestions: ["Show me a recipe"],
      };
      setTyping(false);
      setMessages(m => [...m, aiMsg]);
    }, 1500);
  };

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ margin:"4px 0", lineHeight:1.5 }} />;
    });
  };

  return (
    <main className="page-content flex-col" style={{ height: "100vh", paddingBottom: 0, paddingTop: 0 }}>
      <div className="card flex-col" style={{ flex: 1, margin: "var(--sp-6) 0", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
          <h1 className="t-h2 text-text">NutriAI</h1>
          <p className="t-sm mt-1">Intelligent dietary planning assistant</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2" style={{ padding: "16px 32px", flexWrap: "wrap", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a} className="chip text-xs" onClick={() => sendMessage(a)}>{a}</button>
          ))}
        </div>

        {/* Chat Thread */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display:"flex", flexDirection:"column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap:6 }}>
              
              <div className={`chat-bubble ${msg.from}`}>
                {msg.from === "ai" ? formatText(msg.text) : msg.text}
              </div>

              {msg.suggestions && (
                <div className="flex gap-2 mt-2" style={{ flexWrap:"wrap" }}>
                  {msg.suggestions.map(s => (
                    <button key={s} className="chip" style={{ fontSize: "0.75rem" }} onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-center gap-2">
              <div className="chat-bubble ai" style={{ padding:"12px 16px" }}>
                <span className="text-secondary">AI is typing...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Terminal */}
        <div style={{ padding: "24px 32px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          <form className="flex items-center gap-4" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <div className="search-bar" style={{ flex: 1, height: 48, borderRadius: "var(--r-sm)" }}>
              <input placeholder="Ask NutriAI anything..." value={input} onChange={e => setInput(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-secondary" disabled={!input.trim() || typing} style={{ width: 48, height: 48, padding: 0 }}>
              <CornerDownLeft size={18} />
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
