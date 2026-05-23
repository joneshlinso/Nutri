/**
 * Knowledge Seeder — Run once to populate the RAG knowledge base.
 * Usage: node scripts/seedKnowledge.js
 *
 * Seeds curated, science-backed nutritional facts into MongoDB
 * with Gemini embeddings for retrieval-augmented generation.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { seedKnowledgeDocument, getKnowledgeCount } = require("../services/ragService");

const KNOWLEDGE_ITEMS = [
  // ─── Macronutrients ────────────────────────────────────────────────────────
  {
    content: "Protein provides 4 calories per gram and is essential for muscle repair and growth. The WHO recommends 0.8g per kg of body weight for sedentary adults, rising to 1.6–2.2g/kg for athletes. High-quality sources include chicken breast (31g/100g), Greek yogurt (10g/100g), eggs (13g/100g), salmon (25g/100g), lentils (9g/100g cooked).",
    category: "macros",
    source: "WHO / USDA FoodData Central"
  },
  {
    content: "Carbohydrates provide 4 calories per gram and are the body's primary energy source. Complex carbs (oats, sweet potatoes, legumes) provide sustained energy and fiber. Simple sugars spike blood glucose rapidly. The Dietary Guidelines recommend 45–65% of total calories from carbohydrates for most adults.",
    category: "macros",
    source: "USDA Dietary Guidelines 2020-2025"
  },
  {
    content: "Dietary fats provide 9 calories per gram. Unsaturated fats (olive oil, avocado, nuts, fatty fish) are cardioprotective. Saturated fats should be limited to <10% of daily calories. Trans fats should be avoided entirely. Omega-3 fatty acids (EPA and DHA) found in salmon, sardines, and walnuts reduce inflammation significantly.",
    category: "macros",
    source: "American Heart Association / USDA"
  },
  {
    content: "Dietary fiber is a non-digestible carbohydrate that promotes gut health, satiety, and glycemic control. Adults need 25–38g per day. Top sources: chia seeds (34g/100g), black beans (8.7g/100g cooked), avocado (6.7g/100g), oats (10g/100g dry), broccoli (2.6g/100g). Fiber feeds beneficial gut bacteria and reduces LDL cholesterol.",
    category: "macros",
    source: "Academy of Nutrition and Dietetics"
  },

  // ─── Weight Loss Goals ─────────────────────────────────────────────────────
  {
    content: "A sustainable caloric deficit for fat loss is 250–500 kcal per day below Total Daily Energy Expenditure (TDEE), resulting in 0.25–0.5 kg of fat loss per week. Aggressive deficits (>1000 kcal) risk muscle loss, metabolic adaptation, and micronutrient deficiencies. Protein intake of 1.8–2.2g/kg helps preserve lean mass during a cut.",
    category: "weight-loss",
    source: "International Journal of Obesity / ISSN"
  },
  {
    content: "For weight loss, high-protein, high-volume foods create satiety without excess calories. Best choices: lean chicken breast (165 kcal/100g, 31g protein), egg whites (52 kcal/100g, 11g protein), cottage cheese (98 kcal/100g, 11g protein), Greek yogurt (59 kcal/100g, 10g protein), leafy greens (<25 kcal/100g). These maximize fullness per calorie.",
    category: "weight-loss",
    source: "Obesity Research & Clinical Practice"
  },

  // ─── Muscle Gain ───────────────────────────────────────────────────────────
  {
    content: "For muscle hypertrophy, a caloric surplus of 200–350 kcal above TDEE combined with resistance training is optimal. Protein timing matters: consuming 20–40g of high-quality protein within 2 hours post-workout maximizes muscle protein synthesis. Leucine-rich foods (whey, eggs, chicken) are particularly effective at triggering anabolic signaling.",
    category: "muscle-gain",
    source: "Journal of the International Society of Sports Nutrition"
  },
  {
    content: "Creatine monohydrate (3–5g daily) is the most evidence-backed supplement for strength and muscle gain. It increases phosphocreatine stores, improving high-intensity exercise capacity. Carbohydrates consumed around workouts (0.5–1g/kg) replenish glycogen and support recovery. Pre-workout meal should be consumed 1–3 hours before training.",
    category: "muscle-gain",
    source: "ISSN Position Stand on Creatine"
  },

  // ─── Micronutrients ────────────────────────────────────────────────────────
  {
    content: "Vitamin D deficiency affects ~1 billion people worldwide. It's critical for calcium absorption, immune function, and mood regulation. The RDA is 600–800 IU but many experts recommend 1000–2000 IU. Main sources: salmon (447 IU/85g), fortified milk (120 IU/cup), egg yolks (41 IU/egg). Sunlight exposure for 15–30 min daily also produces Vitamin D in skin.",
    category: "micronutrients",
    source: "National Institutes of Health / Endocrine Society"
  },
  {
    content: "Iron is essential for oxygen transport via hemoglobin. Deficiency causes fatigue, poor concentration, and impaired immune function. RDA: 8mg for men, 18mg for premenopausal women. Heme iron (chicken liver 11mg/85g, beef 2.1mg/85g) is more bioavailable than non-heme iron (spinach 3.7mg/100g). Vitamin C consumed with iron significantly increases absorption.",
    category: "micronutrients",
    source: "WHO Iron Deficiency Guidelines"
  },
  {
    content: "Magnesium is involved in 300+ enzymatic reactions including energy production, muscle contraction, and protein synthesis. RDA: 310–420mg. Best food sources: pumpkin seeds (156mg/28g), dark chocolate (64mg/28g), almonds (80mg/28g), spinach (157mg/cooked cup), avocado (58mg each). Magnesium glycinate is the most bioavailable supplement form.",
    category: "micronutrients",
    source: "USDA FoodData Central / NIH"
  },

  // ─── Hydration ─────────────────────────────────────────────────────────────
  {
    content: "The National Academies recommend 3.7L (125 oz) of total water daily for men and 2.7L (91 oz) for women, including water from food. Dehydration of just 1–2% body weight impairs cognitive function and athletic performance. Electrolyte needs increase with exercise: sodium (300–1000mg/hr sweat), potassium, and magnesium are key for hydration balance.",
    category: "hydration",
    source: "National Academies of Sciences / NASM"
  },

  // ─── Meal Timing ───────────────────────────────────────────────────────────
  {
    content: "Meal timing research shows that eating earlier in the day aligns with circadian rhythm and improves insulin sensitivity. Time-restricted eating (TRE) in an 8–10 hour window can improve metabolic markers. Pre-workout: carbs + moderate protein 1–3 hrs before. Post-workout: protein + carbs within 30–120 minutes for optimal recovery and muscle synthesis.",
    category: "meal-timing",
    source: "Chronobiology International / ISSN"
  },
  {
    content: "Breakfast containing 30–40g protein significantly reduces hunger throughout the day and lowers overall caloric intake. High-protein breakfast options: Greek yogurt parfait (~20g), egg white omelette with turkey (~35g), protein smoothie with cottage cheese (~30g), smoked salmon with eggs (~30g). Skipping breakfast is associated with higher total daily caloric intake.",
    category: "meal-timing",
    source: "Journal of Nutrition / American Journal of Clinical Nutrition"
  },

  // ─── Anti-Inflammation ─────────────────────────────────────────────────────
  {
    content: "Chronic inflammation is linked to obesity, type 2 diabetes, heart disease, and cancer. Anti-inflammatory foods: fatty fish (omega-3s), extra virgin olive oil (oleocanthal), berries (anthocyanins), turmeric (curcumin), green tea (EGCG), dark leafy greens, walnuts. The Mediterranean diet pattern consistently reduces inflammatory markers (CRP, IL-6).",
    category: "anti-inflammation",
    source: "Harvard School of Public Health / NEJM"
  },

  // ─── Blood Sugar / Glycemic Control ────────────────────────────────────────
  {
    content: "The glycemic index (GI) ranks foods by their blood glucose impact. Low-GI foods (<55): lentils (32), chickpeas (28), oats (55), sweet potato (44). High-GI foods (>70): white bread (75), corn flakes (93), white rice (73). Pairing carbs with protein, fat, or fiber dramatically lowers the glycemic response. Vinegar before meals also reduces postprandial glucose spikes.",
    category: "blood-sugar",
    source: "Diabetes Care / International Glycemic Index Database"
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const initialCount = await getKnowledgeCount();
  console.log(`📚 Existing knowledge documents: ${initialCount}`);
  
  let created = 0;
  let skipped = 0;

  for (const item of KNOWLEDGE_ITEMS) {
    process.stdout.write(`  Seeding: "${item.content.slice(0, 60)}..." `);
    try {
      const result = await seedKnowledgeDocument(item.content, item.category, item.source);
      if (result.skipped) { console.log("⏭️  skipped (exists)"); skipped++; }
      else { console.log("✅ created"); created++; }
    } catch (err) {
      console.log("❌ ERROR:", err.message);
    }
    // Small delay to respect API rate limits
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n🎉 Seeding complete! Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("Fatal seeding error:", err);
  process.exit(1);
});
