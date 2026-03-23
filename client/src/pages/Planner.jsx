import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "../components/TiltCard";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TYPES = [
  { id: "Breakfast", color: "var(--primary)" },
  { id: "Lunch",     color: "var(--protein)" },
  { id: "Dinner",    color: "var(--carbs)" },
  { id: "Snack",     color: "var(--fat)" }
];

const INIT_PLAN = {
  "Mon": [{ id:1, type:"Breakfast", name:"Oatmeal Core", cal:320 }, { id:2, type:"Lunch", name:"Avocado Syntax", cal:450 }],
  "Tue": [{ id:3, type:"Dinner", name:"Salmon Telemetry", cal:520 }],
  "Wed": [{ id:4, type:"Breakfast", name:"Protein Shake", cal:250 }],
  "Thu": [], "Fri": [], "Sat": [], "Sun": [],
};

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } };

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
    }, 2000);
  };

  const removeMeal = (day, mealId) => {
    setPlan(p => ({ ...p, [day]: p[day].filter(m => m.id !== mealId) }));
  };

  return (
    <motion.main initial="hidden" animate="visible" variants={STAGGER}>
      <motion.header variants={FADE_UP} className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="t-display tracking-tighter text-text">Sequence <span className="grad-text-primary">Matrix</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="btn-icon"><ChevronLeft size={18} /></button>
            <span className="t-xs text-text">OCT 16 - OCT 22</span>
            <button className="btn-icon"><ChevronRight size={18} /></button>
          </div>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
            {generating ? <span className="flex items-center gap-2"><div style={{width:8,height:8,background:"#000",borderRadius:"50%",animation:"pulse 1s infinite"}}/> Compiling...</span> : <><Sparkles size={16} /> Auto-Compile Sequence</>}
          </button>
        </div>
      </motion.header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--sp-4)", minHeight: "calc(100vh - 220px)" }}>
        {DAYS.map((day, i) => {
          const meals = plan[day];
          const isToday = day === "Wed";
          const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);

          return (
            <motion.div key={day} variants={FADE_UP} className="relative">
              <TiltCard className={`p-4 h-full flex-col ${isToday ? "card-dark" : ""}`} style={{ background: isToday ? "rgba(0,230,118,0.03)" : "var(--glass-1)", borderColor: isToday ? "rgba(0,230,118,0.3)" : "var(--glass-border)" }}>
                
                {/* Day Header */}
                <div className="text-center pb-4 mb-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                  <h3 className="t-h3" style={{ color: isToday ? "var(--primary)" : "var(--text)" }}>{day}</h3>
                  <p className="t-xs mt-2">{totalCal} / 1850 kcal</p>
                </div>

                {/* Meals List */}
                <div className="flex-col gap-3 flex-1 relative">
                  <AnimatePresence>
                    {meals.map(meal => {
                      const typeColor = TYPES.find(t => t.id === meal.type)?.color || "var(--text-secondary)";
                      return (
                        <motion.div key={meal.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.9 }}
                          className="group relative" style={{ background: "var(--glass-2)", border: `1px solid ${typeColor}40`, borderRadius: "var(--r-md)", padding: "12px", transition: "all .3s var(--ease-expo)", boxShadow: `inset 0 -1px 8px ${typeColor}10` }}>
                          
                          <div className="t-xs" style={{ color: typeColor, marginBottom: 6 }}>{meal.type}</div>
                          <div className="t-sm-med text-text" style={{ lineHeight: 1.3 }}>{meal.name}</div>
                          <div className="t-xs mt-2">{meal.cal} kcal</div>
                          
                          <button className="btn-icon absolute -top-2 -right-2 opacity-0 group-hover:opacity-100" style={{ width: 28, height: 28, background: "rgba(255, 23, 68, 0.9)", color: "#000", border: "none" }}
                            onClick={() => removeMeal(day, meal.id)}>
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  <button className="btn btn-ghost btn-sm btn-w-full mt-auto" style={{ border: "1px dashed var(--glass-border)", color: "var(--text-muted)", padding: "16px" }}>
                    <Plus size={16} /> Insert
                  </button>
                </div>

              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </motion.main>
  );
}
