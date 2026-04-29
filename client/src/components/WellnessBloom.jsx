import { motion } from "framer-motion";

export default function WellnessBloom({ stats }) {
  // Extract simple numeric values from stats for the bloom (mocking some if needed)
  const waterVal = parseFloat(stats.avgWater || 0) / 2; // Assuming 2L is goal, so 0-1
  const waterScale = Math.min(Math.max(waterVal, 0.2), 1.2);

  // We can use random or fixed values for demonstration if actual metrics aren't cleanly 0-100
  const petalVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (custom) => ({
      scale: custom.scale,
      opacity: 0.8,
      transition: {
        duration: 2,
        ease: [0.34, 1.56, 0.64, 1],
        delay: custom.delay
      }
    }),
    hover: { scale: 1.1, opacity: 1, filter: "brightness(1.2)" }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="-100 -100 200 200" style={{ width: "100%", height: "100%", maxWidth: 300 }}>
        <defs>
          <radialGradient id="bloomCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--gold-pale)" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="petal1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--sage-pale)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="petal2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--slate)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--slate-pale)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="petal3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--rust)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--rust-pale)" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Core */}
        <motion.circle 
          cx="0" cy="0" r="15" 
          fill="url(#bloomCore)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Petal 1: Hydration */}
        <motion.path 
          d="M 0,-15 C 20,-60 60,-60 0,-90 C -60,-60 -20,-60 0,-15 Z" 
          fill="url(#petal1)"
          custom={{ scale: waterScale, delay: 0.2 }}
          variants={petalVariants}
          initial="initial" animate="animate" whileHover="hover"
        />

        {/* Petal 2: Activity/Streak */}
        <motion.path 
          d="M 12,-8 C 50,10 50,50 80,30 C 60,-20 20,-20 12,-8 Z" 
          fill="url(#petal2)"
          custom={{ scale: 0.9, delay: 0.4 }}
          variants={petalVariants}
          initial="initial" animate="animate" whileHover="hover"
        />

        {/* Petal 3: Nutrition */}
        <motion.path 
          d="M -12,-8 C -50,10 -50,50 -80,30 C -60,-20 -20,-20 -12,-8 Z" 
          fill="url(#petal3)"
          custom={{ scale: 0.75, delay: 0.6 }}
          variants={petalVariants}
          initial="initial" animate="animate" whileHover="hover"
        />

        {/* Petal 4: Balance */}
        <motion.path 
          d="M 0,15 C 20,60 60,60 0,90 C -60,60 -20,60 0,15 Z" 
          fill="url(#petal1)"
          custom={{ scale: 0.85, delay: 0.8 }}
          variants={petalVariants}
          initial="initial" animate="animate" whileHover="hover"
        />
      </svg>
      
      <div style={{ position: "absolute", bottom: 20, textAlign: "center" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-60)" }}>Wellness Bloom</p>
      </div>
    </div>
  );
}
