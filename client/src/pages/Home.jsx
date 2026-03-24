import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, ChevronDown, Plus, Droplets, ArrowRight, TrendingDown, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

const DAILY_GOAL = 1850;
const CONSUMED  = 1420;
const BURNED    = 280;
const REMAINING = DAILY_GOAL - CONSUMED + BURNED;

const MACROS = [
  { label: "Carbs",   current: 162, goal: 232, color: "#E8784A", emoji: "🌾" },
  { label: "Protein", current: 88,  goal: 143, color: "#4A8FD8", emoji: "💪" },
  { label: "Fat",     current: 45,  goal: 58,  color: "#D4A030", emoji: "🥑" },
];

const MEALS = [
  { name: "Breakfast", foods: "Oatmeal & Berries",          cal: 420, icon: "🥣" },
  { name: "Lunch",     foods: "Grilled Chicken Salad",       cal: 580, icon: "🥗" },
  { name: "Dinner",    foods: "Salmon & Sweet Potato",       cal: 420, icon: "🐟" },
];

const STATS = [
  { label: "Remaining",  val: REMAINING,  unit: "kcal", color: "var(--primary)",  icon: Target },
  { label: "Consumed",   val: CONSUMED,   unit: "kcal", color: "#4A8FD8",         icon: Zap },
  { label: "Burned",     val: BURNED,     unit: "kcal", color: "#E8784A",         icon: TrendingDown },
];

const FADE = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: d },
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

  const pct = Math.min((CONSUMED / DAILY_GOAL) * 100, 100);

  return (
    <main className="page-content">

      {/* ─── Page Header ─── */}
      <motion.div {...FADE(0)} className="flex justify-between items-center mb-8">
        <div>
          <p className="t-xs mb-1">{greeting} 👋</p>
          <h1 className="t-h1">Hi, {user?.name?.split(" ")[0] || "there"} — here's your day</h1>
        </div>
        <div className="flex items-center gap-3">
          <button style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#FFF", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-outer)"
          }}><Bell size={20} color="var(--text)" /></button>
          <Link to="/log" className="btn btn-cta" style={{ padding: "10px 20px" }}>
            <Plus size={16} /> Log Meal
          </Link>
        </div>
      </motion.div>

      {/* ─── Row 1: 3 Stat Cards + Calorie Ring ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 340px", gap: 16, marginBottom: 16 }}>

        {/* Stat Chips */}
        {STATS.map((s, i) => (
          <motion.div key={s.label} {...FADE(0.05 + i * 0.04)} style={{
            background: "#FFF", borderRadius: 20, padding: "24px 24px",
            boxShadow: "var(--shadow-outer)"
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <s.icon size={20} color={s.color} />
            </div>
            <p className="t-xs mb-2">{s.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>{s.val.toLocaleString()}</span>
              <span className="t-body">{s.unit}</span>
            </div>
          </motion.div>
        ))}

        {/* Main Calorie Card */}
        <motion.div {...FADE(0.17)} style={{
          background: "var(--primary-light)", borderRadius: 20, padding: "24px",
          gridRow: "1 / 3", display: "flex", flexDirection: "column"
        }}>
          <p className="t-xs mb-4">Daily Target</p>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {/* Ring */}
            <svg width={160} height={160} viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="10" />
              <motion.circle cx="80" cy="80" r="64" fill="none"
                stroke="#4B872B" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={402.1}
                initial={{ strokeDashoffset: 402.1 }}
                animate={{ strokeDashoffset: 402.1 - (pct / 100) * 402.1 }}
                transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
              />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1 }}>{Math.round(pct)}%</div>
              <div className="t-xs mt-1">of goal</div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: 8 }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text)" }}>{DAILY_GOAL.toLocaleString()} kcal</span>
            <p className="t-sm mt-1">daily goal</p>
          </div>
        </motion.div>

        {/* ─── Progress bar card ─── */}
        <motion.div {...FADE(0.2)} style={{
          gridColumn: "1 / 4",
          background: "#FFF", borderRadius: 20, padding: "24px",
          boxShadow: "var(--shadow-outer)"
        }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="t-h3">Calorie Progress</h3>
            <span className="t-sm">{CONSUMED} / {DAILY_GOAL} kcal</span>
          </div>
          <div style={{ height: 12, borderRadius: 100, background: "var(--bg-alt)", overflow: "hidden", marginBottom: 12 }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
              style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg, var(--primary), #4B872B)" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {MACROS.map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between t-sm mb-2">
                  <span>{m.emoji} {m.label}</span>
                  <span>{m.current}/{m.goal}g</span>
                </div>
                <div style={{ height: 6, borderRadius: 100, background: "var(--bg-alt)", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((m.current / m.goal) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ height: "100%", borderRadius: 100, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Row 2: Today's Meals + Hydration ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>

        {/* Meals List */}
        <motion.div {...FADE(0.25)} style={{ background: "#FFF", borderRadius: 20, padding: "24px", boxShadow: "var(--shadow-outer)" }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="t-h3">Today's Meals</h3>
            <Link to="/log" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--primary-light)", borderRadius: 100, padding: "8px 16px",
              color: "#4B872B", fontWeight: 600, fontSize: ".875rem"
            }}>
              <Plus size={14} /> Add Food
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MEALS.map((meal, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", borderRadius: 16,
                background: "var(--bg)", boxShadow: "var(--shadow-inset)"
              }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 24 }}>{meal.icon}</span>
                  <div>
                    <div className="t-body-med">{meal.name}</div>
                    <div className="t-sm mt-1">{meal.foods}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#4B872B" }}>{meal.cal} <span className="t-sm">kcal</span></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hydration */}
        <motion.div {...FADE(0.28)} style={{ background: "#FFF", borderRadius: 20, padding: "24px", boxShadow: "var(--shadow-outer)" }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Droplets size={20} style={{ color: "#4A8FD8" }} />
              <h3 className="t-h3">Hydration</h3>
            </div>
            <span style={{ fontWeight: 700, color: "var(--text)" }}>{water}<span className="t-body">/8</span></span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[...Array(8)].map((_, i) => (
              <motion.button key={i} whileTap={{ scale: 0.82 }} onClick={() => setWater(i + 1)}
                style={{
                  height: 52, borderRadius: 14, border: "none", cursor: "pointer",
                  background: i < water ? "#4A8FD8" : "var(--bg-alt)",
                  boxShadow: i < water ? "none" : "var(--shadow-inset)",
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 14, background: "var(--primary-light)", textAlign: "center" }}>
            <p className="t-sm">🎯 <strong>{8 - water} more cups</strong> to hit your daily goal</p>
          </div>
        </motion.div>

      </div>

    </main>
  );
}
