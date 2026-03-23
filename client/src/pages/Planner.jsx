import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const INIT_PLAN = {
  "Mon": [{ id:1, type:"Breakfast", name:"Oatmeal", cal:320 }, { id:2, type:"Lunch", name:"Avocado Toast", cal:450 }],
  "Tue": [{ id:3, type:"Dinner", name:"Salmon & Rice", cal:520 }],
  "Wed": [{ id:4, type:"Breakfast", name:"Protein Shake", cal:250 }],
  "Thu": [], "Fri": [], "Sat": [], "Sun": [],
};

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
    <main className="page-content fade-in">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="t-h1 mb-1">Weekly Plan</h1>
          <p className="t-body">Schedule and optimize your meals</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="btn-icon"><ChevronLeft size={16} /></button>
            <span className="t-sm-med text-text">OCT 16 - 22</span>
            <button className="btn-icon"><ChevronRight size={16} /></button>
          </div>
          <button className="btn btn-secondary" onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating..." : "Auto-fill Structure"}
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--sp-4)", minHeight: "calc(100vh - 220px)" }}>
        {DAYS.map((day) => {
          const meals = plan[day];
          const isToday = day === "Wed";
          const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);

          return (
            <div key={day} className="card p-4 h-full flex-col" style={{ background: isToday ? "var(--bg)" : "var(--surface)", borderColor: isToday ? "var(--text-secondary)" : "var(--border)" }}>
                
              {/* Day Header */}
              <div className="text-center pb-4 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <h3 className="t-body-med text-text">{day}</h3>
                <p className="t-xs mt-1 text-secondary">{totalCal} / 1850</p>
              </div>

              {/* Meals List */}
              <div className="flex-col gap-3 flex-1 relative">
                {meals.map(meal => (
                  <div key={meal.id} className="relative group p-3 rounded-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <div className="t-xs text-secondary mb-1">{meal.type}</div>
                    <div className="t-sm-med text-text" style={{ lineHeight: 1.3 }}>{meal.name}</div>
                    <div className="t-xs mt-1 text-muted">{meal.cal} kcal</div>
                    
                    <button className="btn-icon absolute -top-2 -right-2 opacity-0 group-hover:opacity-100" 
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", width: 24, height: 24 }}
                      onClick={() => removeMeal(day, meal.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                
                <button className="btn btn-ghost w-full mt-auto" style={{ border: "1px dashed var(--border)", padding: "12px", justifyContent: "center" }}>
                  <Plus size={16} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </main>
  );
}
