import { useState } from "react";
import { Search, SlidersHorizontal, Plus, Heart, ChevronRight, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEAL_TYPES = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];
const FOODS = [
  { id:1, name:"Hard-Boiled Egg & Oatmeal", desc:"1 egg + 1 bowl", cal:280, p:18, c:32, f:6,  emoji:"🥚", type:"Breakfast" },
  { id:2, name:"Grilled Chicken Breast",     desc:"200g skinless",  cal:330, p:62, c:0,  f:7,  emoji:"🍗", type:"Lunch" },
  { id:3, name:"Avocado Toast",              desc:"2 slices whole grain", cal:350, p:9,  c:38, f:19, emoji:"🥑", type:"Breakfast" },
  { id:4, name:"Brown Rice Bowl",            desc:"1 cup cooked",   cal:216, p:5,  c:45, f:2,  emoji:"🍚", type:"Lunch" },
  { id:5, name:"Salmon Fillet",              desc:"150g baked",     cal:280, p:39, c:0,  f:13, emoji:"🐟", type:"Dinner" },
  { id:6, name:"Greek Yogurt",               desc:"200g full-fat",  cal:150, p:17, c:9,  f:5,  emoji:"🫙", type:"Snack" },
];

const RECIPES = [
  {
    id:1, name:"Healthy Ice Cream", desc:"280 kcal · Yogurt w/ Berries",
    img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=280&fit=crop",
  },
  {
    id:2, name:"Avocado Power Bowl", desc:"320 kcal · Greens & Seeds",
    img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop",
  },
  {
    id:3, name:"Berry Smoothie Bowl", desc:"245 kcal · Mixed Berries",
    img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=280&fit=crop",
  },
  {
    id:4, name:"Quinoa Salad", desc:"310 kcal · Veggies & Feta",
    img:"https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=280&fit=crop",
  },
];

const FADE = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: d },
});

