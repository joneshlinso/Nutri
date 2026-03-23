import { useState } from "react";
import { Search, Barcode, ChevronRight, X, Plus, Check, Beef, Apple, Wheat, Droplet } from "lucide-react";

const SUGGESTIONS = [
  { id:1, name:"Grilled Chicken Breast",brand:"Generic",cal:165,protein:31,carbs:0,fat:3.6,per:"100g" },
  { id:2, name:"Brown Rice (cooked)",    brand:"Generic",cal:112,protein:2.6,carbs:23.5,fat:0.9,per:"100g" },
  { id:3, name:"Whole Egg",             brand:"Generic",cal:71, protein:6, carbs:0.4,fat:5,per:"1 egg" },
  { id:4, name:"Banana",                brand:"Generic",cal:89, protein:1.1,carbs:23,fat:0.3,per:"1 medium" },
  { id:5, name:"Greek Yogurt (full fat)",brand:"Chobani",cal:100,protein:17,carbs:6,fat:0.7,per:"170g" },
  { id:6, name:"Avocado",               brand:"Generic",cal:160,protein:2,carbs:9,fat:15,per:"1 medium" },
  { id:7, name:"Salmon Fillet",         brand:"Generic",cal:208,protein:20,carbs:0,fat:13,per:"100g" },
  { id:8, name:"Almond Milk (unsweetened)",brand:"Almond Breeze",cal:30,protein:1,carbs:1,fat:2.5,per:"1 cup" },
];
const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];

