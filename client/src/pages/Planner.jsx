import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const INIT_PLAN = {
  "Mon":[{id:1,type:"Morning",name:"Oatmeal",cal:320,emoji:"🥣"},{id:2,type:"Midday",name:"Avocado Toast",cal:450,emoji:"🥑"}],
  "Tue":[{id:3,type:"Evening",name:"Salmon & Rice",cal:520,emoji:"🐟"}],
  "Wed":[{id:4,type:"Morning",name:"Protein Shake",cal:250,emoji:"🥤"}],
  "Thu":[],"Fri":[],"Sat":[],"Sun":[],
};

export default function Planner() {
  const [plan, setPlan] = useState(INIT_PLAN);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPlan({
        "Mon":[{id:1,type:"Morning",name:"Egg Scramble",cal:350,emoji:"🍳"},{id:2,type:"Midday",name:"Quinoa Bowl",cal:500,emoji:"🥗"},{id:3,type:"Evening",name:"Steak & Potato",cal:650,emoji:"🥩"}],
        "Tue":[{id:4,type:"Morning",name:"Smoothie",cal:280,emoji:"🥤"},{id:5,type:"Midday",name:"Turkey Wrap",cal:420,emoji:"🌯"},{id:6,type:"Evening",name:"Baked Cod",cal:400,emoji:"🐟"}],
        "Wed":[{id:7,type:"Morning",name:"Greek Yogurt",cal:250,emoji:"🫙"},{id:8,type:"Midday",name:"Tuna Salad",cal:380,emoji:"🥗"},{id:9,type:"Evening",name:"Stir-fry",cal:550,emoji:"🥢"}],
        "Thu":[{id:10,type:"Morning",name:"Avocado Toast",cal:320,emoji:"🥑"},{id:11,type:"Midday",name:"Lentil Soup",cal:350,emoji:"🍲"},{id:12,type:"Evening",name:"Pork Chop",cal:600,emoji:"🍖"}],
        "Fri":[{id:13,type:"Morning",name:"Oatmeal",cal:300,emoji:"🥣"},{id:14,type:"Midday",name:"Caesar Salad",cal:450,emoji:"🥗"},{id:15,type:"Evening",name:"Pizza",cal:700,emoji:"🍕"}],
        "Sat":[{id:16,type:"Morning",name:"Pancakes",cal:500,emoji:"🥞"},{id:17,type:"Midday",name:"Burger",cal:650,emoji:"🍔"},{id:18,type:"Evening",name:"Pasta",cal:580,emoji:"🍝"}],
        "Sun":[{id:19,type:"Morning",name:"Bacon & Eggs",cal:450,emoji:"🍳"},{id:20,type:"Midday",name:"Sandwich",cal:400,emoji:"🥪"},{id:21,type:"Evening",name:"Roast Chicken",cal:600,emoji:"🍗"}],
      });
      setGenerating(false);
    }, 1400);
  };

  const remove = (day, id) => setPlan(p => ({...p, [day]: p[day].filter(m=>m.id!==id)}));

  return (
    <main className="page-content">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 300, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>Weekly Planner</h1>
          <p style={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--ink-60)", textTransform: "uppercase", marginTop: 8 }}>Your nutritional schedule layout.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3" style={{ background: "#FFFFFF", padding: "8px 16px", borderRadius: 2, border: "var(--border)", boxShadow: "var(--shadow-card)" }}>
            <button style={{ width: 32, height: 32, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-60)" }}><ChevronLeft size={16}/></button>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Oct 16 – 22</span>
            <button style={{ width: 32, height: 32, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-60)" }}><ChevronRight size={16}/></button>
          </div>
          <button className="cta-btn" onClick={generate} disabled={generating} style={{ height: 50 }}>
            {generating ? "Curating..." : "✨ Auto-fill"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 16, minHeight: "calc(100vh - 200px)" }}>
        {DAYS.map((day, idx) => {
          const meals = plan[day];
          const isToday = day === "Wed";
          const totalCal = meals.reduce((s,m)=>s+m.cal, 0);

          return (
            <div key={day} style={{ display: "flex", flexDirection: "column", padding: 20, background: isToday ? "var(--sage-pale)" : "#FFFFFF", border: isToday ? "1px solid var(--sage)" : "var(--border)", borderRadius: 2, boxShadow: "var(--shadow-card)" }}>
              <div className="text-center pb-4 mb-4" style={{ borderBottom: isToday ? "1px solid var(--sage)" : "1px solid var(--ink-10)" }}>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: isToday ? "var(--sage)" : "var(--ink-60)" }}>{day}</p>
                <p style={{ fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginTop: 4, color: isToday ? "var(--ink)" : "var(--ink-60)" }}>{totalCal}</p>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-30)" }}>kcal</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <AnimatePresence>
                  {meals.map(meal => (
                    <motion.div key={meal.id} initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0, scale:0.9}} transition={{duration:0.4, ease:[0.22,1,0.36,1]}}
                      style={{ position: "relative", padding: "14px", background: "#FFFFFF", border: "1px solid var(--ink-10)", borderRadius: 2, boxShadow: "0 2px 10px rgba(26,22,18,.03)" }}>
                      <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", marginBottom: 6 }}>{meal.type}</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--ink)", lineHeight: 1.3 }}>{meal.emoji} {meal.name}</div>
                      <div style={{ fontSize: "0.75rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 4, color: "var(--ink-60)" }}>{meal.cal} kcal</div>
                      <button onClick={()=>remove(day,meal.id)} style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderRadius: "50%", background: "#FFFFFF", border: "1px solid var(--ink-10)", cursor: "pointer", color: "#c04040", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7 }}>
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button style={{ border: "1px dashed var(--ink-30)", background: "transparent", color: "var(--ink-60)", borderRadius: 2, display: "flex", justifyContent: "center", alignItems: "center", padding: 14, cursor: "pointer", width: "100%", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }} onMouseOut={e => { e.currentTarget.style.borderColor = "var(--ink-30)"; e.currentTarget.style.color = "var(--ink-60)"; }}>
                  <Plus size={16}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
