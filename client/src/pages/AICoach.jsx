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
    <main className="page-content flex-col" style={{ height:"100vh", paddingBottom:0, paddingTop:0 }}>
      <div className="card flex-col" style={{ flex:1, margin:"var(--sp-6) 0", overflow:"hidden" }}>
        
        {/* Header */}
        <div style={{ padding:"24px 28px", borderBottom:"1px solid var(--bg-alt)" }}>
          <div className="flex items-center gap-3">
            <div style={{ width:44, height:44, borderRadius:14, background:"var(--primary-light)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Sparkles size={22} style={{ color:"var(--accent-cta)" }}/>
            </div>
            <div>
              <h2 className="t-h3">NutriAI Coach</h2>
              <p className="t-sm">Your personal health assistant</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3" style={{ padding:"16px 28px", flexWrap:"wrap", background:"var(--bg)" }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a} className="chip" style={{ fontSize:".8rem" }} onClick={()=>send(a)}>{a}</button>
          ))}
        </div>

        {/* Chat */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px", display:"flex", flexDirection:"column", gap:"var(--sp-5)", background:"var(--bg)" }}>
          <AnimatePresence>
            {msgs.map(msg => (
              <motion.div key={msg.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                transition={{duration:0.4, ease:[0.34,1.56,0.64,1]}}
                style={{ display:"flex", flexDirection:"column", alignItems: msg.from==="user"?"flex-end":"flex-start", gap:8 }}>
                <div className={`chat-bubble ${msg.from}`}>{msg.text}</div>
                {msg.suggestions && (
                  <div className="flex gap-2 mt-1" style={{ flexWrap:"wrap" }}>
                    {msg.suggestions.map(s => (
                      <button key={s} className="chip" style={{ fontSize:".75rem" }} onClick={()=>send(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
                <div className="chat-bubble ai">
                  <span style={{ letterSpacing:4, color:"var(--text-muted)", fontSize:18 }}>•••</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{ padding:"20px 28px", background:"var(--surface)", borderTop:"1px solid var(--bg-alt)" }}>
          <form className="flex items-center gap-4" onSubmit={e=>{e.preventDefault();send(input);}}>
            <div className="search-bar" style={{ flex:1 }}>
              <input placeholder="Ask your AI coach..." value={input} onChange={e=>setInput(e.target.value)}/>
            </div>
            <button type="submit" className="btn btn-cta" disabled={!input.trim()||typing} style={{ width:52, height:52, padding:0, borderRadius:"50%", flexShrink:0 }}>
              <CornerDownLeft size={20}/>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
