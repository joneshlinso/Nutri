import { useState, useEffect } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosInstance";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const PLANNER_EMOJIS = {
  Morning: "🍳",
  Midday: "🥗",
  Evening: "🍲",
  Snack: "🍎"
};

export default function Planner() {
  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState(null); // For modal
  const [newMeal, setNewMeal] = useState({ name: "", type: "Morning", cal: "", emoji: PLANNER_EMOJIS.Morning });

  useEffect(() => {
    api.get("/plans").then(res => {
      setPlan(res.data.plan || {});
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const save = async (newPlan) => {
    try {
      await api.post("/plans", { weekStartDate: new Date().toISOString().split("T")[0], plan: newPlan });
      setPlan(newPlan);
    } catch (err) {
      console.error(err);
    }
  };

  const autofill = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/plans/generate");
      if (res.data && res.data.plan) {
        setPlan(res.data.plan);
      }
    } catch (err) {
      console.error("Failed to generate plan", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!activeDay || !newMeal.name || !newMeal.cal) return;
    
    const dayPlan = plan[activeDay] || [];
    const meal = {
      id: Date.now(),
      type: newMeal.type,
      name: newMeal.name,
      cal: Number(newMeal.cal),
      emoji: PLANNER_EMOJIS[newMeal.type] || "🍲"
    };
    
    const newPlan = { ...plan, [activeDay]: [...dayPlan, meal] };
    save(newPlan);
    setActiveDay(null);
    setNewMeal({ name: "", type: "Morning", cal: "", emoji: PLANNER_EMOJIS.Morning });
  };

  const remove = (day, mealId) => {
    const newPlan = { ...plan, [day]: plan[day].filter(x => x.id !== mealId) };
    save(newPlan);
  };

  const totalCals = (meals) => meals?.reduce((a,b)=>a+b.cal,0) || 0;

  if (loading) return <div className="page-content">Loading planner...</div>;

  return (
    <main className="page-content">
      <div className="page-header" style={{ alignItems: "center" }}>
        <div>
          <h1>Weekly Planner</h1>
          <p>Organize your meals dynamically.</p>
        </div>
        <button 
          onClick={autofill} 
          disabled={generating} 
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, var(--ink) 0%, #2A241F 100%)",
            color: "var(--gold)",
            border: "1px solid rgba(184,146,74,0.4)",
            borderRadius: 2,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 15px rgba(184,146,74,0.08)",
            transition: "all 0.3s ease",
            opacity: generating ? 0.6 : 1,
            fontFamily: "'Montserrat', sans-serif"
          }}
          onMouseOver={e => {
            if (!generating) {
              e.currentTarget.style.background = "var(--gold)";
              e.currentTarget.style.color = "var(--cream)";
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(184,146,74,0.25)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseOut={e => {
            if (!generating) {
              e.currentTarget.style.background = "linear-gradient(135deg, var(--ink) 0%, #2A241F 100%)";
              e.currentTarget.style.color = "var(--gold)";
              e.currentTarget.style.borderColor = "rgba(184,146,74,0.4)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(184,146,74,0.08)";
              e.currentTarget.style.transform = "none";
            }
          }}
        >
          {generating ? (
            <>
              <span className="spin" style={{ display: "inline-block" }}>✨</span>
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={13} style={{ color: "var(--gold)" }} />
              Auto-fill with AI
            </>
          )}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {DAYS.map(day => {
          const isToday = day === "Wed"; // mock today
          const meals = plan[day] || [];
          const totalCal = meals.reduce((s,m)=>s+m.cal, 0);
          const progress = Math.min((totalCal / 2400) * 100, 100);

          const groupedMeals = {
            Morning: meals.filter(m => m.type === "Morning"),
            Midday: meals.filter(m => m.type === "Midday"),
            Evening: meals.filter(m => m.type === "Evening"),
            Snack: meals.filter(m => m.type === "Snack")
          };

          return (
            <div key={day} style={{ display: "flex", flexDirection: "row", alignItems: "stretch", padding: 32, background: isToday ? "var(--sage-pale)" : "var(--card-bg)", border: isToday ? "1px solid var(--sage)" : "var(--border)", borderRadius: 8, boxShadow: "var(--shadow-card)", gap: 32 }}>
              
              {/* Day Header & Progress */}
              <div style={{ width: "120px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRight: isToday ? "1px solid var(--sage)" : "1px solid var(--ink-10)", paddingRight: 32 }}>
                <p className="text-micro-caps" style={{ color: isToday ? "var(--sage)" : "var(--ink-50)" }}>{day}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 12 }}>
                  <p style={{ fontSize: "2.2rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, color: isToday ? "var(--ink)" : "var(--ink-80)", letterSpacing: "-0.02em" }}>{totalCal}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--ink-40)" }}>/ 2400</p>
                </div>
                {/* Progress Bar */}
                <div style={{ width: "100%", height: 3, background: "rgba(26,22,18,0.05)", borderRadius: 2, marginTop: 16, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: isToday ? "var(--sage)" : "var(--gold-light)", opacity: 0.8, transition: "width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" }} />
                </div>
              </div>

              {/* Meals Area */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                {["Morning", "Midday", "Evening"].map(timeOfDay => {
                  const typeMeals = groupedMeals[timeOfDay];
                  return (
                    <div key={timeOfDay} style={{ background: "rgba(26,22,18,0.015)", padding: 24, borderRadius: 8, display: "flex", flexDirection: "column", gap: 16, border: "1px solid rgba(26,22,18,0.03)" }}>
                      <div className="text-micro-caps">{timeOfDay}</div>
                      
                      <AnimatePresence>
                        {typeMeals.map(meal => (
                          <motion.div key={meal.id} initial={{opacity:0, x: -10}} animate={{opacity:1, x: 0}} exit={{opacity:0, scale:0.9}} transition={{duration:0.3}}
                            style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--card-bg)", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                            <div style={{ fontSize: "1.2rem" }}>{PLANNER_EMOJIS[meal.type] || meal.emoji || "🍲"}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {meal.name}
                              </div>
                            </div>
                            <button className="hover-delete" onClick={()=>remove(day,meal.id)} style={{ width: 24, height: 24, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-30)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }} onMouseOver={e=>e.currentTarget.style.color="#c04040"} onMouseOut={e=>e.currentTarget.style.color="var(--ink-30)"}>
                              ×
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button onClick={() => setActiveDay(day)} style={{ background: "transparent", border: "1px dashed var(--ink-20)", color: "var(--ink-40)", borderRadius: 6, padding: "8px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", fontSize: "0.75rem", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.color = "var(--ink-80)"; e.currentTarget.style.borderColor = "var(--ink-40)"; }} onMouseOut={e => { e.currentTarget.style.color = "var(--ink-40)"; e.currentTarget.style.borderColor = "var(--ink-20)"; }}>
                        <Plus size={12}/> Add
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Meal Modal */}
      {activeDay && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--card-bg)", padding: 32, borderRadius: 2, width: 400, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--ink)" }}>Add Meal to {activeDay}</h2>
              <button onClick={() => setActiveDay(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-60)" }}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddMeal} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em", color: "var(--ink-60)", fontWeight: 600, display: "block", marginBottom: 6 }}>Meal Name</label>
                <input required style={{ width: "100%", padding: "12px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, outline: "none" }} value={newMeal.name} onChange={e => setNewMeal({...newMeal, name: e.target.value})} placeholder="e.g. Avocado Toast" />
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em", color: "var(--ink-60)", fontWeight: 600, display: "block", marginBottom: 6 }}>Calories</label>
                <input required type="number" style={{ width: "100%", padding: "12px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, outline: "none" }} value={newMeal.cal} onChange={e => setNewMeal({...newMeal, cal: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", letterSpacing: "0.02em", color: "var(--ink-60)", fontWeight: 600, display: "block", marginBottom: 6 }}>Type</label>
                <select style={{ width: "100%", padding: "12px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, outline: "none" }} value={newMeal.type} onChange={e => setNewMeal({...newMeal, type: e.target.value})}>
                  <option value="Morning">Morning</option>
                  <option value="Midday">Midday</option>
                  <option value="Evening">Evening</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              
              <button type="submit" className="cta-btn" style={{ marginTop: 8, padding: "14px", width: "100%" }}>Save Meal</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
