import { useState } from "react";
import { Search, Plus, Trash2, Camera, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "../components/TiltCard";

const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const MOCK_RESULTS = [
  { id:1, name:"Grilled Chicken Breast", portion:"100g", cal:165, p:31, c:0, f:3.6 },
  { id:2, name:"Brown Rice", portion:"1 cup", cal:216, p:5, c:45, f:1.8 },
  { id:3, name:"Avocado", portion:"1/2 medium", cal:114, p:1, c:6, f:10.5 },
];

const STAGGER = { visible: { transition: { staggerChildren: 0.05 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition:{ type:"spring", damping:24, stiffness: 200 } } };

export default function MealLogger() {
  const [type, setType] = useState("Lunch");
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedItem, setSelectedItem] = useState(MOCK_RESULTS[0]);
  const [addedItems, setAddedItems] = useState([]);
  const [saved, setSaved] = useState(false);
  const [burstCoords, setBurstCoords] = useState(null);

  const handleAdd = (e) => {
    if(!selectedItem) return;
    setAddedItems([...addedItems, { ...selectedItem, qty, key: Date.now() }]);
    setQty(1);
    
    // UI Burst Effect coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    setBurstCoords({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTimeout(() => setBurstCoords(null), 800);
  };
  
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const totals = addedItems.reduce((acc, item) => ({
    cal: acc.cal + item.cal * item.qty, p: acc.p + item.p * item.qty,
    c: acc.c + item.c * item.qty,     f: acc.f + item.f * item.qty
  }), { cal:0, p:0, c:0, f:0 });

  return (
    <motion.main initial="hidden" animate="visible" variants={STAGGER} style={{ position: "relative" }}>
      
      {/* ─── The Delight Burst Animation ─── */}
      <AnimatePresence>
        {burstCoords && (
          <motion.div
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: burstCoords.x,
              top: burstCoords.y,
              width: 100, height: 100,
              marginLeft: -50, marginTop: -50,
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 999
            }}
          />
        )}
      </AnimatePresence>

      <motion.header variants={FADE_UP} className="mb-8 pt-4">
         <h1 className="t-display tracking-tighter text-text">Intake <span className="grad-text-primary">Sequencer</span></h1>
      </motion.header>

      <div className="bento-grid">
        
        {/* ─── Left: Search & Select ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 7" }}>
          <TiltCard className="p-8">
            <div className="flex gap-2" style={{ flexWrap:"wrap" }}>
              {MEAL_TYPES.map(t => (
                <button key={t} className={`chip ${type===t?"active":""}`} onClick={()=>setType(t)}>{t}</button>
              ))}
            </div>

            <div className="search-bar mt-8">
              <Search size={20} className="text-secondary" />
              <input placeholder="Query database (e.g., '100g Rice')..." 
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn-icon" style={{ width:40,height:40 }}><Camera size={18}/></button>
            </div>

            <div className="mt-8 flex-col gap-3">
              <p className="t-xs">Frequent Matches</p>
              {MOCK_RESULTS.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-lg cursor-pointer"
                  style={{ 
                    background: selectedItem?.id === item.id ? "rgba(0, 230, 118, 0.1)" : "var(--glass-1)", 
                    border: `1px solid ${selectedItem?.id === item.id ? "var(--primary)" : "var(--glass-border)"}`, 
                    transition: "all .3s var(--ease-expo)" 
                  }}
                  onClick={() => setSelectedItem(item)}>
                  <div>
                    <div className="t-sm-med text-text">{item.name}</div>
                    <div className="t-xs mt-1">{item.portion} • {item.cal} kcal</div>
                  </div>
                  <div className="flex gap-3 t-xs">
                    <span className="text-protein">{item.p}g P</span>
                    <span className="text-carbs">{item.c}g C</span>
                    <span className="text-fat">{item.f}g F</span>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </motion.div>

        {/* ─── Right: Multi-Item Builder ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 5" }} className="flex-col gap-6">
          
          <AnimatePresence mode="wait">
            {selectedItem && (
              <TiltCard key="builder" className="p-8" style={{ background: "rgba(0,0,0,0.4)" }}>
                <h3 className="t-h2 text-text">{selectedItem.name}</h3>
                <p className="t-sm text-secondary mb-8">{selectedItem.portion} per serving</p>
                
                <div className="flex justify-between items-baseline mb-8">
                  <span className="t-stat text-primary">{Math.round(selectedItem.cal * qty)}</span>
                  <span className="t-sm-med text-secondary">kcal</span>
                </div>
                
                <div className="grid-3 mb-8">
                  {[
                    { label:"Protein", val:selectedItem.p, color:"var(--protein)" },
                    { label:"Carbs", val:selectedItem.c, color:"var(--carbs)" },
                    { label:"Fat", val:selectedItem.f, color:"var(--fat)" }
                  ].map(m => (
                    <div key={m.label} style={{ background:"var(--glass-2)", padding:16, borderRadius:16, border:"1px solid var(--glass-border)", textAlign:"center", boxShadow: `inset 0 -2px 10px ${m.color}20` }}>
                      <div className="t-h2" style={{ color: m.color }}>{Math.round(m.val * qty)}g</div>
                      <div className="t-xs mt-2">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 p-2 rounded-pill" style={{ background:"var(--glass-1)", border:"1px solid var(--glass-border)", borderRadius:"var(--r-pill)" }}>
                    <button className="btn-icon" style={{width:40,height:40}} onClick={()=>setQty(Math.max(.5, qty-.5))}>-</button>
                    <span className="t-h3 text-text" style={{ width:32, textAlign:"center" }}>{qty}</span>
                    <button className="btn-icon" style={{width:40,height:40}} onClick={()=>setQty(qty+.5)}>+</button>
                  </div>
                  <button className="btn btn-neon" style={{ flex: 1, padding: "20px" }} onClick={handleAdd}>
                    <Plus size={18}/> Commit to Sequence
                  </button>
                </div>
              </TiltCard>
            )}
          </AnimatePresence>

          {/* ─── Added Items List ─── */}
          <TiltCard className="p-8" style={{ flex: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="t-h3 text-text">{type} Output</h3>
              <span className="badge badge-green">{Math.round(totals.cal)} kcal</span>
            </div>
            
            {addedItems.length === 0 ? (
              <div className="t-sm text-secondary text-center" style={{ padding:"60px 0", border:"1px dashed var(--glass-border)", borderRadius:"var(--r-md)" }}>
                Awaiting entity selection.
              </div>
            ) : (
              <div className="flex-col gap-4">
                <AnimatePresence>
                  {addedItems.map((item, i) => (
                    <motion.div key={item.key} 
                      initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, scale:0.9 }}
                      className="flex justify-between items-center" style={{ borderBottom: i<addedItems.length-1?"1px solid var(--glass-border)":"none", paddingBottom: i<addedItems.length-1?16:0 }}>
                      <div>
                        <div className="t-body-med text-text">{item.name}</div>
                        <div className="t-xs mt-1">{item.qty} x {item.portion} • {Math.round(item.cal*item.qty)} kcal</div>
                      </div>
                      <button className="btn-icon" style={{ width:40,height:40,border:"none",background:"rgba(255, 23, 68, 0.1)", color:"var(--fat)" }}
                        onClick={()=>setAddedItems(items=>items.filter(x=>x.key!==item.key))}>
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button className="btn btn-secondary btn-w-full mt-6" style={{ padding: "16px" }} onClick={handleSave} disabled={saved}>
                  {saved ? <span className="text-primary flex items-center justify-center gap-2 t-h3"><CheckCircle2 size={20}/> Sequence Logged</span> : "Finalize Sequence"}
                </button>
              </div>
            )}
          </TiltCard>
        </motion.div>
      </div>
    </motion.main>
  );
}
