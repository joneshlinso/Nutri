import { useState, useEffect, useRef } from "react";
import api from "../api/axiosInstance";
import { Search, SlidersHorizontal, Plus, Heart, ChevronRight, Trash2, Check, Camera, Loader2, Sparkles, Edit3, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEAL_TYPES = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

const MEAL_EMOJIS = {
  Breakfast: "🍳",
  Lunch: "🥗",
  Dinner: "🍲",
  Snack: "🍎"
};

const PRESET_FOODS = [
  { id:1, name:"Hard-Boiled Egg & Oatmeal", desc:"1 egg + 1 bowl", cal:280, p:18, c:32, f:6,  emoji: MEAL_EMOJIS.Breakfast, type:"Breakfast" },
  { id:2, name:"Grilled Chicken Breast",     desc:"200g skinless",  cal:330, p:62, c:0,  f:7,  emoji: MEAL_EMOJIS.Lunch, type:"Lunch" },
  { id:3, name:"Avocado Toast",              desc:"2 slices whole grain", cal:350, p:9,  c:38, f:19, emoji: MEAL_EMOJIS.Breakfast, type:"Breakfast" },
  { id:4, name:"Brown Rice Bowl",            desc:"1 cup cooked",   cal:216, p:5,  c:45, f:2,  emoji: MEAL_EMOJIS.Lunch, type:"Lunch" },
  { id:5, name:"Salmon Fillet",              desc:"150g baked",     cal:280, p:39, c:0,  f:13, emoji: MEAL_EMOJIS.Dinner, type:"Dinner" },
  { id:6, name:"Greek Yogurt",               desc:"200g full-fat",  cal:150, p:17, c:9,  f:5,  emoji: MEAL_EMOJIS.Snack, type:"Snack" },
];

// Dynamic AI Recipes will be used instead

const FADE = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: d },
});

