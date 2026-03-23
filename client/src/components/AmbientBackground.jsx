import { motion, useScroll, useTransform } from "framer-motion";

export default function AmbientBackground() {
  const { scrollY } = useScroll();
  // Extremely subtle parallax on the orbs when scrolling the page
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "var(--bg-gradient)" }}>
      
      {/* ─── Static Noise Overlay ─── */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.15, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "150px 150px"
      }} />

      {/* ─── Floating Radial Orbs ─── */}
      <motion.div
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, -30, 0, 30, 0],
          scale: [1, 1.1, 1, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", top: "10%", left: "20%",
          width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 230, 118, 0.08) 0%, transparent 70%)",
          filter: "blur(80px)", mixBlendMode: "screen", y: y1
        }}
      />
      
      <motion.div
        animate={{
          x: [0, -60, 0, 60, 0],
          y: [0, 40, 0, -40, 0],
          scale: [1, 0.8, 1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", bottom: "10%", right: "10%",
          width: "60vw", height: "60vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41, 121, 255, 0.06) 0%, transparent 70%)",
          filter: "blur(100px)", mixBlendMode: "screen", y: y2
        }}
      />
      
    </div>
  );
}
