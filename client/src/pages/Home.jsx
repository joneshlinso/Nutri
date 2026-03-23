import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame, Droplets, Zap, TrendingUp, Plus,
  ChevronRight, Sunrise, Sun, Moon, Coffee, Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MacroRing from "../components/MacroRing";
import MacroBar from "../components/MacroBar";

// ─── Mock data (will come from API later) ─────────────────────
const TODAY = {
  calories: { consumed: 1420, goal: 1850 },
  protein:  { consumed: 88,   goal: 145 },
  carbs:    { consumed: 162,  goal: 185 },
  fat:      { consumed: 41,   goal: 58  },
  water:    { consumed: 5,    goal: 8   },
};

const MEALS = [
  { id:1, type:"Breakfast", icon: Sunrise, color:"#F5A623",
    items:["Hard-Boiled Egg","Oatmeal w/ Berries"], calories:480, time:"8:00 AM" },
  { id:2, type:"Lunch",     icon: Sun,     color:"#4A90D9",
    items:["Grilled Chicken Bowl","Mixed Greens"], calories:620, time:"12:30 PM" },
  { id:3, type:"Snack",     icon: Coffee,  color:"#8FAF8F",
    items:["Greek Yogurt"],                        calories:120, time:"3:00 PM" },
  { id:4, type:"Dinner",    icon: Moon,    color:"#3A7D44",
    items:["Not logged yet"],                      calories:0,   time:"7:00 PM", empty:true },
];