export default function MealLogger() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(PRESET_FOODS[0]);
  const [qty, setQty] = useState(1);
  const [meals, setMeals] = useState([]); // Database logs
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(new Set([1]));
  const [loading, setLoading] = useState(true);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [aiError, setAiError] = useState("");
  const [isEditingSelected, setIsEditingSelected] = useState(false);
  const fileInputRef = useRef(null);

  const [customFoods, setCustomFoods] = useState(() => {
    try {
      const stored = localStorage.getItem("nutriplanner_custom_foods");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setIsEditingSelected(false);
  }, [selected?.id]);

  const handleSelectedChange = (field, value) => {
    setSelected(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        [field]: value
      };
      if (field === "type") {
        updated.emoji = MEAL_EMOJIS[value] || "🍳";
      }
      return updated;
    });
  };

  const saveToCustomFoods = (meal) => {
    const nameLower = meal.name.toLowerCase();
    const existsInPreset = PRESET_FOODS.some(f => f.name.toLowerCase() === nameLower);
    const existsInCustom = customFoods.some(f => f.name.toLowerCase() === nameLower);

    if (!existsInPreset && !existsInCustom) {
      const newFood = {
        id: "custom-saved-" + Date.now(),
        name: meal.name,
        desc: meal.desc || "Custom Entry",
        cal: meal.cal || meal.calories || 0,
        p: meal.p || meal.protein || 0,
        c: meal.c || meal.carbs || 0,
        f: meal.f || meal.fat || 0,
        emoji: MEAL_EMOJIS[meal.type || "Breakfast"] || "🍳",
        type: meal.type || "Breakfast"
      };
      const updated = [newFood, ...customFoods];
      setCustomFoods(updated);
      localStorage.setItem("nutriplanner_custom_foods", JSON.stringify(updated));
    }
  };

  const deleteCustomFood = (id) => {
    const updated = customFoods.filter(f => f.id !== id);
    setCustomFoods(updated);
    localStorage.setItem("nutriplanner_custom_foods", JSON.stringify(updated));
    if (selected?.id === id) {
      setSelected(null);
    }
  };

  // Manual Entry States
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({ name: "", cal: 0, p: 0, c: 0, f: 0, type: "Breakfast" });

  // AI Recipe States
  const [recipeCraving, setRecipeCraving] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [generatingRecipe, setGeneratingRecipe] = useState(false);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await api.get('/logs/day');
        setMeals(res.data.meals || []);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingImage(true);
    setAiError("");
    
    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await api.post('/ai/vision-log', { imageBase64: reader.result });
        const aiData = res.data;
        // Mocking an id and emoji for the custom entry
        setSelected({
          id: 'custom-' + Date.now(),
          name: aiData.name,
          desc: "AI Visual Estimate",
          cal: aiData.calories,
          p: aiData.protein,
          c: aiData.carbs,
          f: aiData.fat,
          emoji: MEAL_EMOJIS.Dinner,
          type: "Dinner" // Default to dinner or allow user to change
        });
        setQty(1);
      } catch (err) {
        console.error("Vision AI failed", err);
        setAiError(err.response?.data?.message || err.message || "Failed to analyze image. Please try again.");
      } finally {
        setAnalyzingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const generateRecipe = async () => {
    setGeneratingRecipe(true);
    try {
      const res = await api.post('/ai/recipe', { mealName: recipeCraving || "Surprise me with something healthy and delicious" });
      setGeneratedRecipe(res.data.recipe);
    } catch (err) {
      console.error("Recipe generation failed", err);
    } finally {
      setGeneratingRecipe(false);
    }
  };

  const addManualEntry = async () => {
    try {
      const mealData = {
        name: manualEntry.name || "Custom Meal",
        type: manualEntry.type,
        calories: Number(manualEntry.cal),
        protein: Number(manualEntry.p),
        carbs: Number(manualEntry.c),
        fat: Number(manualEntry.f),
        emoji: MEAL_EMOJIS[manualEntry.type] || "🍳"
      };
      const res = await api.post('/logs/meal', mealData);
      setMeals(res.data.meals);

      // Save to custom foods library
      saveToCustomFoods({
        name: mealData.name,
        type: mealData.type,
        cal: mealData.calories,
        p: mealData.protein,
        c: mealData.carbs,
        f: mealData.fat,
        emoji: mealData.emoji,
        desc: "Custom Entry"
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setIsManualEntry(false);
      setManualEntry({ name: "", cal: 0, p: 0, c: 0, f: 0, type: "Breakfast" });
    } catch (err) {
      console.error("Error adding manual meal:", err);
    }
  };

  const allFoods = [...PRESET_FOODS, ...customFoods];
  const filtered = allFoods.filter(f =>
    (active === "All" || f.type === active) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = meals.reduce((a, i) => ({ 
    cal: a.cal + (i.calories || 0), 
    p: a.p + (i.protein || 0), 
    c: a.c + (i.carbs || 0), 
    f: a.f + (i.fat || 0) 
  }), { cal: 0, p: 0, c: 0, f: 0 });

  const add = async () => { 
    if (!selected) return;
    try {
      const mealData = {
        name: selected.name,
        type: selected.type || "Breakfast",
        calories: Math.round(selected.cal * qty),
        protein: Math.round(selected.p * qty),
        carbs: Math.round(selected.c * qty),
        fat: Math.round(selected.f * qty),
        emoji: MEAL_EMOJIS[selected.type || "Breakfast"] || "🍳"
      };
      
      const res = await api.post('/logs/meal', mealData);
      setMeals(res.data.meals);

      // Save to custom foods if it is an AI-generated or custom-built item
      if (selected.id && String(selected.id).startsWith("custom-")) {
        saveToCustomFoods({
          name: selected.name,
          type: selected.type || "Breakfast",
          cal: selected.cal,
          p: selected.p,
          c: selected.c,
          f: selected.f,
          emoji: selected.emoji,
          desc: "AI Estimate / Custom"
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setQty(1);
    } catch (err) {
      console.error("Error adding meal:", err);
    }
  };

  const remove = async (mealId) => {
    try {
      const res = await api.delete(`/logs/meal/${mealId}`);
      setMeals(res.data.meals);
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  return (
    <main className="page-content">

      {/* ─── Header ─── */}
      <motion.div {...FADE(0)} className="page-header">
        <div>
          <h1>Diet Log</h1>
          <p>Discover healthy meals, log your daily intake.</p>
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
              background: "var(--card-bg)", borderRadius: 2, padding: "0 20px", height: 58,
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

          {/* Action Buttons */}
          {aiError && (
            <motion.div {...FADE(0.05)} style={{ padding: "12px 16px", borderRadius: 2, background: "rgba(196,98,58,.08)", color: "var(--rust)", fontSize: "0.85rem", fontWeight: 500, border: "1px solid rgba(196,98,58,.2)" }}>
              {aiError}
            </motion.div>
          )}
          <motion.div {...FADE(0.06)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleImageUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              style={{ padding: "16px", background: "var(--cream-dark)", border: "1px solid var(--gold)", color: "var(--ink)", borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontWeight: 500, boxShadow: "0 2px 20px rgba(184,146,74,.1)" }}
            >
              {analyzingImage ? <Loader2 size={20} className="spin" style={{ color: "var(--gold)" }} /> : <Sparkles size={20} style={{ color: "var(--gold)" }} />}
              Snap & Log (AI)
            </button>
            <button 
              onClick={() => { setIsManualEntry(true); setSelected(null); }} 
              style={{ padding: "16px", background: "var(--card-bg)", border: "1px solid var(--ink-10)", color: "var(--ink)", borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontWeight: 500 }}
            >
              <Edit3 size={20} />
              Log Custom Meal
            </button>
          </motion.div>

          {/* Meal Type Chips */}
          <motion.div {...FADE(0.08)} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {MEAL_TYPES.map(t => (
              <button key={t} onClick={() => setActive(t)}
                style={{
                  padding: "9px 20px", borderRadius: 2, border: "none", cursor: "pointer",
                  background: active === t ? "var(--ink)" : "var(--card-bg)",
                  color: active === t ? "var(--card-bg)" : "var(--text-secondary)",
                  fontWeight: 500, fontSize: ".875rem",
                  boxShadow: active === t ? "none" : "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)",
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >{t}</button>
            ))}
          </motion.div>

          {/* Food Results Grid */}
          <motion.div {...FADE(0.14)}>
            <h3 className="t-h3 mb-4">Foods</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filtered.map(item => (
                <motion.div key={item.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelected(item); setIsManualEntry(false); }} style={{
                    background: selected?.id === item.id && !isManualEntry ? "var(--cream-dark)" : "var(--card-bg)",
                    borderRadius: 2, padding: "18px 20px", cursor: "pointer",
                    boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)",
                    border: `1px solid ${selected?.id === item.id ? "var(--ink)" : "transparent"}`,
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    position: "relative"
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 28 }}>{item.emoji}</div>
                    {String(item.id).startsWith("custom-saved-") && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          deleteCustomFood(item.id); 
                        }}
                        style={{ background: "none", border: "none", color: "var(--rust)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
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

          {/* AI Recipe Generator */}
          <motion.div {...FADE(0.18)}>
            <div className="flex items-center gap-3 mb-4">
              <ChefHat size={24} style={{ color: "var(--gold)" }} />
              <h3 className="t-h3" style={{ margin: 0 }}>Couture Recipes</h3>
            </div>
            <div style={{ background: "var(--card-bg)", borderRadius: 2, padding: "20px", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)", display: "flex", flexDirection: "column", gap: 16 }}>
              <p className="t-sm" style={{ color: "var(--text-secondary)", margin: 0 }}>Craving something specific? Let our AI chef craft a luxury recipe tailored just for you.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  style={{ flex: 1, padding: "12px 16px", border: "1px solid var(--ink-10)", borderRadius: 2, background: "var(--background)", fontSize: "1rem", outline: "none" }}
                  placeholder="e.g. A high protein salmon dish..."
                  value={recipeCraving} onChange={e => setRecipeCraving(e.target.value)}
                />
                <button 
                  onClick={generateRecipe} 
                  disabled={generatingRecipe}
                  style={{ padding: "0 24px", background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 2, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  {generatingRecipe ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
                  Generate
                </button>
              </div>

              <AnimatePresence>
                {generatedRecipe && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--ink-10)" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "var(--ink)", marginBottom: 8 }}>{generatedRecipe.title}</div>
                      <div className="t-sm mb-4" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{generatedRecipe.description}</div>
                      
                      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                        <span className="t-sm" style={{ background: "var(--cream-dark)", padding: "4px 10px", borderRadius: 2, border: "1px solid var(--gold)" }}>⏱ {generatedRecipe.prepTime}</span>
                        <span className="t-sm" style={{ background: "var(--cream-dark)", padding: "4px 10px", borderRadius: 2, border: "1px solid var(--rust)" }}>🔥 {generatedRecipe.calories} kcal</span>
                      </div>

                      <div className="t-body-med mb-2">Ingredients</div>
                      <ul style={{ paddingLeft: 20, margin: "0 0 16px 0", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                        {generatedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                      </ul>

                      <div className="t-body-med mb-2">Instructions</div>
                      <ol style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                        {generatedRecipe.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ═══ RIGHT COLUMN — Entry Builder & Log ═══ */}
        <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Selected Item Builder or Manual Entry Builder */}
          <AnimatePresence mode="wait">
            {isManualEntry ? (
              <motion.div key="manual" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ background: "var(--card-bg)", borderRadius: 2, padding: "20px", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)" }}>
                
                <h3 style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 16 }}>Custom Meal</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  <input placeholder="Meal Name" value={manualEntry.name} onChange={e => setManualEntry(p => ({...p, name: e.target.value}))} style={{ width: "100%", padding: "12px", border: "1px solid var(--ink-10)", borderRadius: 2, background: "none", outline: "none", boxSizing: "border-box" }} />
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="t-sm text-secondary" style={{ display: "block", marginBottom: 4 }}>Calories (kcal)</label>
                      <input type="number" value={manualEntry.cal || ""} onChange={e => setManualEntry(p => ({...p, cal: e.target.value}))} style={{ width: "100%", padding: "12px", border: "1px solid var(--ink-10)", borderRadius: 2, background: "none", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="t-sm text-secondary" style={{ display: "block", marginBottom: 4 }}>Type</label>
                      <select value={manualEntry.type} onChange={e => setManualEntry(p => ({...p, type: e.target.value}))} style={{ width: "100%", padding: "12px", border: "1px solid var(--ink-10)", borderRadius: 2, background: "none", outline: "none", boxSizing: "border-box" }}>
                        {MEAL_TYPES.filter(t => t !== "All").map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    <div>
                      <label className="t-sm" style={{ color: "var(--slate)", display: "block", marginBottom: 4 }}>Protein (g)</label>
                      <input type="number" value={manualEntry.p || ""} onChange={e => setManualEntry(p => ({...p, p: e.target.value}))} style={{ width: "100%", padding: "10px", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, background: "none", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="t-sm" style={{ color: "var(--rust)", display: "block", marginBottom: 4 }}>Carbs (g)</label>
                      <input type="number" value={manualEntry.c || ""} onChange={e => setManualEntry(p => ({...p, c: e.target.value}))} style={{ width: "100%", padding: "10px", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, background: "none", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="t-sm" style={{ color: "var(--gold)", display: "block", marginBottom: 4 }}>Fat (g)</label>
                      <input type="number" value={manualEntry.f || ""} onChange={e => setManualEntry(p => ({...p, f: e.target.value}))} style={{ width: "100%", padding: "10px", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, background: "none", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setIsManualEntry(false)} style={{ flex: 1, padding: "14px", background: "none", color: "var(--ink)", border: "1px solid var(--ink-10)", borderRadius: 2, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                  <button onClick={addManualEntry} disabled={saved || !manualEntry.name} style={{ flex: 1, padding: "14px", background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 2, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {saved ? <Check size={18} /> : <Plus size={18} />}
                    {saved ? "Logged!" : "Add Entry"}
                  </button>
                </div>
              </motion.div>
            ) : selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ background: "var(--card-bg)", borderRadius: 2, padding: "16px", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)" }}>
                {isEditingSelected ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--ink)", margin: 0 }}>Adjust Details</h4>
                      <button onClick={() => setIsEditingSelected(false)} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Done</button>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: "0.65rem", color: "var(--ink-60)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>Meal Name</label>
                      <input 
                        value={selected.name} 
                        onChange={e => handleSelectedChange("name", e.target.value)} 
                        style={{ padding: "10px 12px", border: "1px solid var(--ink-10)", borderRadius: 2, background: "var(--cream)", outline: "none", color: "var(--ink)", fontSize: "0.9rem", fontFamily: "'Montserrat', sans-serif" }} 
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.65rem", color: "var(--ink-60)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>Calories (kcal)</label>
                        <input 
                          type="number"
                          value={selected.cal} 
                          onChange={e => handleSelectedChange("cal", Number(e.target.value))} 
                          style={{ padding: "10px 12px", border: "1px solid var(--ink-10)", borderRadius: 2, background: "var(--cream)", outline: "none", color: "var(--ink)", fontSize: "0.9rem", fontFamily: "'Montserrat', sans-serif" }} 
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.65rem", color: "var(--ink-60)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>Type</label>
                        <select 
                          value={selected.type || "Breakfast"} 
                          onChange={e => handleSelectedChange("type", e.target.value)} 
                          style={{ padding: "10px 12px", border: "1px solid var(--ink-10)", borderRadius: 2, background: "var(--cream)", outline: "none", color: "var(--ink)", fontSize: "0.9rem", fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {MEAL_TYPES.filter(t => t !== "All").map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.65rem", color: "var(--slate)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.01em" }}>Protein (g)</label>
                        <input 
                          type="number" 
                          value={selected.p} 
                          onChange={e => handleSelectedChange("p", Number(e.target.value))} 
                          style={{ padding: "8px", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, background: "var(--cream)", outline: "none", color: "var(--ink)", fontSize: "0.85rem", fontFamily: "'Montserrat', sans-serif" }} 
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.65rem", color: "var(--rust)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.01em" }}>Carbs (g)</label>
                        <input 
                          type="number" 
                          value={selected.c} 
                          onChange={e => handleSelectedChange("c", Number(e.target.value))} 
                          style={{ padding: "8px", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, background: "var(--cream)", outline: "none", color: "var(--ink)", fontSize: "0.85rem", fontFamily: "'Montserrat', sans-serif" }} 
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.65rem", color: "var(--gold)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.01em" }}>Fat (g)</label>
                        <input 
                          type="number" 
                          value={selected.f} 
                          onChange={e => handleSelectedChange("f", Number(e.target.value))} 
                          style={{ padding: "8px", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, background: "var(--cream)", outline: "none", color: "var(--ink)", fontSize: "0.85rem", fontFamily: "'Montserrat', sans-serif" }} 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 28 }}>{selected.emoji}</span>
                        <div>
                          <div style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.2rem", fontWeight: 400, color: "var(--ink)" }}>{selected.name}</div>
                          <div className="t-sm">{selected.desc}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsEditingSelected(true)}
                        style={{ padding: "6px 12px", background: "none", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-60)", transition: "all 0.2s", fontFamily: "'Montserrat', sans-serif" }}
                        onMouseOver={e => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--ink-30)"; }}
                        onMouseOut={e => { e.currentTarget.style.color = "var(--ink-60)"; e.currentTarget.style.borderColor = "var(--ink-10)"; }}
                      >
                        <Edit3 size={12} />
                        Edit Details
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: "2.5rem", fontWeight: 300, fontFamily: "\'Cormorant Garamond\', serif", letterSpacing: "-0.04em", lineHeight: 1, color: "var(--text)" }}>
                        {Math.round(selected.cal * qty)}
                      </span>
                      <span className="t-body text-secondary">kcal</span>
                      {selected.type && (
                        <span style={{ marginLeft: "auto", background: "var(--cream-dark)", padding: "3px 8px", borderRadius: 2, fontSize: "0.7rem", color: "var(--ink-60)", fontWeight: 600, border: "1px solid rgba(184,146,74,.2)" }}>{selected.type}</span>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                      {[{l:"P",v:selected.p,c:"var(--slate)"},{l:"C",v:selected.c,c:"var(--rust)"},{l:"F",v:selected.f,c:"var(--gold)"}].map(m => (
                        <div key={m.l} style={{ background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2, padding: "12px 10px", textAlign: "center" }}>
                          <div style={{ fontSize: "1.1rem", fontWeight: 500, color: m.c }}>{Math.round(m.v * qty)}g</div>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "0.02em",  color: "var(--ink-60)", marginTop: 4 }}>{{P:"Protein",C:"Carbs",F:"Fat"}[m.l]}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.1)", padding: "8px 16px", borderRadius: 2, boxShadow: "inset 0 0 0 1px rgba(184,146,74,.2)" }}>
                    <button onClick={() => setQty(Math.max(0.5, qty - 0.5))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", lineHeight: 1, width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontWeight: 500, minWidth: 32, textAlign: "center" }}>{qty}</span>
                    <button onClick={() => setQty(qty + 0.5)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", lineHeight: 1, width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <button onClick={add} disabled={saved} style={{ flex: 1, padding: "14px", background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 2, fontWeight: 500, fontSize: ".9375rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {saved ? <Check size={18} /> : <Plus size={18} />}
                    {saved ? "Logged!" : "Add Entry"}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Log Summary */}
          <div style={{ background: "var(--card-bg)", borderRadius: 2, padding: "24px", boxShadow: "0 2px 40px rgba(26,22,18,.07), 0 1px 3px rgba(26,22,18,.04)" }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)" }}>Today's Log</h3>
              <span style={{ fontWeight: 500, color: "var(--ink)", fontSize: "1rem" }}>{Math.round(total.cal)} <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>kcal</span></span>
            </div>
            {meals.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2 }}>
                <span style={{ fontSize: 32 }}>🍽️</span>
                <p className="t-body mt-3">{loading ? "Loading journal..." : "Nothing logged yet"}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <AnimatePresence>
                  {meals.map((item, i) => (
                    <motion.div key={item._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.93 }}
                      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--card-bg)", border: "1px solid rgba(184,146,74,.1)", borderRadius: 2 }}>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)" }}>{item.emoji} {item.name}</div>
                        <div className="t-sm mt-1" style={{ color: "var(--text-muted)" }}>{item.type}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 500, color: "var(--ink)", fontSize: ".9rem" }}>{Math.round(item.calories)}</span>
                        <button onClick={() => remove(item._id)} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(220,76,76,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C04040" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
