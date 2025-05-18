"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, animate } from "framer-motion"

export default function CustomCursor({
  // Customization props with defaults
  dotSize = 6,
  ringSize = 24,
  hoverScale = 2.5,
  clickScale = 0.85,
  dotColor = "#ffffff",
  ringColor = "rgba(255,255,255,0.5)",
  glowColor = "rgba(173,216,230,0.15)",
  hoverGlowColor = "rgba(0, 200, 255, 0.2)",
  clickGlowColor = "rgba(255, 100, 100, 0.25)",
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [cursorSize, setCursorSize] = useState(ringSize)
  const [currentGlowColor, setCurrentGlowColor] = useState(glowColor)

  // Mouse position values
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Spring animations for smoother movement
  const springX = useSpring(cursorX, { damping: 25, stiffness: 250 })
  const springY = useSpring(cursorY, { damping: 25, stiffness: 250 })

  // Dot follows cursor exactly (no spring)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  // Glow effect follows with delay
  const glowX = useSpring(cursorX, { damping: 50, stiffness: 90 })
  const glowY = useSpring(cursorY, { damping: 50, stiffness: 90 })

  // Handle element hover with custom data attributes
  const handleElementInteraction = useCallback((e) => {
    const target = e.target
    const interactElement = target.closest("[data-cursor-interact]")
    
    if (interactElement) {
      setIsHovered(true)
      
      // Get custom attributes if available
      const scale = interactElement.getAttribute("data-cursor-scale") || hoverScale
      const text = interactElement.getAttribute("data-cursor-text") || ""
      
      setCursorSize(ringSize * Number(scale))
      setCursorText(text)
      setCurrentGlowColor(hoverGlowColor)
    } else {
      setIsHovered(false)
      setCursorSize(ringSize)
      setCursorText("")
      setCurrentGlowColor(glowColor)
    }
  }, [ringSize, hoverScale, hoverGlowColor, glowColor])

  useEffect(() => {
    // Check if device supports touch (mobile devices)
    const isTouchDevice = () =>
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      ((navigator?.msMaxTouchPoints ?? 0) > 0)

    // Exit early for touch devices
    if (isTouchDevice()) {
      setIsVisible(false)
      return
    }

    // Hide default cursor
    document.documentElement.style.cursor = "none"
    
    // Show cursor when it enters the viewport
    setIsVisible(true)

    // Mouse movement handler
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }

    // Mouse event handlers
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    
    const handleMouseDown = () => {
      setIsClicking(true)
      setCurrentGlowColor(clickGlowColor)
      
      // Create click ripple effect
      const ripple = document.createElement("div")
      ripple.className = "cursor-ripple"
      ripple.style.position = "fixed"
      ripple.style.borderRadius = "50%"
      ripple.style.border = "2px solid rgba(255,255,255,0.3)"
      ripple.style.transform = "translate(-50%, -50%)"
      ripple.style.pointerEvents = "none"
      ripple.style.zIndex = "9998"
      ripple.style.width = "20px"
      ripple.style.height = "20px"
      ripple.style.left = `${cursorX.get()}px`
      ripple.style.top = `${cursorY.get()}px`
      document.body.appendChild(ripple)
      
      // Animate and remove the ripple
      animate(
        ripple, 
        { opacity: [1, 0], width: ["20px", "50px"], height: ["20px", "50px"] },
        { duration: 0.8, ease: "easeOut", onComplete: () => ripple.remove() }
      )
    }
    
    const handleMouseUp = () => {
      setIsClicking(false)
      setCurrentGlowColor(isHovered ? hoverGlowColor : glowColor)
    }

    // Query all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor-interact]'
    )

    // Add data-cursor-interact to all interactive elements that don't have it
    interactiveElements.forEach((el) => {
      if (!el.hasAttribute("data-cursor-interact")) {
        el.setAttribute("data-cursor-interact", "true")
      }
    })

    // Add event listeners
    document.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleElementInteraction)

    // Cleanup function
    return () => {
      document.documentElement.style.cursor = ""
      document.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleElementInteraction)
    }
  }, [
    cursorX, cursorY, dotX, dotY, 
    handleElementInteraction, 
    hoverGlowColor, glowColor, clickGlowColor
  ])

  // Return early if cursor should not be visible (touch devices)
  if (!isVisible) return null

  return (
    <>
      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: cursorSize * 2.5,
          height: cursorSize * 2.5,
          background: `radial-gradient(circle, ${currentGlowColor}, rgba(0,0,0,0))`,
          filter: "blur(15px)"
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 1.2 : 1
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: cursorSize,
          height: cursorSize,
          border: `1px solid ${ringColor}`,
          background: isHovered ? "rgba(255,255,255,0.08)" : "transparent",
          boxShadow: isHovered
            ? "0 0 10px rgba(0, 200, 255, 0.4)"
            : "0 0 4px rgba(255,255,255,0.2)",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? clickScale : 1,
          borderWidth: isHovered ? "1.5px" : "1px",
        }}
        transition={{ 
          duration: 0.2,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        {/* Cursor text (shows when data-cursor-text is set) */}
        {cursorText && (
          <motion.span 
            className="text-white text-xs font-medium whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
          background: dotColor,
          boxShadow: "0 0 8px rgba(255,255,255,0.5)",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.5 : 1
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}