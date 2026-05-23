import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Target, Utensils, Bell, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosInstance";

const GOALS = ["Lose Weight","Gain Muscle","Maintenance","Better Health"];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name:     user?.name  || "",
    email:    user?.email || "",
    goal: "Maintenance", calories: "2000", protein: "150", carbs: "250", fat: "70"
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get('/goals');
        if (res.data) {
          setForm(f => ({
            ...f,
            goal: res.data.goal || "Maintenance",
            calories: res.data.calories || "2000",
            protein: res.data.protein || "150",
            carbs: res.data.carbs || "250",
            fat: res.data.fat || "70"
          }));
        }
      } catch (err) {
        console.error("Failed to fetch goals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  
  const save = async () => { 
    try {
      if (user && user._id) {
        // Save user profile details (name, email)
        const userRes = await api.put(`/users/${user._id}`, { name: form.name, email: form.email });
        setUser({ ...user, name: userRes.data.name, email: userRes.data.email });
      }
      
      // Save user goals
      await api.put('/goals', {
        goal: form.goal,
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat)
      });
      
      setSaved(true); 
      setTimeout(()=>setSaved(false), 2000); 
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };
  
  const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)||"U";

  const SECTIONS = [
    { id:"profile", icon:User,     label:"Profile" },
    { id:"goals",   icon:Target,   label:"Goals" },
    { id:"diet",    icon:Utensils, label:"Diet Prefs" },
    { id:"notifs",  icon:Bell,     label:"Notifications" },
  ];

  if (loading) return <div className="page-content">Loading profile...</div>;

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your account and nutrition goals.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 24, alignItems: "start" }}>
        
        {/* Left Nav */}
        <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "var(--card-bg)", padding: 32, textAlign: "center", border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07)" }}>
            <div style={{ width:80,height:80,borderRadius:2,background:"var(--cream-dark)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:600,color:"var(--ink)",margin:"0 auto 20px" }}>
              {initials}
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>{form.name}</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-60)", marginTop: 4, marginBottom: 16 }}>{form.email}</p>
            <span style={{ display: "inline-block", background: "var(--cream-dark)", color: "var(--ink)", fontSize: "0.7rem", letterSpacing: "0.02em",  padding: "6px 12px", borderRadius: 2 }}>🎯 {form.goal}</span>
          </div>

          <div style={{ background: "var(--card-bg)", padding: 12, border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07)" }}>
            {SECTIONS.map(({id,icon:Icon,label}) => (
              <button key={id} onClick={()=>setSection(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: section === id ? "var(--cream-dark)" : "transparent", color: section === id ? "var(--ink)" : "var(--ink-60)", border: "none", borderLeft: section === id ? "2px solid var(--gold)" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>
                <Icon size={18}/>
                <span style={{ fontSize: "0.8rem", letterSpacing: "0.02em",  fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>

          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 18, background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, boxShadow: "0 2px 40px rgba(26,22,18,.07)", color: "#c04040", fontSize: "0.8rem", letterSpacing: "0.02em",  fontWeight: 600, cursor: "pointer" }}>
            <LogOut size={16}/> Sign Out
          </button>
        </div>

        {/* Right Content */}
        <div style={{ gridColumn: "span 8" }}>
          <div style={{ background: "var(--card-bg)", padding: 40, border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, minHeight: 480, boxShadow: "0 2px 40px rgba(26,22,18,.07)" }}>
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.4, ease:[0.34,1.56,0.64,1]}}>
                
                {section === "profile" && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Account Details</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", fontWeight: 600 }}>Full Name</label>
                        <input style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} value={form.name} onChange={set("name")}/>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", fontWeight: 600 }}>Email</label>
                        <input type="email" style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} value={form.email} onChange={set("email")}/>
                      </div>
                    </div>
                  </div>
                )}

                {section === "goals" && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Nutrition Goals</h2>
                    <div style={{ marginBottom: 32 }}>
                      <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", fontWeight: 600, display: "block", marginBottom: 16 }}>Primary Goal</label>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {GOALS.map(g => (
                          <button key={g} style={{ padding: "12px 20px", background: form.goal === g ? "var(--ink)" : "var(--card-bg)", color: form.goal === g ? "var(--cream)" : "var(--ink)", border: form.goal === g ? "none" : "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.8rem", letterSpacing: "0.05em", fontFamily: "'Montserrat', sans-serif", cursor: "pointer", transition: "all 0.2s" }} onClick={()=>setForm(f=>({...f,goal:g}))}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", fontWeight: 600 }}>Daily Calories</label>
                        <input type="number" style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", outline: "none", height: 60 }} value={form.calories} onChange={set("calories")}/>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em",  color: "var(--ink-60)", fontWeight: 600 }}>Protein Target (g)</label>
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
