import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import MacroRing from "../components/MacroRing";
import MacroBar from "../components/MacroBar";
import { Flame, Droplet, Sparkles, ChevronRight, Apple, Play, Plus } from "lucide-react";

// Mock Data
const DAILY_GOAL = 1850;
const CONSUMED = 1420;
const MACROS = {
  protein: { current: 88, goal: 145, color: "var(--protein)" },
  carbs:   { current: 162, goal: 185, color: "var(--carbs)" },
  fat:     { current: 45, goal: 58,  color: "var(--fat)" }
};

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good evening");
  const [water, setWater] = useState(5);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
  }, []);

  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      
      {/* ─── Header ─── */}
      <motion.header variants={FADE_UP} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="t-h1">
            {greeting}, <span className="grad-text">{user?.name?.split(" ")[0] || "User"}</span>
          </h1>
          <p className="t-body mt-1">Here’s your nutrition overview for today.</p>
        </div>
        <div className="flex gap-3">
          <span className="badge badge-orange"><Flame size={12} /> 5 Day Streak</span>
          <Link to="/log" className="btn btn-primary btn-sm rounded-pill">
            <Plus size={16} /> Log Meal
          </Link>
        </div>
      </motion.header>

      <div className="bento-grid">
        
        {/* ─── Bento: Calorie Summary (Large Dark Card) ─── */}
        <motion.div variants={FADE_UP} className="card-dark p-8" style={{ gridColumn: "span 8", display: "flex", alignItems: "center", gap: "var(--sp-8)" }}>
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="t-xs text-muted" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Daily Calories</span>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="t-stat text-primary">{DAILY_GOAL - CONSUMED}</span>
              <span className="t-sm-med text-muted">kcal remaining</span>
            </div>
            
            {/* Smooth glowing progress bar */}
            <div className="macro-bar-track mb-3" style={{ height: 10, background: "rgba(255,255,255,0.05)" }}>
              <div className="macro-bar-fill grad-primary" style={{ width: `${(CONSUMED/DAILY_GOAL)*100}%` }} />
            </div>
            
            <div className="flex justify-between t-sm text-muted" style={{ fontWeight: 500 }}>
              <span>{CONSUMED} eaten</span>
              <span>{DAILY_GOAL} goal</span>
            </div>
          </div>
          
          <div style={{ width: 140, height: 140, flexShrink: 0, position:"relative" }}>
             <MacroRing strokeWidth={12} progress={(CONSUMED/DAILY_GOAL)} color="var(--primary)" size={140} glow />
             <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
               <Flame size={28} className="text-primary mb-1" style={{ filter: "drop-shadow(0 0 8px rgba(16,185,129,0.5))" }} />
             </div>
          </div>
        </motion.div>

        {/* ─── Bento: AI Coach Insight ─── */}
        <motion.div variants={FADE_UP} className="card p-6" style={{ gridColumn: "span 4", background: "linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)", borderColor: "rgba(16, 185, 129, 0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-glow)", color: "var(--primary)" }}>
              <Sparkles size={16} />
            </div>
            <span className="t-xs" style={{ color: "var(--primary)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>AI Insight</span>
          </div>
          <p className="t-sm" style={{ color: "var(--text)", lineHeight: 1.6, marginBottom: "var(--sp-6)" }}>
            You're <strong>57g short</strong> on protein today. I suggest adding a piece of grilled chicken or a protein shake to your dinner to hit your goal.
          </p>
          <Link to="/ai" className="btn btn-secondary btn-sm btn-w-full" style={{ justifyContent: "center" }}>
            Fix Protein Gap <ChevronRight size={14} />
          </Link>
        </motion.div>

        {/* ─── Bento: Macro Distribution ─── */}
        <motion.div variants={FADE_UP} className="card p-6" style={{ gridColumn: "span 6" }}>
          <h3 className="t-h3 mb-6">Macro Distribution</h3>
          <div className="flex-col gap-6">
            <MacroBar label="Protein" current={MACROS.protein.current} goal={MACROS.protein.goal} color={MACROS.protein.color} unit="g" />
            <MacroBar label="Carbs"   current={MACROS.carbs.current}   goal={MACROS.carbs.goal}   color={MACROS.carbs.color}   unit="g" />
            <MacroBar label="Fat"     current={MACROS.fat.current}     goal={MACROS.fat.goal}     color={MACROS.fat.color}     unit="g" />
          </div>
        </motion.div>

        {/* ─── Bento: Water & Timeline ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 6", display: "grid", gridTemplateRows: "auto 1fr", gap: "var(--sp-6)" }}>
          
          {/* Water Tracker */}
          <div className="card p-6 flex justify-between items-center" style={{ background: "rgba(59, 130, 246, 0.05)", borderColor: "rgba(59, 130, 246, 0.15)" }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Droplet size={16} className="text-protein" />
                <span className="t-h3">Hydration</span>
              </div>
              <p className="t-sm text-muted">{water} of 8 glasses logged</p>
            </div>
            <div className="flex gap-1" style={{ flexWrap: "wrap", width: 140, justifyContent: "flex-end" }}>
              {[...Array(8)].map((_, i) => (
                <button key={i} onClick={() => setWater(i+1)}
                  style={{
                    width: 28, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                    background: i < water ? "var(--protein)" : "rgba(255,255,255,0.05)",
                    boxShadow: i < water ? "0 0 12px rgba(59, 130, 246, 0.4)" : "none",
                    transition: "all .3s var(--ease)",
                    transform: i < water ? "scale(1.05)" : "scale(1)"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Mini Timeline */}
          <div className="card p-6">
            <h3 className="t-h3 mb-4">Today's Meals</h3>
            <div className="flex-col gap-4">
              {[
                { time: "08:30", type: "Breakfast", cal: 420, icon: <Apple size={16} /> },
                { time: "13:15", type: "Lunch",     cal: 650, icon: <Play size={16} style={{transform:"rotate(-90deg)"}} /> }, // placeholder icon
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="t-xs text-muted" style={{ width: 40 }}>{m.time}</div>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    {m.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="t-sm-med">{m.type}</div>
                    <div className="t-xs text-muted">{m.cal} kcal</div>
                  </div>
                  <ChevronRight size={16} className="text-muted" style={{ opacity: 0, transform: "translateX(-10px)", transition: "all .2s" }} />
                </div>
              ))}
              
              <Link to="/log" className="btn btn-ghost btn-sm mt-2" style={{ alignSelf: "flex-start", paddingLeft: 0 }}>
                + Add Dinner
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.main>
  );
}
