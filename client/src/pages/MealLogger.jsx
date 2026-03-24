import { useState } from "react";
import { Search, Camera, Plus, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const FOODS = [
  { id:1, name:"Grilled Chicken Breast", desc:"100g", cal:165, p:31, c:0,  f:3.6, emoji:"🍗" },
  { id:2, name:"Brown Rice",             desc:"1 cup",cal:216, p:5,  c:45, f:1.8, emoji:"🍚" },
  { id:3, name:"Avocado",               desc:"½ med", cal:114, p:1,  c:6,  f:10.5, emoji:"🥑" },
  { id:4, name:"Oatmeal",               desc:"1 cup", cal:150, p:5,  c:27, f:3.0, emoji:"🥣" },
  { id:5, name:"Boiled Egg",            desc:"1 large",cal:78, p:6,  c:0.6,f:5.0, emoji:"🥚" },
];

export default function MealLogger() {
  const [type, setType] = useState("Lunch");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(FOODS[0]);
  const [qty, setQty] = useState(1);
  const [log, setLog] = useState([]);
  const [saved, setSaved] = useState(false);

  const filtered = FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const total = log.reduce((a, i) => ({ cal:a.cal+i.cal*i.qty, p:a.p+i.p*i.qty, c:a.c+i.c*i.qty, f:a.f+i.f*i.qty }), {cal:0,p:0,c:0,f:0});
  const add = () => { if(!selected) return; setLog([...log, {...selected, qty, key:Date.now()}]); setQty(1); };
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <main className="page-content">
      <div className="flex justify-between items-center mb-6 fade-up">
        <div>
          <h1 className="t-h1">Diet Log</h1>
          <p className="t-body mt-1">Discover healthy meals, ready in minutes.</p>
        </div>
      </div>

      {/* chip row */}
      <div className="flex gap-3 mb-6 fade-up fade-up-1" style={{ flexWrap:"wrap" }}>
        {MEAL_TYPES.map(t => (
          <button key={t} className={`chip ${type===t?"active":""}`} onClick={()=>setType(t)}>{t}</button>
        ))}
      </div>

      <div className="bento-grid">
        {/* ─── Left: Search ─── */}
        <div style={{ gridColumn:"span 7" }} className="fade-up fade-up-1">
          <div className="card p-6">
            <div className="search-bar mb-5">
              <Search size={18} style={{ color:"var(--text-muted)", flexShrink:0 }} />
              <input placeholder="Search Recipes..." value={search} onChange={e=>setSearch(e.target.value)} />
              <button className="btn-icon" style={{ width:36, height:36 }}><Camera size={16}/></button>
            </div>

            <p className="t-xs mb-3">Results</p>
            <div className="flex-col gap-3">
              {filtered.map(item => (
                <motion.div key={item.id} whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                  onClick={()=>setSelected(item)} className="flex justify-between items-center"
                  style={{
                    padding:"14px 18px", borderRadius:"var(--r-md)", cursor:"pointer",
                    background: selected?.id===item.id ? "var(--primary-light)" : "var(--surface-inset)",
                    boxShadow: selected?.id===item.id ? "none" : "var(--shadow-inset)",
                    transition:"all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize:24 }}>{item.emoji}</span>
                    <div>
                      <div className="t-body-med">{item.name}</div>
                      <div className="t-sm mt-1">{item.desc} • {item.cal} kcal</div>
                    </div>
                  </div>
                  <div className="flex gap-3 t-sm text-muted">
                    <span>P {item.p}g</span><span>C {item.c}g</span><span>F {item.f}g</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right: Entry Builder ─── */}
        <div style={{ gridColumn:"span 5" }} className="flex-col gap-5 fade-up fade-up-2">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div key={selected.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.4, ease:[0.34,1.56,0.64,1]}}
                className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span style={{ fontSize:36 }}>{selected.emoji}</span>
                  <div>
                    <h3 className="t-h3">{selected.name}</h3>
                    <p className="t-sm">{selected.desc}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="t-stat" style={{ fontSize:"3.5rem" }}>{Math.round(selected.cal*qty)}</span>
                  <span className="t-body text-secondary">kcal</span>
                </div>

                <div className="grid-3 mb-6">
                  {[{l:"Protein",v:selected.p,c:"var(--protein)"},{l:"Carbs",v:selected.c,c:"var(--carbs)"},{l:"Fat",v:selected.f,c:"var(--fat)"}].map(m => (
                    <div key={m.l} className="card-inset text-center" style={{ padding:"12px 8px", borderRadius:"var(--r-md)" }}>
                      <div className="t-h3" style={{ color: m.c }}>{Math.round(m.v*qty)}g</div>
                      <div className="t-xs mt-1">{m.l}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 card-inset" style={{ padding:"8px 16px", borderRadius:"var(--r-pill)" }}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setQty(Math.max(0.5,qty-0.5))}>−</button>
                    <span className="t-body-med" style={{ minWidth:30, textAlign:"center" }}>{qty}</span>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setQty(qty+0.5)}>+</button>
                  </div>
                  <button className="btn btn-cta" style={{ flex:1, padding:"14px" }} onClick={add}>
                    <Plus size={16}/> Add Entry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Log */}
          <div className="card p-6" style={{ flex:1 }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="t-h3">{type}</h3>
              <span className="t-body-med" style={{ color:"var(--accent-cta)" }}>{Math.round(total.cal)} kcal</span>
            </div>

            {log.length === 0 ? (
              <div className="card-inset text-center" style={{ padding:"40px 20px", borderRadius:"var(--r-md)" }}>
                <p className="t-body">Nothing added yet 🍽️</p>
              </div>
            ) : (
              <div className="flex-col gap-3">
                <AnimatePresence>
                  {log.map((item, i) => (
                    <motion.div key={item.key} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,scale:0.94}} transition={{duration:0.35, ease:[0.34,1.56,0.64,1]}}
                      className="flex justify-between items-center" style={{ paddingBottom:i<log.length-1?12:0, borderBottom:i<log.length-1?"1px solid var(--bg-alt)":"none" }}>
                      <div>
                        <div className="t-body-med">{item.emoji} {item.name}</div>
                        <div className="t-sm mt-1">{item.qty} × {item.desc}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="t-sm-med" style={{ color:"var(--accent-cta)" }}>{Math.round(item.cal*item.qty)}</span>
                        <button className="btn-icon" style={{ width:32,height:32,background:"rgba(220,76,76,0.08)",boxShadow:"none",color:"#c04040" }} onClick={()=>setLog(l=>l.filter(x=>x.key!==item.key))}>
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button className="btn btn-soft btn-w-full mt-3" style={{ padding:"14px" }} onClick={save} disabled={saved}>
                  {saved ? <span className="flex items-center gap-2" style={{color:"var(--accent-cta)"}}><Check size={16}/> Logged!</span> : "Save Log"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
