import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Target, Utensils, Bell, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GOALS = ["Lean Out","Hypertrophy","Maintenance","Longevity"];

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition:{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

export default function Profile() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:     user?.name    || "Alex Chen",
    email:    user?.email   || "alex@example.com",
    goal:     "Lean Out",
    calories: "1850",
    protein:  "145", carbs: "185", fat: "58",
  });
  
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  const SECTIONS = [
    { id:"profile",  icon:User,     label:"Account Metrics"   },
    { id:"goals",    icon:Target,   label:"Physiological Goals" },
    { id:"diet",     icon:Utensils, label:"Dietary Protocol"  },
    { id:"notifs",   icon:Bell,     label:"Telemetrics"  },
  ];

  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      <motion.header variants={FADE_UP} className="mb-12">
         <h1 className="t-display tracking-tight text-text mb-2">Settings</h1>
         <p className="t-h3 text-secondary">Configure your core system parameters.</p>
      </motion.header>

      <div className="bento-grid" style={{ alignItems: "start" }}>
        
        {/* ─── Left Sidebar Nav ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 4" }} className="flex-col gap-8">
          <div className="card p-10 text-center card-hover">
            <div style={{ width:96,height:96,fontSize:28,margin:"0 auto var(--sp-6)",background:"var(--surface-solid)",color:"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%", border:"1px solid var(--border-dark)", boxShadow:"var(--shadow-md)" }}>
              {initials}
            </div>
            <h2 className="t-h2 text-text mb-1">{form.name}</h2>
            <p className="t-body mb-6">{form.email}</p>
            <div className="flex gap-2 justify-center">
              <span className="badge">Protocol: {form.goal}</span>
            </div>
          </div>

          <div className="card p-4 card-hover">
            {SECTIONS.map(({ id, icon:Icon, label }) => (
              <button key={id} onClick={() => setSection(id)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:16, padding:"16px 20px",
                  background: section===id ? "var(--surface-solid)" : "transparent",
                  boxShadow: section===id ? "var(--shadow-sm)" : "none",
                  borderRadius: "var(--r-md)", border:"none", cursor: "pointer",
                  color: section===id ? "var(--text)" : "var(--text-secondary)",
                  transition:"var(--transit)"
                }}>
                <Icon size={18} style={{ opacity: section===id ? 1 : 0.6 }} />
                <span className="t-body-med">{label}</span>
              </button>
            ))}
          </div>

          <button onClick={logout} className="btn btn-ghost w-full" style={{ padding: "20px", color: "var(--fat)", border: "1px solid var(--border-dark)", background: "rgba(255,255,255,0.4)" }}>
            <LogOut size={16} /> End Session
          </button>
        </motion.div>

        {/* ─── Right Content ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 8" }}>
          <div className="card p-12 min-h-[600px] card-hover" style={{ background: "var(--surface-solid)" }}>
            
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                
                {section === "profile" && (
                  <div>
                    <h2 className="t-xs mb-10">Account Metrics</h2>
                    <div className="grid-2 mb-10">
                      <div className="input-wrap">
                        <label className="input-label">Full Name</label>
                        <input className="input" value={form.name} onChange={set("name")} />
                      </div>
                      <div className="input-wrap">
                        <label className="input-label">Email Address</label>
                        <input className="input" type="email" value={form.email} onChange={set("email")} />
                      </div>
                    </div>
                  </div>
                )}

                {section === "goals" && (
                  <div>
                    <h2 className="t-xs mb-10">Physiological Goals</h2>
                    <div className="input-wrap mb-12">
                      <label className="input-label mb-4">Primary Protocol</label>
                      <div className="flex gap-4" style={{ flexWrap:"wrap" }}>
                        {GOALS.map(g => (
                          <button key={g} 
                            style={{ 
                              padding: "12px 24px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-dark)", 
                              background: form.goal===g ? "var(--text)" : "transparent",
                              color: form.goal===g ? "#FFF" : "var(--text-secondary)",
                              cursor: "pointer", transition: "var(--transit)", fontSize: ".9375rem", fontWeight: 500 
                            }} 
                            onClick={() => setForm(f => ({...f,goal:g}))}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid-2" style={{ gap:"var(--sp-8)" }}>
                      <div className="input-wrap">
                        <label className="input-label">Daily Basal (kcal)</label>
                        <input className="input t-h2" style={{ height: 64 }} type="number" value={form.calories} onChange={set("calories")} />
                      </div>
                      <div className="input-wrap">
                        <label className="input-label">Protein Target (g)</label>
                        <input className="input t-h2" style={{ height: 64 }} type="number" value={form.protein} onChange={set("protein")} />
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Save Button */}
            <div style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid var(--border-dark)" }}>
              <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ minWidth: 200, padding: "20px" }}>
                {saved ? "Synchronized" : "Apply Configuration"}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