export default function MealLogger() {
  const [query, setQuery] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [saved, setSaved] = useState(false);

  const filtered = query.length > 1
    ? SUGGESTIONS.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS;

  const scaled = selected ? {
    cal:     Math.round(selected.cal     * qty),
    protein: +(selected.protein * qty).toFixed(1),
    carbs:   +(selected.carbs   * qty).toFixed(1),
    fat:     +(selected.fat     * qty).toFixed(1),
  } : null;

  const handleAdd = () => {
    if (!selected) return;
    setAdded(prev => [...prev, { ...selected, qty, ...scaled }]);
    setSelected(null);
    setQuery("");
    setQty(1);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <main className="page-content" style={{ background:"var(--bg)", minHeight:"100vh" }}>
      <h1 className="t-h1 mb-2">Log a Meal</h1>
      <p className="t-sm text-muted mb-6">Search food, scan a barcode, or create a custom entry</p>

      {/* Meal type chips */}
      <div className="flex gap-2 mb-6" style={{ flexWrap:"wrap" }}>
        {MEAL_TYPES.map(t => (
          <button key={t} className={`chip ${mealType===t?"active":""}`} onClick={() => setMealType(t)}>{t}</button>
        ))}
      </div>

      {/* Search row */}
      <div className="flex gap-3 mb-4" style={{ alignItems:"center" }}>
        <div className="search-bar" style={{ flex:1 }}>
          <Search size={18} style={{ color:"var(--text-muted)", flexShrink:0 }} />
          <input
            placeholder="Search food or brand…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(null); }}
          />
          {query && <button style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)" }} onClick={() => setQuery("")}><X size={14}/></button>}
        </div>
        <button className="btn btn-secondary flex items-center gap-2" onClick={() => setShowScanner(s=>!s)}>
          <Barcode size={18} /> Scan
        </button>
      </div>

      {/* Barcode scanner UI */}
      {showScanner && (
        <div className="card mb-4 p-6 text-center scale-in">
          <div style={{ width:"100%", height:180, border:"2px dashed var(--primary)", borderRadius:"var(--r-md)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"var(--primary-glow)", marginBottom:16 }}>
            <Barcode size={48} style={{ color:"var(--primary)", marginBottom:8 }} />
            <p className="t-sm text-muted">Align barcode in frame</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowScanner(false)}>Cancel</button>
        </div>
      )}

      <div className="grid-2" style={{ gap:"var(--sp-4)", alignItems:"start" }}>
        {/* ─── Search Results ─── */}
        <div>
          <p className="t-xs text-muted mb-3" style={{ textTransform:"uppercase", letterSpacing:".05em" }}>Food Database</p>
          <div className="flex-col gap-2" style={{ display:"flex" }}>
            {filtered.map(food => (
              <button key={food.id}
                onClick={() => { setSelected(food); setQty(1); }}
                style={{
                  background: selected?.id===food.id ? "var(--primary-glow)" : "var(--surface)",
                  border: `1.5px solid ${selected?.id===food.id ? "var(--primary)" : "var(--border)"}`,
                  borderRadius:"var(--r-md)", padding:"12px 16px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:12, textAlign:"left", transition:"all .2s"
                }}
              >
                <div style={{ width:36,height:36,borderRadius:"var(--r-sm)",background:selected?.id===food.id?"var(--primary)":"var(--surface-2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Apple size={18} style={{ color:selected?.id===food.id?"#fff":"var(--text-muted)" }} />
                </div>
                <div style={{ flex:1 }}>
                  <div className="t-sm-med">{food.name}</div>
                  <div className="t-xs text-muted">{food.brand} • {food.cal} kcal / {food.per}</div>
                </div>
                <ChevronRight size={16} style={{ color:"var(--text-muted)" }} />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Right panel ─── */}
        <div>
          {selected ? (
            <div className="card p-6 scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="t-h3">{selected.name}</h3>
                <button style={{ background:"none",border:"none",cursor:"pointer" }} onClick={() => setSelected(null)}>
                  <X size={18} style={{ color:"var(--text-muted)" }} />
                </button>
              </div>
              <p className="t-xs text-muted mb-4">{selected.brand} • per {selected.per}</p>

              {/* Portion selector */}
              <div className="input-wrap mb-4">
                <label className="input-label">Quantity</label>
                <div className="flex items-center gap-3">
                  <button className="btn-icon" onClick={() => setQty(q => Math.max(0.5, q - 0.5))}>−</button>
                  <input className="input" type="number" min="0.5" step="0.5"
                    value={qty} onChange={e => setQty(+e.target.value)}
                    style={{ textAlign:"center", fontWeight:700 }} />
                  <button className="btn-icon" onClick={() => setQty(q => q + 0.5)}>+</button>
                </div>
              </div>

              {/* Nutrition preview */}
              <div className="card-gradient p-4 mb-4" style={{ borderRadius:"var(--r-md)" }}>
                <p className="t-xs text-muted mb-3" style={{ textTransform:"uppercase", letterSpacing:".05em" }}>Nutrition Preview</p>
                <div className="grid-2" style={{ gap:12 }}>
                  {[
                    { icon:Beef,    label:"Calories", value:`${scaled.cal} kcal`, color:"var(--primary)" },
                    { icon:Beef,    label:"Protein",  value:`${scaled.protein}g`,  color:"var(--protein)" },
                    { icon:Wheat,   label:"Carbs",    value:`${scaled.carbs}g`,    color:"var(--carbs)" },
                    { icon:Droplet, label:"Fat",      value:`${scaled.fat}g`,      color:"var(--fat)" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:"1.25rem", fontWeight:700, color }}>{value}</div>
                      <div className="t-xs text-muted">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-w-full" onClick={handleAdd}>
                <Plus size={16} /> Add to {mealType}
              </button>
            </div>
          ) : (
            <div className="card p-6" style={{ textAlign:"center", opacity:.6 }}>
              <Search size={40} style={{ color:"var(--text-muted)", margin:"0 auto 12px" }} />
              <p className="t-sm text-muted">Select a food to see nutrition details</p>
            </div>
          )}

          {/* ─── Added items ─── */}
          {added.length > 0 && (
            <div className="card p-4 mt-4 scale-in">
              <p className="t-sm-med mb-3">Added to {mealType}</p>
              <div className="flex-col gap-2" style={{ display:"flex" }}>
                {added.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="t-xs-med" style={{ fontWeight:500 }}>{item.name}</div>
                      <div className="t-xs text-muted">×{item.qty} • {item.cal} kcal</div>
                    </div>
                    <button style={{ background:"none",border:"none",cursor:"pointer",color:"var(--error)" }}
                      onClick={() => setAdded(a => a.filter((_,j) => j!==i))}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:"1px solid var(--border)", marginTop:12, paddingTop:12 }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="t-sm-med">Total Calories</span>
                  <span style={{ fontWeight:700, color:"var(--primary)" }}>
                    {added.reduce((a,b) => a+b.cal, 0)} kcal
                  </span>
                </div>
                <button className="btn btn-primary btn-w-full" onClick={handleSave}>
                  {saved ? <><Check size={16} /> Saved!</> : "Save Meal"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