export default function MealLogger() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(FOODS[0]);
  const [qty, setQty] = useState(1);
  const [log, setLog] = useState([]);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(new Set([1]));

  const filtered = FOODS.filter(f =>
    (active === "All" || f.type === active) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const total = log.reduce((a, i) => ({ cal:a.cal+i.cal*i.qty, p:a.p+i.p*i.qty, c:a.c+i.c*i.qty, f:a.f+i.f*i.qty }), { cal:0, p:0, c:0, f:0 });
  const add = () => { if (!selected) return; setLog([...log, { ...selected, qty, key: Date.now() }]); setQty(1); };
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  return (
    <main className="page-content">

      {/* ─── Header ─── */}
      <motion.div {...FADE(0)} className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "2.8rem", fontWeight: 300, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>Diet Log</h1>
          <p style={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--ink-60)", textTransform: "uppercase", marginTop: 8 }}>Discover healthy meals, log your daily intake.</p>
        </div>
      </motion.div>

      {/* ─── MAIN GRID: Left content | Right log panel ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>

        {/* ═══ LEFT COLUMN ═══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Search + Filters */}
          <motion.div {...FADE(0.05)}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#FFFFFF", borderRadius: 2, padding: "0 20px", height: 58,
              boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)"
            }}>
              <Search size={20} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                style={{ flex: 1, border: "none", background: "none", fontSize: "1rem", color: "var(--text)", outline: "none" }}
                placeholder="Search Recipes.."
                value={search} onChange={e => setSearch(e.target.value)}
              />
              <div style={{ width: 1, height: 24, background: "var(--ink-10)", flexShrink: 0 }} />
              <SlidersHorizontal size={20} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
            </div>
          </motion.div>

          {/* Meal Type Chips */}
          <motion.div {...FADE(0.08)} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {MEAL_TYPES.map(t => (
              <button key={t} onClick={() => setActive(t)}
                style={{
                  padding: "9px 20px", borderRadius: 2, border: "none", cursor: "pointer",
                  background: active === t ? "var(--ink)" : "#FFFFFF",
                  color: active === t ? "#FFFFFF" : "var(--text-secondary)",
                  fontWeight: 500, fontSize: ".875rem",
                  boxShadow: active === t ? "none" : "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)",
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >{t}</button>
            ))}
          </motion.div>

          {/* Meal Section Cards (green) */}
          <motion.div {...FADE(0.11)}>
            <div style={{ background: "var(--cream-dark)", borderRadius: 2, padding: "24px 28px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)", fontSize: 22 }}>🍳</div>
                  <span style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "2rem", fontWeight: 300, color: "var(--ink)" }}>Breakfast</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 300, fontFamily: "\'Cormorant Garamond\', serif", letterSpacing: "-0.03em", color: "var(--text)" }}>945</span>
                  <span className="t-body-med text-secondary">kcal</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="t-h3 mb-1">Hard-Boiled Egg & Oatmeal</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--ink-60)" }}>280 kcal · 1 egg + 1 bowl</div>
                </div>
                <motion.button whileTap={{ scale: 0.86 }} onClick={() => setSelected(FOODS[0])}
                  style={{ width: 48, height: 48, borderRadius: "50%", background: "#FFFFFF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)", flexShrink: 0, marginLeft: 16 }}>
                  <Plus size={22} color="var(--text)" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Food Results Grid */}
          <motion.div {...FADE(0.14)}>
            <h3 className="t-h3 mb-4">Foods</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filtered.map(item => (
                <motion.div key={item.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(item)} style={{
                    background: selected?.id === item.id ? "var(--cream-dark)" : "#FFFFFF",
                    borderRadius: 2, padding: "18px 20px", cursor: "pointer",
                    boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)",
                    border: `1px solid ${selected?.id === item.id ? "var(--ink)" : "transparent"}`,
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
                  <div className="t-body-med mb-1">{item.name}</div>
                  <div className="t-sm mb-3">{item.desc}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[{l:"P",v:item.p,c:"var(--slate)"},{l:"C",v:item.c,c:"var(--rust)"},{l:"F",v:item.f,c:"var(--gold)"}].map(m => (
                      <span key={m.l} style={{ padding: "3px 10px", borderRadius: 2, background: `${m.c}14`, color: m.c, fontSize: ".75rem", fontWeight: 500 }}>
                        {m.l}: {m.v}g
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recipe Cards */}
          <motion.div {...FADE(0.18)}>
            <h3 className="t-h3 mb-4">Recipe Ideas</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {RECIPES.map(r => (
                <div key={r.id} style={{ background: "#FFFFFF", borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)" }}>
                  <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
                    <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => {
                      setLiked(prev => { const n = new Set(prev); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; });
                    }} style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Heart size={16} fill={liked.has(r.id) ? "#E85C5C" : "none"} color={liked.has(r.id) ? "#E85C5C" : "#AAA"} />
                    </motion.button>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <div className="t-body-med mb-1">{r.name}</div>
                    <div className="t-sm mb-3">{r.desc}</div>
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141A10", color: "#FFFFFF", border: "none", borderRadius: 2, padding: "8px 16px", fontSize: ".8rem", fontWeight: 500, cursor: "pointer" }}>
                      See Recipe <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ RIGHT COLUMN — Entry Builder & Log ═══ */}
        <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Selected Item Builder */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ background: "#FFFFFF", borderRadius: 2, padding: "24px", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <span style={{ fontSize: 36 }}>{selected.emoji}</span>
                  <div>
                    <div style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)" }}>{selected.name}</div>
                    <div className="t-sm mt-1">{selected.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: "3.5rem", fontWeight: 300, fontFamily: "\'Cormorant Garamond\', serif", letterSpacing: "-0.04em", lineHeight: 1, color: "var(--text)" }}>
                    {Math.round(selected.cal * qty)}
                  </span>
                  <span className="t-body text-secondary">kcal</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                  {[{l:"P",v:selected.p,c:"var(--slate)"},{l:"C",v:selected.c,c:"var(--rust)"},{l:"F",v:selected.f,c:"var(--gold)"}].map(m => (
                    <div key={m.l} style={{ background: "#FFFFFF", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, padding: "12px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 500, color: m.c }}>{Math.round(m.v * qty)}g</div>
                      <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", marginTop: 4 }}>{{P:"Protein",C:"Carbs",F:"Fat"}[m.l]}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFFFFF", border: "1px solid rgba(184,146,74,.1)", padding: "8px 16px", borderRadius: 2, boxShadow: "inset 0 0 0 1px rgba(184,146,74,.2)" }}>
                    <button onClick={() => setQty(Math.max(0.5, qty - 0.5))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", lineHeight: 1, width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontWeight: 500, minWidth: 32, textAlign: "center" }}>{qty}</span>
                    <button onClick={() => setQty(qty + 0.5)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", lineHeight: 1, width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <button onClick={add} style={{ flex: 1, padding: "14px", background: "var(--ink)", color: "#FFFFFF", border: "none", borderRadius: 2, fontWeight: 500, fontSize: ".9375rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Plus size={18} /> Add Entry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Log Summary */}
          <div style={{ background: "#FFFFFF", borderRadius: 2, padding: "24px", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)" }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)" }}>Today's Log</h3>
              <span style={{ fontWeight: 500, color: "var(--ink)", fontSize: "1rem" }}>{Math.round(total.cal)} <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>kcal</span></span>
            </div>
            {log.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", background: "#FFFFFF", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2 }}>
                <span style={{ fontSize: 32 }}>🍽️</span>
                <p className="t-body mt-3">Nothing logged yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <AnimatePresence>
                  {log.map((item, i) => (
                    <motion.div key={item.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.93 }}
                      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#FFFFFF", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, borderBottom: i < log.length - 1 ? "none" : "none" }}>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)" }}>{item.emoji} {item.name}</div>
                        <div className="t-sm mt-1" style={{ color: "var(--text-muted)" }}>{item.qty} × {item.desc}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 500, color: "var(--ink)", fontSize: ".9rem" }}>{Math.round(item.cal * item.qty)}</span>
                        <button onClick={() => setLog(l => l.filter(x => x.key !== item.key))} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(220,76,76,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C04040" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button onClick={save} disabled={saved} style={{ padding: "14px", marginTop: 4, background: saved ? "var(--cream-dark)" : "var(--ink)", color: saved ? "var(--ink)" : "#FFFFFF", border: "none", borderRadius: 2, fontWeight: 500, fontSize: ".9375rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {saved ? <><Check size={18} /> Logged!</> : "Save Meal"}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
