import { useState } from "react";
import { Search, Trash2, Camera, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const MOCK_RESULTS = [
  { id:1, name:"Grilled Chicken Breast", portion:"100g", cal:165, p:31, c:0, f:3.6 },
  { id:2, name:"Brown Rice", portion:"1 cup", cal:216, p:5, c:45, f:1.8 },
  { id:3, name:"Avocado", portion:"1/2 medium", cal:114, p:1, c:6, f:10.5 },
];

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition:{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

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
      
      <motion.header variants={FADE_UP} className="mb-12">
         <h1 className="t-display tracking-tight text-text mb-2">Log Entry</h1>
         <p className="t-h3 text-secondary">Record an intake metric to your daily telemetry.</p>
      </motion.header>

      <div className="bento-grid">
        
        {/* ─── Search & Select ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 7" }}>
          <div className="card p-10 card-hover">
            <div className="flex gap-2 mb-8" style={{ flexWrap:"wrap" }}>
              {MEAL_TYPES.map(t => (
                <button key={t} className={`chip ${type===t?"active":""}`} onClick={()=>setType(t)}>{t}</button>
              ))}
            </div>

            <div className="search-bar mb-8">
              <Search size={18} className="text-secondary" />
              <input placeholder="Search entities (e.g., '100g Rice')..." 
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn-icon" style={{ background: "transparent", border: "none" }}><Camera size={16}/></button>
            </div>

            <div className="flex-col gap-2">
              <p className="t-xs mb-4">Frequent Results</p>
              {MOCK_RESULTS.map(item => (
                <div key={item.id} className="flex justify-between items-center p-5 rounded-md cursor-pointer"
                  style={{ 
                    background: selectedItem?.id === item.id ? "var(--primary-light)" : "var(--surface-solid)",
                    border: `1px solid ${selectedItem?.id === item.id ? "rgba(59, 95, 74, 0.2)" : "var(--border-dark)"}`, 
                    transition: "var(--transit)"
                  }}
                  onClick={() => setSelectedItem(item)}>
                  <div>
                    <div className="t-body-med text-text">{item.name}</div>
                    <div className="t-sm mt-1 text-secondary">{item.portion} • {item.cal} kcal</div>
                  </div>
                  <div className="flex gap-4 t-sm-med text-secondary">
                    <span>{item.p}g P</span>
                    <span>{item.c}g C</span>
                    <span>{item.f}g F</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Builder & Log ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 5" }} className="flex-col gap-6">
          
          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div key="builder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="card p-10" style={{ background: "var(--surface-solid)" }}>
                <h3 className="t-h3">{selectedItem.name}</h3>
                <p className="t-sm text-secondary mb-8">{selectedItem.portion} per serving</p>
                
                <div className="flex justify-between items-baseline mb-8">
                  <span className="t-stat">{Math.round(selectedItem.cal * qty)}</span>
                  <span className="t-body-med text-secondary">kcal</span>
                </div>
                
                <div className="grid-3 mb-10">
                  {[
                    { label:"Protein", val:selectedItem.p },
                    { label:"Carbs", val:selectedItem.c },
                    { label:"Fat", val:selectedItem.f }
                  ].map(m => (
                    <div key={m.label} style={{ background:"var(--bg)", padding:16, borderRadius:"var(--r-md)", textAlign:"center", border: "1px solid var(--border-dark)" }}>
                      <div className="t-h2 text-text mb-2">{Math.round(m.val * qty)}g</div>
                      <div className="t-xs text-muted">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 p-2 rounded-pill" style={{ border:"1px solid var(--border-dark)", background:"var(--bg)" }}>
                    <button className="btn-icon" style={{ background: "transparent", boxShadow: "none" }} onClick={()=>setQty(Math.max(.5, qty-.5))}>-</button>
                    <span className="t-h3 text-text" style={{ width:32, textAlign:"center" }}>{qty}</span>
                    <button className="btn-icon" style={{ background: "transparent", boxShadow: "none" }} onClick={()=>setQty(qty+.5)}>+</button>
                  </div>
                  <button className="btn btn-primary" style={{ flex: 1, padding: "16px" }} onClick={handleAdd}>
                    Add Record
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Added List */}
          <div className="card p-10 card-hover" style={{ flex: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="t-xs">{type} Summary</h3>
              <span className="t-body-med text-text">{Math.round(totals.cal)} kcal</span>
            </div>
            
            {addedItems.length === 0 ? (
              <div className="t-sm text-secondary text-center" style={{ padding:"60px 0", border:"1px dashed var(--border-dark)", borderRadius:"var(--r-md)" }}>
                No entities logged yet.
              </div>
            ) : (
              <div className="flex-col gap-4">
                <AnimatePresence>
                  {addedItems.map((item, i) => (
                    <motion.div key={item.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex justify-between items-center" style={{ borderBottom: i<addedItems.length-1?"1px solid var(--border-dark)":"none", paddingBottom: i<addedItems.length-1?16:0 }}>
                      <div>
                        <div className="t-body-med text-text mb-1">{item.name}</div>
                        <div className="t-sm text-secondary">{item.qty} x {item.portion} • {Math.round(item.cal*item.qty)} kcal</div>
                      </div>
                      <button className="btn-icon" onClick={()=>setAddedItems(items=>items.filter(x=>x.key!==item.key))} style={{ background: "rgba(155, 122, 117, 0.05)", border: "none", color: "var(--fat)" }}>
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button className="btn btn-secondary w-full mt-8" style={{ padding: "16px" }} onClick={handleSave} disabled={saved}>
                  {saved ? <span className="flex items-center justify-center gap-2 text-primary"><Check size={18}/> Processed</span> : "Commit Sequence"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
