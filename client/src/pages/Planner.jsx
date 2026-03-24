import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const INIT_PLAN = {
  "Mon": [{ id:1, type:"Morning", name:"Oatmeal", cal:320 }, { id:2, type:"Midday", name:"Avocado Toast", cal:450 }],
  "Tue": [{ id:3, type:"Evening", name:"Salmon & Rice", cal:520 }],
  "Wed": [{ id:4, type:"Morning", name:"Protein Blend", cal:250 }],
  "Thu": [], "Fri": [], "Sat": [], "Sun": [],
};

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition:{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

export default function Planner() {
  const [plan, setPlan] = useState(INIT_PLAN);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPlan({
        "Mon": [{ id:1, type:"Morning", name:"Ovo-veg Scramble", cal:350 }, { id:2, type:"Midday", name:"Quinoa Bowl", cal:500 }, { id:3, type:"Evening", name:"Steak & Sweet Potato", cal:650 }],
        "Tue": [{ id:4, type:"Morning", name:"Protein Smoothie", cal:280 }, { id:5, type:"Midday", name:"Turkey Wrap", cal:420 }, { id:6, type:"Evening", name:"Baked Cod", cal:400 }],
        "Wed": [{ id:7, type:"Morning", name:"Greek Yogurt", cal:250 }, { id:8, type:"Midday", name:"Tuna Salad", cal:380 }, { id:9, type:"Evening", name:"Chicken Stir-fry", cal:550 }],
        "Thu": [{ id:10, type:"Morning", name:"Avocado Toast", cal:320 }, { id:11, type:"Midday", name:"Lentil Soup", cal:350 }, { id:12, type:"Evening", name:"Pork Chop & Apples", cal:600 }],
        "Fri": [{ id:13, type:"Morning", name:"Oatmeal", cal:300 }, { id:14, type:"Midday", name:"Chicken Caesar", cal:450 }, { id:15, type:"Evening", name:"Homemade Pizza", cal:700 }],
        "Sat": [{ id:16, type:"Morning", name:"Pancakes", cal:500 }, { id:17, type:"Midday", name:"Leftover Pizza", cal:400 }, { id:18, type:"Evening", name:"Burger & Salad", cal:800 }],
        "Sun": [{ id:19, type:"Morning", name:"Bacon & Eggs", cal:450 }, { id:20, type:"Midday", name:"Caprese Sandwich", cal:400 }, { id:21, type:"Evening", name:"Roast Chicken", cal:600 }],
      });
      setGenerating(false);
    }, 1500);
  };

  const removeMeal = (day, mealId) => {
    setPlan(p => ({ ...p, [day]: p[day].filter(m => m.id !== mealId) }));
  };

  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      <motion.header variants={FADE_UP} className="flex justify-between items-end mb-12">
        <div>
          <h1 className="t-display tracking-tight text-text mb-2">Weekly Plan</h1>
          <p className="t-h3 text-secondary">Schedule and optimize your physiological intake.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="btn-icon" style={{ background:"transparent", boxShadow:"none" }}><ChevronLeft size={18} /></button>
            <span className="t-sm-med text-text" style={{ minWidth: 100, textAlign: "center", letterSpacing: "0.04em" }}>OCT 16 - 22</span>
            <button className="btn-icon" style={{ background:"transparent", boxShadow:"none" }}><ChevronRight size={18} /></button>
          </div>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
            {generating ? "Synthesizing..." : "Auto-fill Sequence"}
          </button>
        </div>
      </motion.header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--sp-4)", minHeight: "calc(100vh - 260px)" }}>
        {DAYS.map((day, idx) => {
          const meals = plan[day];
          const isToday = day === "Wed";
          const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);

          return (
            <motion.div variants={FADE_UP} custom={idx} key={day} className="card p-6 h-full flex-col card-hover" 
              style={{ background: isToday ? "var(--surface-solid)" : "var(--surface)", borderColor: isToday ? "var(--text-secondary)" : "var(--border)" }}>
                
              {/* Day Header */}
              <div className="text-center pb-6 mb-6" style={{ borderBottom: "1px solid var(--border-dark)" }}>
                <h3 className="t-body-med text-text">{day}</h3>
                <p className="t-xs mt-2 text-secondary">{totalCal} / 1850</p>
              </div>

              {/* Meals List */}
              <div className="flex-col gap-4 flex-1 relative">
                <AnimatePresence>
                  {meals.map(meal => (
                    <motion.div key={meal.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="relative group p-4 rounded-md" style={{ background: "var(--bg)", border: "1px solid var(--border-dark)" }}>
                      <div className="t-xs text-secondary mb-2">{meal.type}</div>
                      <div className="t-body-med text-text" style={{ lineHeight: 1.4 }}>{meal.name}</div>
                      <div className="t-sm mt-1 text-muted">{meal.cal} kcal</div>
                      
                      <button className="btn-icon absolute -top-3 -right-3 opacity-0 group-hover:opacity-100" 
                        style={{ background: "var(--surface-solid)", width: 28, height: 28, color: "var(--fat)" }}
                        onClick={() => removeMeal(day, meal.id)}>
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button className="btn btn-ghost w-full mt-auto" style={{ border: "1px dashed var(--border-dark)", padding: "16px", justifyContent: "center", borderRadius: "var(--r-md)" }}>
                  <Plus size={18} />
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>
    </motion.main>
  );
}
