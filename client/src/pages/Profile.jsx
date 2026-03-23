import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Target, Utensils, Bell, ChevronRight, Save, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import TiltCard from "../components/TiltCard";

const GOALS = ["Decrease Mass","Increase Muscle","Maintain Density","Optimize Health"];

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } };

export default function Profile() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:     user?.name    || "Alex Chen",
    email:    user?.email   || "alex@example.com",
    goal:     "Decrease Mass",
    calories: "1850",
    protein:  "145", carbs: "185", fat: "58",
  });
  
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  const SECTIONS = [
    { id:"profile",  icon:User,     label:"Core Identity"   },
    { id:"goals",    icon:Target,   label:"Targets & Limits" },
    { id:"diet",     icon:Utensils, label:"Fuel Preferences"  },
    { id:"notifs",   icon:Bell,     label:"System Alerts"  },
  ];

  return (
    <motion.main initial="hidden" animate="visible" variants={STAGGER}>
      <motion.header variants={FADE_UP} className="mb-10 pt-4">
         <h1 className="t-display tracking-tighter text-text">System <span className="grad-text">Preferences</span></h1>
      </motion.header>

      <div className="bento-grid" style={{ alignItems: "start" }}>
        
        {/* ─── Left Sidebar Nav ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 4" }} className="flex-col gap-6">
          <TiltCard className="p-8 text-center" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div style={{ width:96,height:96,fontSize:32,margin:"0 auto var(--sp-6)",background:"var(--text)",color:"#000",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"var(--r-lg)",boxShadow:"0 12px 40px rgba(255,255,255,0.15)" }}>
              {initials}
            </div>
            <h2 className="t-h2 text-text">{form.name}</h2>
            <p className="t-sm text-secondary mb-6">{form.email}</p>
            <div className="flex gap-2 justify-center">
              <span className="badge badge-green">🎯 {form.goal}</span>
            </div>
          </TiltCard>

          <TiltCard className="p-2" style={{ background: "rgba(0,0,0,0.4)" }}>
            {SECTIONS.map(({ id, icon:Icon, label }) => (
              <button key={id} onClick={() => setSection(id)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:16, padding:"16px 20px",
                  background: section===id ? "var(--glass-2)" : "transparent",
                  borderRadius: "var(--r-md)", border:"none",
                  color: section===id ? "var(--text)" : "var(--text-secondary)",
                  transition:"all .3s var(--ease-expo)"
                }}>
                <Icon size={20} style={{ color: section===id ? "var(--primary)" : "inherit" }} />
                <span className="t-body-med">{label}</span>
                {section===id && <ChevronRight size={18} style={{ marginLeft:"auto", color:"var(--primary)" }} />}
              </button>
            ))}
          </TiltCard>

          <button onClick={logout} className="btn btn-ghost" style={{ width: "100%", padding: "20px", display: "flex", alignItems: "center", justifyCenter: "center", gap: 12, color: "var(--fat)", background: "rgba(255, 23, 68, 0.05)", border: "1px solid rgba(255, 23, 68, 0.2)", borderRadius: "var(--r-lg)" }}>
            <LogOut size={20} /> Terminate Session
          </button>
        </motion.div>

        {/* ─── Right Content ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 8" }}>
          <TiltCard className="p-10 min-h-[600px]" style={{ background: "rgba(0,0,0,0.6)" }}>
            
            {section === "profile" && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{type:"spring", damping:24}}>
                <h2 className="t-h2 mb-8 text-text">Identity Parameters</h2>
                <div className="grid-2 mb-8">
                  <div className="input-wrap">
                    <label className="input-label">Identity Designation</label>
                    <input className="input" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Transmit Address</label>
                    <input className="input" type="email" value={form.email} onChange={set("email")} />
                  </div>
                </div>
              </motion.div>
            )}

            {section === "goals" && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{type:"spring", damping:24}}>
                <h2 className="t-h2 mb-8 text-text">Targets & Limits</h2>
                <div className="input-wrap mb-8">
                  <label className="input-label mb-3">Primary Objective</label>
                  <div className="flex gap-3" style={{ flexWrap:"wrap" }}>
                    {GOALS.map(g => (
                      <button key={g} className={`chip ${form.goal===g?"active":""}`} style={{ padding: "12px 24px" }} onClick={() => setForm(f => ({...f,goal:g}))}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="grid-2" style={{ gap:"var(--sp-8)" }}>
                  <div className="input-wrap">
                    <label className="input-label">Caloric Limit</label>
                    <input className="input t-h3" type="number" value={form.calories} onChange={set("calories")} style={{ fontFamily: "monospace" }} />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label" style={{ color: "var(--protein)" }}>Protein Target (g)</label>
                    <input className="input t-h3" type="number" value={form.protein} onChange={set("protein")} style={{ fontFamily: "monospace", color: "var(--protein)", borderColor: "rgba(41,121,255,0.3)" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sticky Save Button */}
            <div style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid var(--glass-border)" }}>
              <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ minWidth: 200, padding: "20px" }}>
                {saved ? "✓ Configuration Synced" : <><Save size={18}/> Commit Changes</>}
              </button>
            </div>

          </TiltCard>
        </motion.div>
      </div>
    </motion.main>
  );
}
