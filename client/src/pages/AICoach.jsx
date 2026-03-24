import { useState, useRef, useEffect } from "react";
import { CornerDownLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = ["Analyze today's meal","Suggest a healthy snack","My protein intake"];
const INIT_MSGS = [{
  id:1, from:"ai",
  text:"Hi! 👋 I'm your NutriAI coach. You've eaten 1,420 kcal today — 77% of your goal. You're 57g short on protein. Want me to suggest a meal?",
  suggestions:["Fix protein gap","Suggest dinner"],
}];

export default function AICoach() {
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { id:Date.now(), from:"user", text, timestamp:new Date() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, {
        id:Date.now()+1, from:"ai",
        text:`Great question! Based on your data for "${text}", I recommend prioritising whole foods like Greek yogurt, eggs, or a lean protein shake for your next meal. 🥗`,
        suggestions:["Log this now"],
      }]);
      setTyping(false);
    }, 1600);
  };

  return (
    <main className="page-content" style={{ height:"100vh", paddingBottom:0, paddingTop:0, display: "flex", flexDirection: "column" }}>
      <div style={{ flex:1, margin:"32px 0", display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ padding:"28px", borderBottom:"1px solid var(--ink-10)", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width:48, height:48, borderRadius: 2, background:"var(--cream-dark)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Sparkles size={22} style={{ color:"var(--ink)" }}/>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>NutriAI Coach</h2>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", marginTop: 4 }}>Your personal health assistant</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding:"16px 28px", display: "flex", gap: 12, flexWrap: "wrap", background: "var(--cream-dark)", borderBottom: "1px solid var(--ink-10)" }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a} style={{ background: "#FFFFFF", border: "1px solid rgba(184,146,74,.2)", padding: "8px 16px", borderRadius: 2, fontSize: "0.75rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", cursor: "pointer", boxShadow: "0 2px 8px rgba(26,22,18,.04)" }} onClick={()=>send(a)}>{a}</button>
          ))}
        </div>

        {/* Chat */}
        <div style={{ flex:1, overflowY:"auto", padding:"32px 28px", display:"flex", flexDirection:"column", gap:24, background:"var(--cream)" }}>
          <AnimatePresence>
            {msgs.map(msg => (
              <motion.div key={msg.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                transition={{duration:0.4, ease:[0.34,1.56,0.64,1]}}
                style={{ display:"flex", flexDirection:"column", alignItems: msg.from==="user"?"flex-end":"flex-start", gap:8 }}>
                <div style={{ 
                  padding: "16px 20px", borderRadius: 2, maxWidth: "80%", lineHeight: 1.6, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif",
                  background: msg.from==="user" ? "var(--ink)" : "#FFFFFF", 
                  color: msg.from==="user" ? "var(--cream)" : "var(--ink)",
                  border: msg.from==="ai" ? "1px solid rgba(184,146,74,.3)" : "none",
                  boxShadow: msg.from==="ai" ? "0 4px 16px rgba(26,22,18,.05)" : "none"
                }}>
                  {msg.text}
                </div>
                {msg.suggestions && (
                  <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    {msg.suggestions.map(s => (
                      <button key={s} style={{ background: "transparent", border: "1px solid var(--ink-30)", color: "var(--ink)", padding: "6px 14px", borderRadius: 2, fontSize: "0.7rem", fontFamily: "'Montserrat', sans-serif", cursor: "pointer" }} onClick={()=>send(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
                <div style={{ padding: "16px 20px", borderRadius: 2, background: "#FFFFFF", border: "1px solid rgba(184,146,74,.3)", boxShadow: "0 4px 16px rgba(26,22,18,.05)" }}>
                  <span style={{ letterSpacing:4, color:"var(--ink-30)", fontSize:18 }}>•••</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{ padding:"24px 28px", background:"#FFFFFF", borderTop:"1px solid var(--ink-10)" }}>
          <form style={{ display: "flex", alignItems: "center", gap: 16 }} onSubmit={e=>{e.preventDefault();send(input);}}>
            <div style={{ flex: 1, background: "var(--cream-dark)", borderRadius: 2, padding: "0 20px", height: 52, display: "flex", alignItems: "center", border: "1px solid var(--ink-10)" }}>
              <input style={{ flex: 1, border: "none", background: "none", fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} placeholder="Ask your AI coach..." value={input} onChange={e=>setInput(e.target.value)}/>
            </div>
            <button type="submit" disabled={!input.trim()||typing} style={{ width: 52, height: 52, padding: 0, borderRadius: 2, flexShrink: 0, background: "var(--ink)", color: "var(--cream)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!input.trim()||typing) ? 0.5 : 1 }}>
              <CornerDownLeft size={20}/>
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
