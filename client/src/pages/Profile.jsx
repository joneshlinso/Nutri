import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Target, Utensils, Bell, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GOALS = ["Lose Weight","Gain Muscle","Maintenance","Better Health"];

export default function Profile() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:     user?.name  || "Alexandra Chen",
    email:    user?.email || "alexandra@nutrire.test",
    goal:"Lose Weight", calories:"1850", protein:"145",
  });
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)||"A";

  const SECTIONS = [
    { id:"profile", icon:User,     label:"Profile" },
    { id:"goals",   icon:Target,   label:"Goals" },
    { id:"diet",    icon:Utensils, label:"Diet Prefs" },
    { id:"notifs",  icon:Bell,     label:"Notifications" },
  ];

  return (
    <main className="page-content">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 300, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>Profile</h1>
        <p style={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--ink-60)", textTransform: "uppercase", marginTop: 8 }}>Manage your account and nutrition goals.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 24, alignItems: "start" }}>
        
        {/* Left Nav */}
        <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#FFFFFF", padding: 32, textAlign: "center", border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07)" }}>
            <div style={{ width:80,height:80,borderRadius:2,background:"var(--cream-dark)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:600,color:"var(--ink)",margin:"0 auto 20px" }}>
              {initials}
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>{form.name}</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-60)", marginTop: 4, marginBottom: 16 }}>{form.email}</p>
            <span style={{ display: "inline-block", background: "var(--cream-dark)", color: "var(--ink)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 2 }}>🎯 {form.goal}</span>
          </div>

          <div style={{ background: "#FFFFFF", padding: 12, border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07)" }}>
            {SECTIONS.map(({id,icon:Icon,label}) => (
              <button key={id} onClick={()=>setSection(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: section === id ? "var(--cream-dark)" : "transparent", color: section === id ? "var(--ink)" : "var(--ink-60)", border: "none", borderLeft: section === id ? "2px solid var(--gold)" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>
                <Icon size={18}/>
                <span style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>

          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 18, background: "#FFFFFF", border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07)", color: "#c04040", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
            <LogOut size={16}/> Sign Out
          </button>
        </div>

        {/* Right Content */}
        <div style={{ gridColumn: "span 8" }}>
          <div style={{ background: "#FFFFFF", padding: 40, border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, minHeight: 480, boxShadow: "0 2px 40px rgba(26,22,18,.07)" }}>
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.4, ease:[0.34,1.56,0.64,1]}}>
                
                {section === "profile" && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Account Details</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>Full Name</label>
                        <input style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} value={form.name} onChange={set("name")}/>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>Email</label>
                        <input type="email" style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} value={form.email} onChange={set("email")}/>
                      </div>
                    </div>
                  </div>
                )}

                {section === "goals" && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Nutrition Goals</h2>
                    <div style={{ marginBottom: 32 }}>
                      <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600, display: "block", marginBottom: 16 }}>Primary Goal</label>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {GOALS.map(g => (
                          <button key={g} style={{ padding: "12px 20px", background: form.goal === g ? "var(--ink)" : "#FFFFFF", color: form.goal === g ? "var(--cream)" : "var(--ink)", border: form.goal === g ? "none" : "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.8rem", letterSpacing: "0.05em", fontFamily: "'Montserrat', sans-serif", cursor: "pointer", transition: "all 0.2s" }} onClick={()=>setForm(f=>({...f,goal:g}))}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>Daily Calories</label>
                        <input type="number" style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", outline: "none", height: 60 }} value={form.calories} onChange={set("calories")}/>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>Protein Target (g)</label>
                        <input type="number" style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", outline: "none", height: 60 }} value={form.protein} onChange={set("protein")}/>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--ink-10)" }}>
              <button className="cta-btn" onClick={save} style={{ minWidth: 200, padding: "16px 32px", fontSize: "0.8rem" }}>
                {saved ? "✅ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
