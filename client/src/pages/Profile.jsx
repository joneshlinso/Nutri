import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User, Target, Utensils, Bell, Moon, Sun,
  ChevronRight, Save, LogOut
} from "lucide-react";

const GOALS = ["Lose Weight","Gain Muscle","Maintain Weight","Eat Healthier"];
const DIETS = ["No Preference","Vegetarian","Vegan","Keto","Paleo","Gluten-Free"];
const ACTIVITY = ["Sedentary","Lightly Active","Moderately Active","Very Active","Extremely Active"];

export default function Profile() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({ meals:true, water:true, weekly:false });
  const [form, setForm] = useState({
    name:     user?.name    || "Alex Chen",
    email:    user?.email   || "alex@example.com",
    age:      "28",
    weight:   "75",
    height:   "175",
    goal:     "Lose Weight",
    activity: "Moderately Active",
    diet:     "No Preference",
    calories: "1850",
    protein:  "145",
    carbs:    "185",
    fat:      "58",
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);

  const SECTIONS = [
    { id:"profile",  icon:User,     label:"Profile Info"   },
    { id:"goals",    icon:Target,   label:"Goals & Macros" },
    { id:"diet",     icon:Utensils, label:"Dietary Prefs"  },
    { id:"notifs",   icon:Bell,     label:"Notifications"  },
  ];

  return (
    <main className="page-content" style={{ background:"var(--bg)", minHeight:"100vh" }}>
      <h1 className="t-h1 mb-6">Profile & Settings</h1>

      <div className="grid-2" style={{ gap:"var(--sp-6)", alignItems:"start" }}>
        {/* ─── Left: Avatar + nav ─── */}
        <div>
          {/* Avatar card */}
          <div className="card p-6 text-center mb-4 fade-up">
            <div className="avatar" style={{ width:80,height:80,fontSize:30,margin:"0 auto var(--sp-4)" }}>{initials}</div>
            <h2 className="t-h3">{form.name}</h2>
            <p className="t-sm text-muted mb-4">{form.email}</p>
            <div className="flex" style={{ gap:8, justifyContent:"center", flexWrap:"wrap" }}>
              <span className="badge badge-green">🎯 {form.goal}</span>
              <span className="badge badge-blue">🔥 5 day streak</span>
            </div>
          </div>

          {/* Section nav */}
          <div className="card fade-up" style={{ overflow:"hidden" }}>
            {SECTIONS.map(({ id, icon:Icon, label }) => (
              <button key={id}
                onClick={() => setSection(id)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                  background: section===id ? "var(--primary-glow)" : "none",
                  border:"none", borderBottom:"1px solid var(--border)", cursor:"pointer",
                  color: section===id ? "var(--primary)" : "var(--text-secondary)",
                  fontWeight: section===id ? 600 : 500, fontSize:".9375rem",
                  transition:"all .2s"
                }}
              >
                <Icon size={18} />
                {label}
                <ChevronRight size={14} style={{ marginLeft:"auto", opacity:.5 }} />
              </button>
            ))}

            {/* Theme toggle */}
            <div style={{ padding:"13px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid var(--border)" }}>
              {darkMode ? <Moon size={18} style={{ color:"var(--text-secondary)" }} /> : <Sun size={18} style={{ color:"var(--text-secondary)" }} />}
              <span className="t-sm-med" style={{ flex:1, color:"var(--text-secondary)" }}>Dark Mode</span>
              <button
                onClick={() => setDarkMode(d => !d)}
                style={{
                  width:44, height:24, borderRadius:12, border:"none", cursor:"pointer", padding:2,
                  background: darkMode ? "var(--primary)" : "var(--surface-3)",
                  transition:"background .2s", position:"relative"
                }}
              >
                <div style={{
                  width:20, height:20, borderRadius:"50%", background:"#fff",
                  position:"absolute", top:2, left: darkMode ? 22 : 2,
                  transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)"
                }} />
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                border:"none", background:"none", cursor:"pointer", color:"var(--error)", fontWeight:500, fontSize:".9375rem" }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* ─── Right: Settings panel ─── */}
        <div className="card p-6 fade-up">
          {section === "profile" && (
            <>
              <h2 className="t-h3 mb-6">Personal Info</h2>
              <div className="flex-col gap-4" style={{ display:"flex" }}>
                <div className="grid-2" style={{ gap:16 }}>
                  <div className="input-wrap">
                    <label className="input-label">Full Name</label>
                    <input className="input" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Email</label>
                    <input className="input" type="email" value={form.email} onChange={set("email")} />
                  </div>
                </div>
                <div className="grid-3" style={{ gap:16 }}>
                  {["age","weight","height"].map(k => (
                    <div key={k} className="input-wrap">
                      <label className="input-label">{k.charAt(0).toUpperCase()+k.slice(1)}{k==="weight"?" (kg)":k==="height"?" (cm)":""}</label>
                      <input className="input" type="number" value={form[k]} onChange={set(k)} />
                    </div>
                  ))}
                </div>
                <div className="input-wrap">
                  <label className="input-label">Activity Level</label>
                  <select className="input" value={form.activity} onChange={set("activity")}>
                    {ACTIVITY.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {section === "goals" && (
            <>
              <h2 className="t-h3 mb-6">Goals & Macro Targets</h2>
              <div className="input-wrap mb-4">
                <label className="input-label">Health Goal</label>
                <div className="flex gap-2" style={{ flexWrap:"wrap", marginTop:4 }}>
                  {GOALS.map(g => (
                    <button key={g} className={`chip ${form.goal===g?"active":""}`} onClick={() => setForm(f => ({...f,goal:g}))}>{g}</button>
                  ))}
                </div>
              </div>
              <div className="grid-2 mb-4" style={{ gap:16 }}>
                <div className="input-wrap">
                  <label className="input-label">Daily Calories (kcal)</label>
                  <input className="input" type="number" value={form.calories} onChange={set("calories")} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Protein (g)</label>
                  <input className="input" type="number" value={form.protein} onChange={set("protein")} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Carbohydrates (g)</label>
                  <input className="input" type="number" value={form.carbs} onChange={set("carbs")} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Fat (g)</label>
                  <input className="input" type="number" value={form.fat} onChange={set("fat")} />
                </div>
              </div>
              {/* Macro distribution preview */}
              <div className="card-gradient p-4" style={{ borderRadius:"var(--r-md)" }}>
                <p className="t-xs text-muted mb-3">Macro Distribution</p>
                {[
                  { label:"Protein", g:form.protein, color:"var(--protein)", kcal:form.protein*4 },
                  { label:"Carbs",   g:form.carbs,   color:"var(--carbs)",   kcal:form.carbs*4 },
                  { label:"Fat",     g:form.fat,      color:"var(--fat)",     kcal:form.fat*9 },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-3 mb-2">
                    <span style={{ width:60, fontSize:".8125rem", fontWeight:500, color:m.color }}>{m.label}</span>
                    <div style={{ flex:1, height:7, background:"var(--surface-3)", borderRadius:"var(--r-pill)", overflow:"hidden" }}>
                      <div style={{ height:"100%", background:m.color, borderRadius:"var(--r-pill)", width:`${Math.min((m.kcal/form.calories)*100,100)}%` }} />
                    </div>
                    <span style={{ fontSize:".75rem", color:"var(--text-muted)", width:48, textAlign:"right" }}>{m.g}g</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === "diet" && (
            <>
              <h2 className="t-h3 mb-6">Dietary Preferences</h2>
              <div className="flex gap-2" style={{ flexWrap:"wrap" }}>
                {DIETS.map(d => (
                  <button key={d} className={`chip ${form.diet===d?"active":""}`}
                    onClick={() => setForm(f => ({...f,diet:d}))}>{d}</button>
                ))}
              </div>
              <div className="card-gradient p-4 mt-6" style={{ borderRadius:"var(--r-md)" }}>
                <p className="t-sm-med mb-1">Current: {form.diet}</p>
                <p className="t-xs text-muted">Your AI coach and meal suggestions will be tailored to this preference.</p>
              </div>
            </>
          )}

          {section === "notifs" && (
            <>
              <h2 className="t-h3 mb-6">Notification Settings</h2>
              <div className="flex-col" style={{ display:"flex", gap:1 }}>
                {[
                  { key:"meals",  label:"Meal Reminders",   desc:"Get reminded to log breakfast, lunch and dinner" },
                  { key:"water",  label:"Water Reminders",   desc:"Hourly nudges to hit your daily hydration goal" },
                  { key:"weekly", label:"Weekly Report",     desc:"Summary of your progress every Sunday" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4" style={{ borderBottom:"1px solid var(--border)" }}>
                    <div>
                      <div className="t-sm-med">{label}</div>
                      <div className="t-xs text-muted">{desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({...n,[key]:!n[key]}))}
                      style={{
                        width:44, height:24, borderRadius:12, border:"none", cursor:"pointer", padding:2, flexShrink:0,
                        background: notifications[key] ? "var(--primary)" : "var(--surface-3)",
                        transition:"background .2s", position:"relative"
                      }}
                    >
                      <div style={{
                        width:20, height:20, borderRadius:"50%", background:"#fff",
                        position:"absolute", top:2, left: notifications[key] ? 22 : 2,
                        transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)"
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Save button */}
          <div style={{ marginTop:"var(--sp-6)", paddingTop:"var(--sp-4)", borderTop:"1px solid var(--border)" }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ minWidth:140 }}>
              {saved ? "✓ Saved!" : <><Save size={15} style={{ marginRight:6 }} />Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
