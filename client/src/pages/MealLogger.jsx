import { useState } from "react";
import { Search, SlidersHorizontal, Plus, Heart, ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Mock Data matching reference screenshot ───────────────────
const MEAL_SECTIONS = [
  {
    id: 1,
    type: "Breakfast",
    icon: "🍳",
    totalCal: 945,
    items: [
      { id: 1, name: "Hard-Boiled Egg & Oatmeal", desc: "280 kcal • 1 egg + 1 bowl", cal: 280 },
    ],
  },
  {
    id: 2,
    type: "Lunch",
    icon: "🥗",
    totalCal: 650,
    items: [
      { id: 2, name: "Grilled Chicken Salad", desc: "350 kcal • 200g chicken", cal: 350 },
    ],
  },
  {
    id: 3,
    type: "Dinner",
    icon: "🍲",
    totalCal: 580,
    items: [
      { id: 3, name: "Salmon & Sweet Potato", desc: "520 kcal • 150g salmon", cal: 520 },
    ],
  },
];

const RECIPE_CARDS = [
  {
    id: 1, name: "Healthy Ice Cream", desc: "280 kcal Yogurt w/ Berries",
    img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=240&fit=crop",
    liked: true,
  },
  {
    id: 2, name: "Avocado Power Bowl", desc: "320 kcal Greens & Seeds",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=240&fit=crop",
    liked: false,
  },
  {
    id: 3, name: "Berry Smoothie Bowl", desc: "245 kcal Mixed Berries & Granola",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=240&fit=crop",
    liked: false,
  },
];

const FADE = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: d },
});

export default function MealLogger() {
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState(new Set([1]));
  const [sections, setSections] = useState(MEAL_SECTIONS);

  const toggleLike = (id) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="page-content" style={{ maxWidth: 680, margin: "0 auto" }}>

      {/* ─── Header ─── */}
      <motion.div {...FADE(0)} className="flex items-center justify-between mb-8">
        <button className="btn-icon" style={{ width: 48, height: 48 }}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="t-h3" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          Recipe
        </h2>
        <div style={{ width: 48 }} />
      </motion.div>

      {/* ─── Page Title ─── */}
      <motion.div {...FADE(0.05)} className="mb-6">
        <h1 className="t-display" style={{ lineHeight: 1.1 }}>
          Today's Nutritious<br />Meal Ideas
        </h1>
      </motion.div>

      {/* ─── Pill Search Bar ─── */}
      <motion.div {...FADE(0.1)} className="mb-8">
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#FFFFFF", borderRadius: 100, padding: "0 20px", height: 60,
          boxShadow: "var(--shadow-outer)"
        }}>
          <Search size={20} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            style={{ flex: 1, border: "none", background: "none", fontSize: "1rem", color: "var(--text)", outline: "none" }}
            placeholder="Search Recipes.."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ width: 1, height: 24, background: "var(--bg-alt)" }} />
          <SlidersHorizontal size={20} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
        </div>
      </motion.div>

      {/* ─── Meal Section Cards (Green, Yazio-style) ─── */}
      <div className="flex-col gap-4 mb-8">
        {sections.map((section, i) => (
          <motion.div key={section.id} {...FADE(0.12 + i * 0.06)}>
            <div style={{
              background: "var(--primary-light)",
              borderRadius: 24, padding: "20px 24px",
              boxShadow: "none",
            }}>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {/* Icon circle */}
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "var(--shadow-outer)", fontSize: 22
                  }}>
                    {section.icon}
                  </div>
                  <span className="t-h2">{section.type}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>
                    {section.totalCal}
                  </span>
                  <span className="t-body-med text-secondary">kcal</span>
                </div>
              </div>

              {/* Meal Items */}
              {section.items.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <div className="t-h3 mb-1">{item.name}</div>
                    <div className="t-body">{item.desc}</div>
                  </div>
                  {/* Round + button */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "#FFFFFF", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginLeft: 16,
                      boxShadow: "var(--shadow-outer)"
                    }}
                  >
                    <Plus size={22} color="var(--text)" />
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Recipe Cards (White, with image on right) ─── */}
      <div className="flex-col gap-4">
        {RECIPE_CARDS.map((recipe, i) => (
          <motion.div key={recipe.id} {...FADE(0.2 + i * 0.07)}>
            <div style={{
              background: "#FFFFFF", borderRadius: 24,
              boxShadow: "var(--shadow-outer)",
              overflow: "hidden", display: "flex",
              minHeight: 160,
            }}>
              {/* Text Side */}
              <div style={{ flex: 1, padding: "20px 20px 20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {/* Heart */}
                <motion.button
                  whileTap={{ scale: 0.80 }}
                  onClick={() => toggleLike(recipe.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", width: 28, textAlign: "left", marginBottom: 8 }}
                >
                  <Heart
                    size={24}
                    fill={liked.has(recipe.id) ? "var(--text)" : "none"}
                    color={liked.has(recipe.id) ? "var(--text)" : "var(--text-muted)"}
                  />
                </motion.button>

                <div>
                  <div className="t-h3 mb-1">{recipe.name}</div>
                  <div className="t-body mb-4">{recipe.desc}</div>
                </div>

                {/* See Recipe pill */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#141A10", color: "#FFFFFF",
                    border: "none", borderRadius: 100,
                    padding: "10px 20px", fontSize: ".875rem", fontWeight: 600,
                    cursor: "pointer", alignSelf: "flex-start"
                  }}
                >
                  See Recipe
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <ChevronRight size={13} />
                  </div>
                </motion.button>
              </div>

              {/* Food Image */}
              <div style={{ width: 160, flexShrink: 0, position: "relative" }}>
                <img
                  src={recipe.img}
                  alt={recipe.name}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    borderRadius: "0 24px 24px 0",
                    display: "block"
                  }}
                  onError={e => { e.target.style.background = "var(--primary-light)"; e.target.style.display = "none"; }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </main>
  );
}
