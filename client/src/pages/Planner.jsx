import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TYPES = [
  { id: "Breakfast", color: "var(--primary)" },
  { id: "Lunch",     color: "var(--protein)" },
  { id: "Dinner",    color: "var(--carbs)" },
  { id: "Snack",     color: "var(--fat)" }
];

const INIT_PLAN = {
  "Mon": [{ id:1, type:"Breakfast", name:"Oatmeal & Berries", cal:320 }, { id:2, type:"Lunch", name:"Chicken Salad", cal:450 }],
  "Tue": [{ id:3, type:"Dinner", name:"Salmon & Asparagus", cal:520 }],
  "Wed": [], "Thu": [], "Fri": [], "Sat": [], "Sun": [],
};

const STAGGER = { visible: { transition: { staggerChildren: 0.05 } } };
const FADE_UP = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function Planner() {
  const [plan, setPlan] = useState(INIT_PLAN);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPlan({
        "Mon": [{ id:1, type:"Breakfast", name:"Ovo-veg Scramble", cal:350 }, { id:2, type:"Lunch", name:"Quinoa Bowl", cal:500 }, { id:3, type:"Dinner", name:"Steak & Sweet Potato", cal:650 }],
        "Tue": [{ id:4, type:"Breakfast", name:"Protein Smoothie", cal:280 }, { id:5, type:"Lunch", name:"Turkey Wrap", cal:420 }, { id:6, type:"Dinner", name:"Baked Cod", cal:400 }],
        "Wed": [{ id:7, type:"Breakfast", name:"Greek Yogurt", cal:250 }, { id:8, type:"Lunch", name:"Tuna Salad", cal:380 }, { id:9, type:"Dinner", name:"Chicken Stir-fry", cal:550 }],
        "Thu": [{ id:10, type:"Breakfast", name:"Avocado Toast", cal:320 }, { id:11, type:"Lunch", name:"Lentil Soup", cal:350 }, { id:12, type:"Dinner", name:"Pork Chop & Apples", cal:600 }],
        "Fri": [{ id:13, type:"Breakfast", name:"Oatmeal", cal:300 }, { id:14, type:"Lunch", name:"Chicken Caesar", cal:450 }, { id:15, type:"Dinner", name:"Homemade Pizza", cal:700 }],
        "Sat": [{ id:16, type:"Breakfast", name:"Pancakes", cal:500 }, { id:17, type:"Lunch", name:"Leftover Pizza", cal:400 }, { id:18, type:"Dinner", name:"Burger & Salad", cal:800 }],
        "Sun": [{ id:19, type:"Breakfast", name:"Bacon & Eggs", cal:450 }, { id:20, type:"Lunch", name:"Caprese Sandwich", cal:400 }, { id:21, type:"Dinner", name:"Roast Chicken", cal:600 }],
      });
      setGenerating(false);
    }, 1500);
  };

  const removeMeal = (day, mealId) => {
    setPlan(p => ({ ...p, [day]: p[day].filter(m => m.id !== mealId) }));
  };

  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      <motion.header variants={FADE_UP} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="t-h1 mb-2">Weekly <span className="grad-text">Planner</span></h1>
          <div className="flex items-center gap-4">
            <button className="btn-icon"><ChevronLeft size={18} /></button>
            <span className="t-sm-med">Oct 16 - Oct 22</span>
            <button className="btn-icon"><ChevronRight size={18} /></button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
          {generating ? <span className="typing-dot" style={{ background:"#000", margin:"0 4px" }} /> : <><Sparkles size={16} /> AI Generate Week</>}
        </button>
      </motion.header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--sp-4)", minHeight: "calc(100vh - 200px)" }}>
        {DAYS.map((day, i) => {
          const meals = plan[day];
          const isToday = day === "Wed";
          const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);

          return (
            <motion.div key={day} variants={FADE_UP} className={`card ${isToday ? "card-dark" : ""}`} style={{ padding: "var(--sp-4)", display: "flex", flexDirection: "column", gap: "var(--sp-4)", border: isToday ? "1px solid var(--primary)" : "1px solid var(--border)" }}>
              {/* Day Header */}
              <div className="text-center pb-3" style={{ borderBottom: "1px dashed var(--border)" }}>
                <h3 className="t-h3" style={{ color: isToday ? "var(--primary)" : "var(--text)" }}>{day}</h3>
                <p className="t-xs text-muted mt-1">{totalCal} kcal</p>
              </div>

              {/* Meals List */}
              <div className="flex-col gap-3" style={{ flex: 1 }}>
                {meals.map(meal => {
                  const typeColor = TYPES.find(t => t.id === meal.type)?.color || "var(--text-secondary)";
                  return (
                    <motion.div key={meal.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${typeColor}40`, borderRadius: "var(--r-sm)", padding: "10px", position: "relative", group: "true" }}>
                      <div className="t-xs" style={{ color: typeColor, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                        {meal.type}
                      </div>
                      <div className="t-sm-med" style={{ lineHeight: 1.3 }}>{meal.name}</div>
                      <div className="t-xs text-muted mt-1">{meal.cal} kcal</div>
                      
                      <button className="btn-icon" style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, background: "var(--error)", color: "#fff", border: "none" }}
                        onClick={() => removeMeal(day, meal.id)}>
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  );
                })}
                
                <button className="btn btn-ghost btn-sm btn-w-full mt-auto" style={{ border: "1px dashed var(--border)", opacity: 0.6 }}>
                  <Plus size={14} /> Add
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.main>
  );
}
