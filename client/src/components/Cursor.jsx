import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for the ultra-smooth trailing effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    // Detect hovering over clickable elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('chip') ||
        target.classList.contains('nav-item')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        translateX: smoothX,
        translateY: smoothY,
        x: "-50%",
        y: "-50%",
        width: hovering ? 40 : 12,
        height: hovering ? 40 : 12,
        backgroundColor: hovering ? "transparent" : "#FFFFFF",
        border: hovering ? "1px solid rgba(255,255,255,0.5)" : "none",
        borderRadius: "50%",
        mixBlendMode: "difference", /* Inverts colors behind it */
        backdropFilter: hovering ? "invert(1)" : "none",
      }}
      initial={false}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
}
