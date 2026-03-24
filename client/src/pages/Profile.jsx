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
    name:     user?.name  || "Alex Chen",
    email:    user?.email || "alex@example.com",
    goal:"Lose Weight", calories:"1850", protein:"145",
  });
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)||"U";

  const SECTIONS = [
    { id:"profile", icon:User,     label:"Profile" },
    { id:"goals",   icon:Target,   label:"Goals" },
    { id:"diet",    icon:Utensils, label:"Diet Prefs" },
    { id:"notifs",  icon:Bell,     label:"Notifications" },
  ];

  return (
    <main className="page-content">
      <div className="mb-6 fade-up">
        <h1 className="t-h1">Profile</h1>
        <p className="t-body mt-1">Manage your account and nutrition goals.</p>
      </div>

      <div className="bento-grid" style={{ alignItems:"start" }}>
        
        {/* Left Nav */}
        <div style={{ gridColumn:"span 4" }} className="flex-col gap-5 fade-up fade-up-1">
          <div className="card p-8 text-center">
            <div style={{ width:80,height:80,borderRadius:"50%",background:"var(--primary-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:700,color:"var(--accent-cta)",margin:"0 auto var(--sp-5)" }}>
              {initials}
            </div>
            <h2 className="t-h3">{form.name}</h2>
            <p className="t-sm mt-1 mb-4">{form.email}</p>
            <span className="badge">🎯 {form.goal}</span>
          </div>

          <div className="card p-3">
            {SECTIONS.map(({id,icon:Icon,label}) => (
              <button key={id} onClick={()=>setSection(id)} className={`nav-item ${section===id?"active":""}`}>
                <Icon size={18}/><span>{label}</span>
              </button>
            ))}
          </div>

          <button onClick={logout} className="btn btn-soft btn-w-full" style={{ padding:"16px", color:"#c04040", justifyContent:"center", gap:8 }}>
            <LogOut size={18}/> Sign Out
          </button>
        </div>

        {/* Right Content */}
        <div style={{ gridColumn:"span 8" }} className="fade-up fade-up-2">
          <div className="card p-8" style={{ minHeight:480 }}>
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.4, ease:[0.34,1.56,0.64,1]}}>
                
                {section === "profile" && (
                  <div>
                    <h2 className="t-h3 mb-6">Account Details</h2>
                    <div className="grid-2 mb-6">
                      <div className="input-wrap">
                        <label className="input-label">Full Name</label>
                        <input className="input" value={form.name} onChange={set("name")}/>
                      </div>
                      <div className="input-wrap">
                        <label className="input-label">Email</label>
                        <input className="input" type="email" value={form.email} onChange={set("email")}/>
                      </div>
                    </div>
                  </div>
                )}

                {section === "goals" && (
                  <div>
                    <h2 className="t-h3 mb-6">Nutrition Goals</h2>
                    <div className="mb-8">
                      <label className="input-label mb-4 block">Primary Goal</label>
                      <div className="flex gap-3" style={{ flexWrap:"wrap" }}>
                        {GOALS.map(g => (
                          <button key={g} className={`chip ${form.goal===g?"active":""}`} style={{ padding:"10px 18px" }} onClick={()=>setForm(f=>({...f,goal:g}))}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="input-wrap">
                        <label className="input-label">Daily Calories</label>
                        <input className="input" type="number" value={form.calories} onChange={set("calories")} style={{ fontSize:"1.25rem", fontWeight:600, height:60 }}/>
                      </div>
                      <div className="input-wrap">
                        <label className="input-label">Protein Target (g)</label>
                        <input className="input" type="number" value={form.protein} onChange={set("protein")} style={{ fontSize:"1.25rem", fontWeight:600, height:60 }}/>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            <div style={{ marginTop:40, paddingTop:24, borderTop:"1px solid var(--bg-alt)" }}>
              <button className="btn btn-cta btn-lg" onClick={save} style={{ minWidth:180 }}>
                {saved ? "✅ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
