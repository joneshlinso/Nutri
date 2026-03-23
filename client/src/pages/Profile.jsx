import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Target, Utensils, Bell, LogOut } from "lucide-react";

const GOALS = ["Lose Weight","Gain Muscle","Maintain Weight","Improve Health"];

export default function Profile() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
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
    { id:"profile",  icon:User,     label:"Profile Details"   },
    { id:"goals",    icon:Target,   label:"Goals & Limits" },
    { id:"diet",     icon:Utensils, label:"Dietary Preferences"  },
    { id:"notifs",   icon:Bell,     label:"Notifications"  },
  ];

  return (
    <main className="page-content fade-in">
      <header className="mb-12">
         <h1 className="t-h1 mb-1">Settings</h1>
         <p className="t-body">Manage your account and preferences</p>
      </header>

      <div className="bento-grid" style={{ alignItems: "start" }}>
        
        {/* ─── Left Sidebar Nav ─── */}
        <div style={{ gridColumn: "span 4" }} className="flex-col gap-6">
          <div className="card p-8 text-center bg-bg">
            <div style={{ width:80,height:80,fontSize:24,margin:"0 auto var(--sp-6)",background:"var(--surface)",color:"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"var(--r-md)", border:"1px solid var(--border)" }}>
              {initials}
            </div>
            <h2 className="t-h3 text-text">{form.name}</h2>
            <p className="t-sm mb-4">{form.email}</p>
            <div className="flex gap-2 justify-center">
              <span className="badge">🎯 {form.goal}</span>
            </div>
          </div>

          <div className="card p-2 bg-bg">
            {SECTIONS.map(({ id, icon:Icon, label }) => (
              <button key={id} onClick={() => setSection(id)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                  background: section===id ? "var(--surface)" : "transparent",
                  borderRadius: "var(--r-sm)", border:"none", cursor: "pointer",
                  color: section===id ? "var(--text)" : "var(--text-secondary)",
                  transition:"var(--transit)"
                }}>
                <Icon size={16} />
                <span className="t-sm-med">{label}</span>
              </button>
            ))}
          </div>

          <button onClick={logout} className="btn btn-ghost w-full" style={{ padding: "16px", color: "var(--fat)", border: "1px solid var(--border)" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* ─── Right Content ─── */}
        <div style={{ gridColumn: "span 8" }}>
          <div className="card p-10 min-h-[500px]" style={{ background: "var(--bg)" }}>
            
            {section === "profile" && (
              <div>
                <h2 className="t-h2 mb-8 text-text">Profile Details</h2>
                <div className="grid-2 mb-8">
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
                <h2 className="t-h2 mb-8 text-text">Goals & Limits</h2>
                <div className="input-wrap mb-8">
                  <label className="input-label mb-3">Primary Goal</label>
                  <div className="flex gap-3" style={{ flexWrap:"wrap" }}>
                    {GOALS.map(g => (
                      <button key={g} className={`chip ${form.goal===g?"active":""}`} onClick={() => setForm(f => ({...f,goal:g}))}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="grid-2" style={{ gap:"var(--sp-6)" }}>
                  <div className="input-wrap">
                    <label className="input-label">Daily Calories</label>
                    <input className="input t-h3" type="number" value={form.calories} onChange={set("calories")} />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Protein Target (g)</label>
                    <input className="input t-h3" type="number" value={form.protein} onChange={set("protein")} />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
              <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ minWidth: 160 }}>
                {saved ? "Saved" : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
