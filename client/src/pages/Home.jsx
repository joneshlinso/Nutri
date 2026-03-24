import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, ChevronDown, Sparkles, Plus, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const DAILY_GOAL = 1850;
const CONSUMED = 1420;
const BURNED = 280;
const NET = CONSUMED - BURNED;

const MACROS = [
  { label: "Carbs",   current: 162, goal: 185, color: "var(--carbs)",   unit:"g" },
  { label: "Protein", current: 88,  goal: 145, color: "var(--protein)", unit:"g" },
  { label: "Fat",     current: 45,  goal: 58,  color: "var(--fat)",     unit:"g" },
];

const MEALS = [
  { name: "Breakfast",   foods: "Oatmeal, Berries",       cal: 420 },
  { name: "Lunch",       foods: "Grilled Chicken Salad",  cal: 580 },
  { name: "Snack",       foods: "Greek Yogurt",           cal: 150 },
];

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay }
});

export default function Home() {
  const { user } = useAuth();
  const [water, setWater] = useState(5);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  const remaining = DAILY_GOAL - NET;
  const pct = Math.min(NET / DAILY_GOAL, 1);

  return (
    <main className="page-content">

      {/* ─── Header ─── */}
      <motion.div {...FADE(0)} className="flex justify-between items-center mb-8">
        <div>
          <p className="t-sm text-muted mb-1">{greeting} 👋</p>
          <h1 className="t-h1">Hi, {user?.name?.split(" ")[0] || "there"}</h1>
        </div>
        <button className="btn-icon"><Bell size={20} /></button>
      </motion.div>

      {/* ─── Hero Calorie Card ─── */}
      <motion.div {...FADE(0.05)} className="card p-8 mb-5" style={{ background: "var(--surface)", position: "relative", overflow: "hidden" }}>
        {/* Soft decorative blob */}
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"var(--primary-light)", opacity:0.5, zIndex:0 }} />
        
        <div style={{ position: "relative", zIndex:1 }}>
          <p className="t-xs mb-2">Today's Nutrition Overview</p>
          
          {/* Search bar */}
          <div className="search-bar mb-6">
            <Sparkles size={18} style={{ color: "var(--text-muted)", flexShrink:0 }} />
            <input placeholder="Log food or search..." />
            <button className="btn btn-sm btn-primary-light" style={{ flexShrink: 0, padding:"6px 16px", borderRadius:"var(--r-pill)" }}>Add</button>
          </div>

          {/* Big Stats */}
          <div>
            <p className="t-sm mb-1" style={{ color: "var(--text-muted)" }}>Eaten {CONSUMED.toLocaleString()}</p>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="t-mega">{Math.abs(remaining)}</span>
              <span className="t-h2 text-secondary">{remaining >= 0 ? "kcal left" : "kcal over"}</span>
            </div>
            <p className="t-sm mb-4" style={{ color: "var(--text-muted)" }}>Burned {BURNED}</p>
          </div>

          {/* Progress Bar */}
          <div className="progress-track mb-2">
            <motion.div className="progress-fill"
              initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
            />
          </div>
          <div className="flex justify-between t-xs text-muted">
            <span>0</span><span>Goal {DAILY_GOAL.toLocaleString()} kcal</span>
          </div>

          {/* See Stats */}
          <Link to="/progress" className="flex items-center gap-1 t-sm-med mt-4" style={{ color:"var(--accent-cta)" }}>
            See Stats <ChevronDown size={14} />
          </Link>
        </div>
      </motion.div>

      {/* ─── Macro Trio ─── */}
      <motion.div {...FADE(0.1)} className="grid-3 mb-5">
        {MACROS.map((m, i) => (
          <div key={m.label} className="macro-pill">
            <div className="flex justify-between items-baseline">
              <span className="t-xs">{m.label}</span>
              <span className="t-sm-med">{m.current}<span className="t-xs text-muted">/{m.goal}{m.unit}</span></span>
            </div>
            <div className="progress-track thin">
              <motion.div className="progress-fill" style={{ background: m.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(m.current/m.goal)*100}%` }}
                transition={{ duration: 1.0, delay: 0.2 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ─── Meal Log Preview ─── */}
      <motion.div {...FADE(0.15)} className="card p-6 mb-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="t-h3">Today's Meals</h2>
          <Link to="/log" className="btn btn-sm btn-primary-light"><Plus size={14}/>Add</Link>
        </div>
        <div className="flex-col gap-3">
          {MEALS.map((meal,i) => (
            <div key={i} className="flex justify-between items-center" style={{
              padding:"14px 18px", background:"var(--bg)", borderRadius:"var(--r-md)",
              boxShadow:"var(--shadow-inset)"
            }}>
              <div>
                <div className="t-body-med">{meal.name}</div>
                <div className="t-sm mt-1">{meal.foods}</div>
              </div>
              <span className="t-body-med" style={{ color:"var(--accent-cta)" }}>{meal.cal}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Hydration ─── */}
      <motion.div {...FADE(0.2)} className="card p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Droplets size={20} style={{ color:"var(--protein)" }} />
            <h2 className="t-h3">Hydration</h2>
          </div>
          <span className="t-body-med" style={{ color:"var(--accent-cta)" }}>{water}/8 cups</span>
        </div>
        <div className="flex gap-2" style={{ flexWrap:"wrap" }}>
          {[...Array(8)].map((_, i) => (
            <motion.button key={i} whileTap={{ scale: 0.88 }} onClick={() => setWater(i+1)}
              style={{
                width:42, height:48, borderRadius:14, border:"none",
                background: i < water ? "var(--protein)" : "var(--surface-inset)",
                boxShadow: i < water ? "none" : "var(--shadow-outer)",
                cursor:"pointer", transition:"all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
            />
          ))}
        </div>
      </motion.div>

    </main>
  );
}
