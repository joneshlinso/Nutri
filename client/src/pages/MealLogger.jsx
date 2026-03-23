import { useState } from "react";
import { Search, Plus, Trash2, Camera, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const MOCK_RESULTS = [
  { id:1, name:"Grilled Chicken Breast", portion:"100g", cal:165, p:31, c:0, f:3.6 },
  { id:2, name:"Brown Rice", portion:"1 cup", cal:216, p:5, c:45, f:1.8 },
  { id:3, name:"Avocado", portion:"1/2 medium", cal:114, p:1, c:6, f:10.5 },
];

const STAGGER = { visible: { transition: { staggerChildren: 0.05 } } };
const FADE_UP = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition:{ type:"spring", bounce:0 } } };

export default function MealLogger() {
  const [type, setType] = useState("Lunch");
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedItem, setSelectedItem] = useState(MOCK_RESULTS[0]);
  const [addedItems, setAddedItems] = useState([]);
  const [saved, setSaved] = useState(false);

  const handleAdd = () => {
    if(!selectedItem) return;
    setAddedItems([...addedItems, { ...selectedItem, qty, key: Date.now() }]);
    setQty(1);
  };
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const totals = addedItems.reduce((acc, item) => ({
    cal: acc.cal + item.cal * item.qty, p: acc.p + item.p * item.qty,
    c: acc.c + item.c * item.qty,     f: acc.f + item.f * item.qty
  }), { cal:0, p:0, c:0, f:0 });

  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      <motion.h1 variants={FADE_UP} className="t-h1 mb-6">Log <span className="grad-text">Meal</span></motion.h1>

      <div className="bento-grid">
        
        {/* ─── Left: Search & Select ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 7" }} className="flex-col gap-6">
          <div className="card p-6">
            <div className="flex gap-2" style={{ flexWrap:"wrap" }}>
              {MEAL_TYPES.map(t => (
                <button key={t} className={`chip ${type===t?"active":""}`} onClick={()=>setType(t)}>{t}</button>
              ))}
            </div>

            <div className="search-bar mt-6">
              <Search size={18} className="text-muted" />
              <input placeholder="Search foods, brands, or recipes..." 
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn-icon" style={{ width:34,height:34 }}><Camera size={16}/></button>
            </div>

            <div className="mt-6 flex-col gap-2">
              <p className="t-xs text-muted mb-2" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Quick Results</p>
              {MOCK_RESULTS.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-lg cursor-pointer"
                  style={{ background: selectedItem?.id === item.id ? "var(--surface-active)" : "var(--surface)", border: `1px solid ${selectedItem?.id === item.id ? "var(--primary)" : "var(--border)"}`, transition: "all .2s" }}
                  onClick={() => setSelectedItem(item)}>
                  <div>
                    <div className="t-sm-med">{item.name}</div>
                    <div className="t-xs text-muted">{item.portion} • {item.cal} kcal</div>
                  </div>
                  <div className="flex gap-3 t-xs">
                    <span className="text-protein">{item.p}g P</span>
                    <span className="text-carbs">{item.c}g C</span>
                    <span className="text-fat">{item.f}g F</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Right: Multi-Item Builder ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 5" }} className="flex-col gap-6">
          
          {selectedItem && (
            <div className="card-dark p-6">
              <h3 className="t-h3">{selectedItem.name}</h3>
              <p className="t-sm text-muted mb-6">{selectedItem.portion} per serving</p>
              
              <div className="flex justify-between items-center mb-6">
                <span className="t-stat text-primary">{Math.round(selectedItem.cal * qty)}</span>
                <span className="t-sm text-muted">kcal</span>
              </div>
              
              <div className="grid-3 mb-6">
                {[
                  { label:"Protein", val:selectedItem.p, color:"text-protein" },
                  { label:"Carbs", val:selectedItem.c, color:"text-carbs" },
                  { label:"Fat", val:selectedItem.f, color:"text-fat" }
                ].map(m => (
                  <div key={m.label} style={{ background:"rgba(255,255,255,0.03)", padding:12, borderRadius:12, border:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
                    <div className={`t-h3 ${m.color}`}>{Math.round(m.val * qty)}g</div>
                    <div className="t-xs text-muted mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-surface p-2 rounded-pill" style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-pill)" }}>
                  <button className="btn-icon" style={{width:32,height:32}} onClick={()=>setQty(Math.max(.5, qty-.5))}>-</button>
                  <span className="t-sm-med" style={{ width:24, textAlign:"center" }}>{qty}</span>
                  <button className="btn-icon" style={{width:32,height:32}} onClick={()=>setQty(qty+.5)}>+</button>
                </div>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>
                  <Plus size={16}/> Add to Meal
                </button>
              </div>
            </div>
          )}

          {/* Added Items List */}
          <div className="card p-6" style={{ flex: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="t-h3">{type} Summary</h3>
              <span className="badge badge-green">{Math.round(totals.cal)} kcal</span>
            </div>
            
            {addedItems.length === 0 ? (
              <div className="t-sm text-muted text-center" style={{ padding:"40px 0", border:"1px dashed var(--border)", borderRadius:"var(--r-md)" }}>
                Start adding foods to build your meal.
              </div>
            ) : (
              <div className="flex-col gap-3">
                {addedItems.map((item, i) => (
                  <div key={item.key} className="flex justify-between items-center" style={{ borderBottom: i<addedItems.length-1?"1px solid var(--border)":"none", paddingBottom: i<addedItems.length-1?12:0 }}>
                    <div>
                      <div className="t-sm-med">{item.name}</div>
                      <div className="t-xs text-muted">{item.qty} x {item.portion} • {Math.round(item.cal*item.qty)} kcal</div>
                    </div>
                    <button className="btn-icon text-error" style={{ width:32,height:32,border:"none",background:"none" }}
                      onClick={()=>setAddedItems(items=>items.filter(x=>x.key!==item.key))}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                <button className="btn btn-secondary btn-w-full mt-6" onClick={handleSave} disabled={saved}>
                  {saved ? <span className="text-success flex items-center gap-2"><CheckCircle2 size={16}/> Saved to Diary</span> : "Save Meal"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