const AI_INSIGHT = {
  message: "You're 57g short on protein today. Consider adding a chicken breast or a protein shake with dinner.",
  suggestions: ["+ Add Chicken Breast", "+ Add Protein Shake", "Generate Dinner Plan"],
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [waterCount, setWaterCount] = useState(TODAY.water.consumed);
  const calorieProgress = TODAY.calories.consumed / TODAY.calories.goal;
  const remaining = TODAY.calories.goal - TODAY.calories.consumed;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <main className="page-content" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="t-sm text-muted">{greeting} 👋</p>
          <h1 className="t-h1">{user?.name?.split(" ")[0] || "Alex"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ textAlign:"right" }}>
            <div className="t-xs text-muted">{new Date().toLocaleDateString("en-US",{weekday:"long"})}</div>
            <div className="t-sm-med">{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
          </div>
          <div className="avatar" style={{ width:44,height:44,fontSize:16 }}>
            {user?.name ? user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "U"}
          </div>
        </div>
      </div>

      {/* ─── Daily Summary Card ─── */}
      <div className="card-dark fade-up" style={{ padding:"var(--sp-6)", marginBottom:"var(--sp-4)", display:"grid", gridTemplateColumns:"1fr auto", gap:"var(--sp-6)", alignItems:"center" }}>
        <div>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:".875rem", marginBottom:4 }}>Daily Calories</p>
          <div className="flex items-center gap-3">
            <span style={{ fontSize:"2.75rem", fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>
              {TODAY.calories.consumed.toLocaleString()}
            </span>
            <span style={{ color:"rgba(255,255,255,0.55)", fontSize:"1rem" }}>/ {TODAY.calories.goal.toLocaleString()} kcal</span>
          </div>
          {/* Progress bar */}
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:"var(--r-pill)", height:8, marginTop:12, overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:"var(--r-pill)",
              background:"rgba(255,255,255,0.85)",
              width:`${Math.min(calorieProgress*100,100)}%`,
              transition:"width .9s var(--ease)"
            }} />
          </div>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:".8125rem", marginTop:8 }}>
            {remaining > 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over goal`}
          </p>
        </div>
        {/* Flame icon */}
        <div style={{ textAlign:"center" }}>
          <Flame size={56} style={{ color:"rgba(255,255,255,0.3)" }} />
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:".75rem", marginTop:4 }}>🔥 5 day streak</div>
        </div>
      </div>

      {/* ─── Macro Rings ─── */}
      <div className="card fade-up p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="t-h3">Macros Today</h2>
          <span className="badge badge-green">On Track</span>
        </div>
        <div className="flex" style={{ gap:"var(--sp-6)", justifyContent:"space-around", flexWrap:"wrap" }}>
          <MacroRing label="Protein" current={TODAY.protein.consumed} goal={TODAY.protein.goal} color="var(--protein)" unit="g" />
          <MacroRing label="Carbs"   current={TODAY.carbs.consumed}   goal={TODAY.carbs.goal}   color="var(--carbs)"   unit="g" />
          <MacroRing label="Fat"     current={TODAY.fat.consumed}      goal={TODAY.fat.goal}      color="var(--fat)"     unit="g" />
        </div>
        <div className="flex-col gap-3 mt-4" style={{ display:"flex" }}>
          <MacroBar label="Protein" current={TODAY.protein.consumed} goal={TODAY.protein.goal} color="var(--protein)" />
          <MacroBar label="Carbs"   current={TODAY.carbs.consumed}   goal={TODAY.carbs.goal}   color="var(--carbs)" />
          <MacroBar label="Fat"     current={TODAY.fat.consumed}      goal={TODAY.fat.goal}      color="var(--fat)" />
        </div>
      </div>

      <div className="grid-2 mb-4" style={{ gap:"var(--sp-4)" }}>
        {/* ─── Water Tracker ─── */}
        <div className="card p-6 fade-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Droplets size={20} style={{ color:"var(--info)" }} />
              <h2 className="t-h3">Water</h2>
            </div>
            <span className="t-sm-med" style={{ color:"var(--info)" }}>{waterCount}/{TODAY.water.goal} glasses</span>
          </div>
          <div className="water-drops">
            {Array.from({ length: TODAY.water.goal }).map((_, i) => (
              <span
                key={i}
                className={`water-drop ${i < waterCount ? "filled" : ""}`}
                onClick={() => setWaterCount(i < waterCount ? i : i + 1)}
              >💧</span>
            ))}
          </div>
          <div style={{ background:"var(--surface-2)", borderRadius:"var(--r-pill)", height:6, marginTop:12 }}>
            <div style={{ height:"100%", borderRadius:"var(--r-pill)", background:"var(--info)", width:`${(waterCount/TODAY.water.goal)*100}%`, transition:"width .5s" }} />
          </div>
        </div>

        {/* ─── Quick Stats ─── */}
        <div className="card p-6 fade-up">
          <h2 className="t-h3 mb-4">Quick Stats</h2>
          <div className="flex-col gap-3" style={{ display:"flex" }}>
            {[
              { icon: Flame,     label:"Calories Burned",  value:"320 kcal",  color:"var(--error)" },
              { icon: TrendingUp,label:"Net Calories",      value:`${TODAY.calories.consumed - 320} kcal`, color:"var(--primary)" },
              { icon: Zap,       label:"Days Streak",       value:"5 days",    color:"var(--warning)" },
            ].map(({ icon:Icon, label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color }} />
                  <span className="t-sm text-muted">{label}</span>
                </div>
                <span className="t-sm-med" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── AI Insight Card ─── */}
      <div className="card-gradient fade-up p-6 mb-4" style={{ borderLeft:"4px solid var(--primary)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} style={{ color:"var(--primary)" }} />
          <span className="t-sm-med text-primary">AI Coach Insight</span>
        </div>
        <p className="t-body" style={{ color:"var(--text-secondary)", marginBottom:16 }}>
          {AI_INSIGHT.message}
        </p>
        <div className="flex" style={{ gap:8, flexWrap:"wrap" }}>
          {AI_INSIGHT.suggestions.map(s => (
            <button key={s} className="btn btn-secondary btn-sm" onClick={() => navigate(s.includes("Plan") ? "/ai" : "/log")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Meal Timeline ─── */}
      <div className="fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="t-h2">Today's Meals</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/log")}>
            <Plus size={14} /> Add Meal
          </button>
        </div>
        <div className="meal-timeline">
          {MEALS.map(meal => {
            const Icon = meal.icon;
            return (
              <div key={meal.id} className="meal-item" style={{ opacity: meal.empty ? 0.6 : 1 }}>
                <div style={{ width:40,height:40,borderRadius:"var(--r-sm)",background:`${meal.color}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Icon size={20} style={{ color:meal.color }} />
                </div>
                <div style={{ flex:1 }}>
                  <div className="flex items-center justify-between">
                    <span className="t-sm-med">{meal.type}</span>
                    <span className="t-xs text-muted">{meal.time}</span>
                  </div>
                  <p className="t-xs text-muted">{meal.items.join(" • ")}</p>
                </div>
                <div className="flex items-center gap-2">
                  {meal.calories > 0 && (
                    <span className="badge badge-green">{meal.calories} kcal</span>
                  )}
                  {meal.empty ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate("/log")}>Add</button>
                  ) : (
                    <ChevronRight size={16} style={{ color:"var(--text-muted)" }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
