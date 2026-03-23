import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Target, Utensils, Bell, Moon, Sun, ChevronRight, Save, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const GOALS = ["Lose Weight","Gain Muscle","Maintain Weight","Eat Healthier"];
const DIETS = ["No Preference","Vegetarian","Vegan","Keto","Paleo","Gluten-Free"];
const ACTIVITY = ["Sedentary","Lightly Active","Moderately Active","Very Active"];

const STAGGER = { visible: { transition: { staggerChildren: 0.05 } } };
const FADE_UP = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function Profile() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState({
    name:     user?.name    || "Alex Chen",
    email:    user?.email   || "alex@example.com",
    goal:     "Lose Weight",
    calories: "1850",
    protein:  "145", carbs: "185", fat: "58",
  });
  
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  const SECTIONS = [
    { id:"profile",  icon:User,     label:"Profile Info"   },
    { id:"goals",    icon:Target,   label:"Goals & Macros" },
    { id:"diet",     icon:Utensils, label:"Dietary Prefs"  },
    { id:"notifs",   icon:Bell,     label:"Notifications"  },
  ];

  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      <motion.h1 variants={FADE_UP} className="t-h1 mb-8">Settings</motion.h1>

      <div className="bento-grid" style={{ alignItems: "start" }}>
        
        {/* ─── Left Sidebar ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 4" }} className="flex-col gap-6">
          <div className="card p-6 text-center">
            <div style={{ width:80,height:80,fontSize:28,margin:"0 auto var(--sp-4)",background:"linear-gradient(135deg,#34D399,#047857)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"var(--r-md)",boxShadow:"var(--shadow-glow)" }}>
              {initials}
            </div>
            <h2 className="t-h3">{form.name}</h2>
            <p className="t-sm text-muted mb-4">{form.email}</p>
            <div className="flex gap-2 justify-center">
              <span className="badge badge-green">🎯 {form.goal}</span>
            </div>
          </div>

          <div className="card" style={{ padding: "8px" }}>
            {SECTIONS.map(({ id, icon:Icon, label }) => (
              <button key={id} onClick={() => setSection(id)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                  background: section===id ? "var(--surface-active)" : "none",
                  borderRadius: "var(--r-sm)", border:"none", cursor:"pointer",
                  color: section===id ? "var(--text)" : "var(--text-secondary)",
                  fontWeight: section===id ? 600 : 500, fontSize:".9375rem",
                  transition:"all .2s"
                }}>
                <Icon size={18} style={{ color: section===id ? "var(--primary)" : "inherit" }} />
                {label}
                {section===id && <ChevronRight size={16} style={{ marginLeft:"auto", opacity:.5 }} />}
              </button>
            ))}
          </div>

          <button onClick={logout} className="card btn-ghost" style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--error)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <LogOut size={18} /> Sign Out
          </button>
        </motion.div>

        {/* ─── Right Content ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 8" }}>
          <div className="card p-8 min-h-[500px]">
            
            {section === "profile" && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                <h2 className="t-h2 mb-6">Personal Information</h2>
                <div className="grid-2 mb-6">
                  <div className="input-wrap">
                    <label className="input-label">Full Name</label>
                    <input className="input" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Email Address</label>
                    <input className="input" type="email" value={form.email} onChange={set("email")} />
                  </div>
                </div>
              </motion.div>
            )}

            {section === "goals" && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                <h2 className="t-h2 mb-6">Goals & Macros</h2>
                <div className="input-wrap mb-6">
                  <label className="input-label mb-2">Primary Goal</label>
                  <div className="flex gap-2" style={{ flexWrap:"wrap" }}>
                    {GOALS.map(g => (
                      <button key={g} className={`chip ${form.goal===g?"active":""}`} onClick={() => setForm(f => ({...f,goal:g}))}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="grid-2" style={{ gap:"var(--sp-6)" }}>
                  <div className="input-wrap">
                    <label className="input-label">Daily Calories</label>
                    <input className="input" type="number" value={form.calories} onChange={set("calories")} />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Protein (g)</label>
                    <input className="input" type="number" value={form.protein} onChange={set("protein")} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save Button Sticky Bottom */}
            <div style={{ marginTop: 40, paddingTop: 30, borderTop: "1px dashed var(--border)" }}>
              <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: 160 }}>
                {saved ? "✓ Saved" : <><Save size={16}/> Save Changes</>}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
