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
      <div className="flex justify-between items-center mb-6 fade-up">
        <div>
          <h1 className="t-h1">Weekly Planner</h1>
          <p className="t-body mt-1">Your nutritional schedule for the week.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 card" style={{ padding:"8px 16px" }}>
            <button className="btn-icon" style={{ width:32,height:32,background:"transparent",boxShadow:"none" }}><ChevronLeft size={16}/></button>
            <span className="t-sm-med">Oct 16 – 22</span>
            <button className="btn-icon" style={{ width:32,height:32,background:"transparent",boxShadow:"none" }}><ChevronRight size={16}/></button>
          </div>
          <button className="btn btn-cta" onClick={generate} disabled={generating}>
            {generating ? "Generating..." : "✨ Auto-fill"}
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"var(--sp-3)", minHeight:"calc(100vh - 200px)" }} className="fade-up fade-up-1">
        {DAYS.map((day, idx) => {
          const meals = plan[day];
          const isToday = day === "Wed";
          const totalCal = meals.reduce((s,m)=>s+m.cal, 0);

          return (
            <div key={day} className="card flex-col p-4"
              style={{ background: isToday ? "var(--primary-light)" : "var(--surface)" }}>
              <div className="text-center pb-4 mb-4" style={{ borderBottom:"1px solid var(--bg-alt)" }}>
                <p className="t-xs">{day}</p>
                <p className="t-sm-med mt-1" style={{ color: isToday?"var(--accent-cta)":"var(--text-secondary)" }}>{totalCal}</p>
              </div>

              <div className="flex-col gap-3" style={{ flex:1 }}>
                <AnimatePresence>
                  {meals.map(meal => (
                    <motion.div key={meal.id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{duration:0.35, ease:[0.34,1.56,0.64,1]}}
                      className="relative group card-inset" style={{ padding:"10px 12px", borderRadius:"var(--r-md)" }}>
                      <div className="t-xs mb-1">{meal.type}</div>
                      <div className="t-sm-med" style={{ lineHeight:1.3 }}>{meal.emoji} {meal.name}</div>
                      <div className="t-xs mt-1 text-muted">{meal.cal} kcal</div>
                      <button onClick={()=>remove(day,meal.id)} style={{ position:"absolute", top:-8,right:-8, width:22,height:22, borderRadius:"50%", background:"var(--surface)", border:"none", cursor:"pointer", display:"none", color:"#c04040", fontSize:14, alignItems:"center",justifyContent:"center" }} className="group-hover:flex">
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button className="btn btn-ghost btn-w-full" style={{ border:"1px dashed var(--bg-alt)", borderRadius:"var(--r-md)", justifyContent:"center", padding:"10px" }}>
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
