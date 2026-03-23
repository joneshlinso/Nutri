import { useState } from "react";
import { Plus, Sparkles, ChevronLeft, ChevronRight, GripVertical, Trash2 } from "lucide-react";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const COLORS = {
  Breakfast:["#F5A623","#FFF3E0"],
  Lunch:    ["#4A90D9","#E3F2FD"],
  Dinner:   ["#3A7D44","#E8F5E9"],
  Snack:    ["#9C6B98","#F3E5F5"],
};

const INITIAL_PLAN = {
  0: [
    { id:1,type:"Breakfast",name:"Oatmeal & Eggs",cal:480 },
    { id:2,type:"Lunch",    name:"Chicken Salad",  cal:520 },
    { id:3,type:"Dinner",   name:"Salmon & Rice",  cal:620 },
  ],
  1: [
    { id:4,type:"Breakfast",name:"Avocado Toast",  cal:390 },
    { id:5,type:"Lunch",    name:"Turkey Wrap",    cal:480 },
  ],
  2: [{ id:6,type:"Breakfast",name:"Greek Yogurt Bowl",cal:320 }],
  3: [
    { id:7,type:"Lunch",  name:"Quinoa Bowl",    cal:510 },
    { id:8,type:"Dinner", name:"Stir-Fry Tofu",  cal:440 },
  ],
  4: [],
  5: [
    { id:9, type:"Breakfast",name:"Pancakes",       cal:450 },
    { id:10,type:"Snack",    name:"Fruit & Nuts",   cal:230 },
  ],
  6: [{ id:11,type:"Dinner",name:"Pasta Primavera",cal:580 }],
};

export default function Planner() {
  const [plan, setPlan] = useState(INITIAL_PLAN);
  const [weekOffset, setWeekOffset] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const today = new Date();
  const mondayOfWeek = new Date(today);
  mondayOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const dayDate = (i) => {
    const d = new Date(mondayOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  };

  const isToday = (i) => {
    const d = dayDate(i);
    return d.toDateString() === today.toDateString();
  };

  const removeItem = (day, id) => {
    setPlan(p => ({ ...p, [day]: p[day].filter(m => m.id !== id) }));
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  const dayCalories = (day) => plan[day]?.reduce((a,m) => a + m.cal, 0) || 0;

  return (
    <main className="page-content" style={{ background:"var(--bg)", minHeight:"100vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="t-h1">Weekly Planner</h1>
          <p className="t-sm text-muted">Drag & drop meals to rearrange your week</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Week nav */}
          <div className="flex items-center gap-2">
            <button className="btn-icon" onClick={() => setWeekOffset(w => w-1)}><ChevronLeft size={16}/></button>
            <span className="t-sm-med">{weekOffset === 0 ? "This Week" : weekOffset > 0 ? `+${weekOffset}w` : `${weekOffset}w`}</span>
            <button className="btn-icon" onClick={() => setWeekOffset(w => w+1)}><ChevronRight size={16}/></button>
          </div>
          <button className="btn btn-primary flex items-center gap-2" onClick={handleGenerate} disabled={generating}>
            <Sparkles size={16} />
            {generating ? "Generating…" : generated ? "Re-generate" : "AI Generate Week"}
          </button>
        </div>
      </div>

      {/* AI generation toast */}
      {generated && (
        <div className="card-gradient p-4 mb-6 scale-in flex items-center gap-3" style={{ borderLeft:"3px solid var(--primary)" }}>
          <Sparkles size={20} style={{ color:"var(--primary)" }} />
          <div>
            <p className="t-sm-med">AI meal plan generated!</p>
            <p className="t-xs text-muted">Balanced for your 1,850 kcal goal • High protein • Low sugar</p>
          </div>
        </div>
      )}

      {/* Week grid */}
      <div className="week-grid">
        {DAYS.map((day, i) => (
          <div key={day} className={`day-col ${isToday(i) ? "today" : ""}`}>
            {/* Day header */}
            <div style={{ textAlign:"center", marginBottom:12 }}>
              <div className="t-xs text-muted" style={{ textTransform:"uppercase", letterSpacing:".07em" }}>{day}</div>
              <div style={{
                width:28,height:28,borderRadius:"50%",margin:"4px auto 0",
                background: isToday(i) ? "var(--primary)" : "transparent",
                color: isToday(i) ? "#fff" : "var(--text)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:".8125rem",fontWeight:600
              }}>
                {dayDate(i).getDate()}
              </div>
              {dayCalories(i) > 0 && (
                <div className="t-xs text-muted mt-1">{dayCalories(i)} kcal</div>
              )}
            </div>

            {/* Meals */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {(plan[i] || []).map(meal => {
                const [dotColor, bgColor] = COLORS[meal.type] || ["#9AB59A","#F4F8F4"];
                return (
                  <div key={meal.id} className="meal-pill flex items-center gap-1"
                    style={{ background:bgColor, borderLeft:`3px solid ${dotColor}`, display:"flex", alignItems:"center", gap:6, cursor:"grab" }}>
                    <GripVertical size={12} style={{ color:"#ccc", flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:".7rem", fontWeight:600, color:dotColor, textTransform:"uppercase" }}>{meal.type}</div>
                      <div style={{ fontSize:".75rem", fontWeight:500, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{meal.name}</div>
                      <div style={{ fontSize:".7rem", color:"var(--text-muted)" }}>{meal.cal} kcal</div>
                    </div>
                    <button style={{ background:"none",border:"none",cursor:"pointer",color:"var(--error)",opacity:.5,padding:2,flexShrink:0 }}
                      onClick={() => removeItem(i, meal.id)}>
                      <Trash2 size={11}/>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add button */}
            <button
              style={{ width:"100%",marginTop:8,padding:"6px",border:"1.5px dashed var(--border)",borderRadius:"var(--r-sm)",background:"none",cursor:"pointer",color:"var(--text-muted)",fontSize:".75rem",display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}
              onClick={() => {}}
            >
              <Plus size={12}/> Add
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
