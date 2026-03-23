import { useState } from "react";
import { Search, Plus, Trash2, Camera, Check } from "lucide-react";

const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const MOCK_RESULTS = [
  { id:1, name:"Grilled Chicken Breast", portion:"100g", cal:165, p:31, c:0, f:3.6 },
  { id:2, name:"Brown Rice", portion:"1 cup", cal:216, p:5, c:45, f:1.8 },
  { id:3, name:"Avocado", portion:"1/2 medium", cal:114, p:1, c:6, f:10.5 },
];

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
    <main className="page-content fade-in">
      
      <header className="mb-12">
         <h1 className="t-h1 mb-1">Log Entry</h1>
         <p className="t-body">Record your nutrition telemetry</p>
      </header>

      <div className="bento-grid">
        
        {/* ─── Search & Select ─── */}
        <div style={{ gridColumn: "span 7" }}>
          <div className="card p-8">
            <div className="flex gap-2" style={{ flexWrap:"wrap" }}>
              {MEAL_TYPES.map(t => (
                <button key={t} className={`chip ${type===t?"active":""}`} onClick={()=>setType(t)}>{t}</button>
              ))}
            </div>

            <div className="search-bar mt-8">
              <Search size={18} className="text-secondary" />
              <input placeholder="Search foods or barcode..." 
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn-icon"><Camera size={16}/></button>
            </div>

            <div className="mt-8 flex-col gap-2">
              <p className="t-xs mb-2">Recent & Frequent</p>
              {MOCK_RESULTS.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-sm cursor-pointer"
                  style={{ 
                    background: selectedItem?.id === item.id ? "var(--surface)" : "transparent",
                    border: `1px solid ${selectedItem?.id === item.id ? "var(--text-secondary)" : "var(--border)"}`, 
                    transition: "var(--transit)"
                  }}
                  onClick={() => setSelectedItem(item)}>
                  <div>
                    <div className="t-sm-med text-text">{item.name}</div>
                    <div className="t-xs mt-1 text-secondary">{item.portion} • {item.cal} kcal</div>
                  </div>
                  <div className="flex gap-4 t-xs text-secondary">
                    <span>{item.p}g P</span>
                    <span>{item.c}g C</span>
                    <span>{item.f}g F</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Builder & Log ─── */}
        <div style={{ gridColumn: "span 5" }} className="flex-col gap-6">
          
          {selectedItem && (
            <div className="card p-8" style={{ background: "var(--bg)" }}>
              <h3 className="t-h3">{selectedItem.name}</h3>
              <p className="t-sm text-secondary mb-6">{selectedItem.portion} per serving</p>
              
              <div className="flex justify-between items-baseline mb-8">
                <span className="t-stat">{Math.round(selectedItem.cal * qty)}</span>
                <span className="t-sm-med text-secondary">kcal</span>
              </div>
              
              <div className="grid-3 mb-8">
                {[
                  { label:"Protein", val:selectedItem.p },
                  { label:"Carbs", val:selectedItem.c },
                  { label:"Fat", val:selectedItem.f }
                ].map(m => (
                  <div key={m.label} style={{ background:"var(--surface)", padding:16, borderRadius:"var(--r-sm)", border:"1px solid var(--border)", textAlign:"center" }}>
                    <div className="t-h2 text-text">{Math.round(m.val * qty)}g</div>
                    <div className="t-xs mt-2 text-secondary">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 p-2 rounded-sm" style={{ border:"1px solid var(--border)", background:"var(--surface)" }}>
                  <button className="btn-icon" onClick={()=>setQty(Math.max(.5, qty-.5))}>-</button>
                  <span className="t-h3 text-text" style={{ width:32, textAlign:"center" }}>{qty}</span>
                  <button className="btn-icon" onClick={()=>setQty(qty+.5)}>+</button>
                </div>
                <button className="btn btn-secondary" style={{ flex: 1, padding: "12px" }} onClick={handleAdd}>
                  Add to sequence
                </button>
              </div>
            </div>
          )}

          {/* Added List */}
          <div className="card p-8" style={{ flex: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="t-h3">{type} Summary</h3>
              <span className="t-sm-med text-text">{Math.round(totals.cal)} kcal</span>
            </div>
            
            {addedItems.length === 0 ? (
              <div className="t-sm text-secondary text-center" style={{ padding:"60px 0", border:"1px dashed var(--border)", borderRadius:"var(--r-sm)" }}>
                No entities logged yet.
              </div>
            ) : (
              <div className="flex-col gap-4">
                {addedItems.map((item, i) => (
                  <div key={item.key} className="flex justify-between items-center" style={{ borderBottom: i<addedItems.length-1?"1px solid var(--border)":"none", paddingBottom: i<addedItems.length-1?16:0 }}>
                    <div>
                      <div className="t-sm-med text-text">{item.name}</div>
                      <div className="t-xs mt-1 text-secondary">{item.qty} x {item.portion} • {Math.round(item.cal*item.qty)} kcal</div>
                    </div>
                    <button className="btn-icon" onClick={()=>setAddedItems(items=>items.filter(x=>x.key!==item.key))}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                <button className="btn btn-primary w-full mt-6" style={{ padding: "12px" }} onClick={handleSave} disabled={saved}>
                  {saved ? <span className="flex items-center justify-center gap-2"><Check size={16}/> Saved</span> : "Save Record"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
