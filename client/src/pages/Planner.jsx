import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosInstance";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Planner() {
  const [plan, setPlan] = useState({ Mon:[], Tue:[], Wed:[], Thu:[], Fri:[], Sat:[], Sun:[] });
  const [weekStart, setWeekStart] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingGrocery, setGeneratingGrocery] = useState(false);
  const [groceryList, setGroceryList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await api.get("/plans");
      setPlan(res.data.plan);
      setWeekStart(res.data.weekStartDate);
    } catch (err) {
      console.error("Failed to fetch plan", err);
    } finally {
      setLoading(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/plans/generate");
      setPlan(res.data.plan);
      setWeekStart(res.data.weekStartDate);
    } catch (err) {
      console.error("Failed to generate plan", err);
    } finally {
      setGenerating(false);
    }
  };

  const generateGrocery = async () => {
    setGeneratingGrocery(true);
    try {
      const allMeals = Object.values(plan).flat();
      const res = await api.post("/ai/grocery", { meals: allMeals });
      setGroceryList(res.data.boutiques);
    } catch (err) {
      console.error("Failed to generate grocery list", err);
    } finally {
      setGeneratingGrocery(false);
    }
  };

  const save = async (newPlan) => {
    try {
      await api.post("/plans", { weekStartDate: weekStart, plan: newPlan });
    } catch (err) {
      console.error("Failed to save plan", err);
    }
  };

  const remove = (day, id) => {
    const newPlan = { ...plan, [day]: plan[day].filter(m => m.id !== id) };
    setPlan(newPlan);
    save(newPlan);
  };

  if (loading) return <div className="page-content">Loading planner...</div>;

  // Format week display
  const dateObj = weekStart ? new Date(weekStart) : new Date();
  const endDate = new Date(dateObj);
  endDate.setDate(dateObj.getDate() + 6);
  const weekDisplay = `${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1>Weekly Planner</h1>
          <p>Your nutritional schedule layout.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3" style={{ background: "var(--card-bg)", padding: "8px 16px", borderRadius: 2, border: "var(--border)", boxShadow: "var(--shadow-card)" }}>
            <button style={{ width: 32, height: 32, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-60)" }}><ChevronLeft size={16}/></button>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)", letterSpacing: "0.02em" }}>{weekDisplay}</span>
            <button style={{ width: 32, height: 32, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-60)" }}><ChevronRight size={16}/></button>
          </div>
          <button onClick={generateGrocery} disabled={generatingGrocery} style={{ height: 44, padding: "0 24px", background: "var(--ink)", border: "none", borderRadius: 2, cursor: "pointer", fontSize: "0.8rem", color: "var(--cream)", fontWeight: 500 }}>
            {generatingGrocery ? "Curating..." : "🛒 Gourmet List"}
          </button>
          <button onClick={generate} disabled={generating} style={{ height: 44, padding: "0 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--ink-60)" }}>
            {generating ? "Curating..." : "✨ Auto-fill"}
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto", paddingBottom: "16px", margin: "0 -32px", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 16, minWidth: "1000px", minHeight: "calc(100vh - 200px)" }}>
        {DAYS.map((day, idx) => {
          const meals = plan[day];
          const isToday = day === "Wed";
          const totalCal = meals.reduce((s,m)=>s+m.cal, 0);

          return (
            <div key={day} style={{ display: "flex", flexDirection: "column", padding: 20, background: isToday ? "var(--sage-pale)" : "var(--card-bg)", border: isToday ? "1px solid var(--sage)" : "var(--border)", borderRadius: 2, boxShadow: "var(--shadow-card)" }}>
              <div className="text-center pb-4 mb-4" style={{ borderBottom: isToday ? "1px solid var(--sage)" : "1px solid var(--ink-10)" }}>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.02em",  color: isToday ? "var(--sage)" : "var(--ink-60)" }}>{day}</p>
                <p style={{ fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginTop: 4, color: isToday ? "var(--ink)" : "var(--ink-60)" }}>{totalCal}</p>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.02em",  color: "var(--ink-30)" }}>kcal</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <AnimatePresence>
                  {meals.map(meal => (
                    <motion.div key={meal.id} initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0, scale:0.9}} transition={{duration:0.4, ease:[0.22,1,0.36,1]}}
                      className="meal-card"
                      style={{ position: "relative", padding: "14px", background: "var(--card-bg)", border: "1px solid var(--ink-10)", borderRadius: 2, boxShadow: "0 2px 10px rgba(26,22,18,.03)" }}>
                      <div style={{ fontSize: "0.55rem", color: "var(--ink-60)", marginBottom: 6 }}>{meal.type}</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--ink)", lineHeight: 1.3 }}>{meal.emoji} {meal.name}</div>
                      <div style={{ fontSize: "0.75rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 4, color: "var(--ink-60)" }}>{meal.cal} kcal</div>
                      <button className="hover-delete" onClick={()=>remove(day,meal.id)} style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderRadius: "50%", background: "var(--card-bg)", border: "1px solid var(--ink-10)", cursor: "pointer", color: "#c04040", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button style={{ background: "transparent", border: "none", color: "var(--ink-60)", borderRadius: 2, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", cursor: "pointer", width: "100%", transition: "all 0.2s", fontSize: "0.85rem", gap: "6px" }} onMouseOver={e => { e.currentTarget.style.color = "var(--ink)"; }} onMouseOut={e => { e.currentTarget.style.color = "var(--ink-60)"; }}>
                  <Plus size={14}/> Add Meal
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Gourmet Grocery List Modal */}
      <AnimatePresence>
        {groceryList && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(26,22,18,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}
            onClick={() => setGroceryList(null)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: "var(--cream)", width: "100%", maxWidth: 600, maxHeight: "80vh", overflowY: "auto", padding: 40, border: "var(--border)", boxShadow: "var(--shadow-deep)", borderRadius: 2 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 300, color: "var(--ink)" }}>Le Marché</h2>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.02em",  color: "var(--ink-60)", marginTop: 8 }}>Your Curated Ingredients</p>
                <div style={{ width: 40, height: 1, background: "var(--gold)", margin: "20px auto 0" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {groceryList.map((boutique, i) => (
                  <div key={i}>
                    <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.02em",  color: "var(--ink)", marginBottom: 12, borderBottom: "1px solid var(--ink-10)", paddingBottom: 8 }}>{boutique.name}</h3>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                      {boutique.items.map((item, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--ink-60)" }}>
                          <div style={{ width: 6, height: 6, border: "1px solid var(--gold)", transform: "rotate(45deg)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button className="cta-btn" onClick={() => setGroceryList(null)} style={{ marginTop: 40, width: "100%", justifyContent: "center" }}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
