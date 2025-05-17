"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [hoveredElementType, setHoveredElementType] = useState<string | null>(null)
  const [cursorText, setCursorText] = useState("")
  const [cursorSize, setCursorSize] = useState(30)
  const [cursorOpacity, setCursorOpacity] = useState(0.8)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Create springs with some damping and stiffness for smooth following
  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 })
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 })

  // For the dot, use the raw values for more immediate movement
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  // For the glow effect
  const glowX = useSpring(cursorX, { damping: 50, stiffness: 200 })
  const glowY = useSpring(cursorY, { damping: 50, stiffness: 200 })

  useEffect(() => {
    // Check if we're on a touch device
    const isTouchDevice = () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0
    }

    // Don't initialize on touch devices
    if (isTouchDevice()) {
      return
    }

    // Hide the default cursor
    document.body.style.cursor = "none"

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Add hover detection for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check for data-cursor-interact attribute first
      const isInteractive = target.hasAttribute("data-cursor-interact") || target.closest("[data-cursor-interact]")

      if (isInteractive) {
        setIsHovered(true)
        setCursorSize(60)
        setCursorOpacity(0.9)

        // Detect element type for custom cursor styles
        if (target.tagName === "A" || target.closest("a")) {
          setHoveredElementType("link")
          setCursorText("View")
        } else if (
          target.tagName === "BUTTON" ||
          target.closest("button") ||
          target.getAttribute("role") === "button" ||
          target.closest('[role="button"]')
        ) {
          setHoveredElementType("button")
          setCursorText("Click")
        } else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
          setHoveredElementType("input")
          setCursorText("")
          setCursorSize(4)
        } else if (target.classList.contains("hover-trigger") || target.closest(".hover-trigger")) {
          setHoveredElementType("hover")
          setCursorText("View")
        } else {
          setHoveredElementType("interactive")
          setCursorText("Interact")
        }
      } else {
        setIsHovered(false)
        setHoveredElementType(null)
        setCursorText("")
        setCursorSize(30)
        setCursorOpacity(0.8)
      }
    }

    const handleElementLeave = () => {
      setIsHovered(false)
      setHoveredElementType(null)
      setCursorText("")
      setCursorSize(30)
      setCursorOpacity(0.8)
    }

    // Select all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, .hover-trigger, [data-cursor-interact]',
    )

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementHover as any)
      el.addEventListener("mouseleave", handleElementLeave)
    })

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      // Restore default cursor
      document.body.style.cursor = ""

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover as any)
        el.removeEventListener("mouseleave", handleElementLeave)
      })
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [cursorX, cursorY, dotX, dotY])

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  // Get inner dot size based on state
  const getDotSize = () => {
    if (hoveredElementType === "button") return 0
    if (hoveredElementType === "link") return 0
    if (hoveredElementType === "hover") return 0
    if (hoveredElementType === "interactive") return 0
    if (isHovered) return 0
    return 4
  }

  return (
    <>
      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997] bg-primary/20 blur-xl"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: cursorSize * 2,
          height: cursorSize * 2,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? 0.5 : 0,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Main cursor ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: cursorSize,
          height: cursorSize,
          backgroundColor: "transparent",
          border: "1.5px solid rgba(255, 255, 255, 0.8)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? cursorOpacity : 0,
          scale: isClicking ? 0.9 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Text inside cursor for buttons/links */}
        {cursorText && (
          <motion.span
            className="text-white text-[10px] font-medium uppercase tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: getDotSize(),
          height: getDotSize(),
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible && !isHovered ? 1 : 0,
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Magnetic effect highlight for buttons */}
      {hoveredElementType === "button" && (
        <motion.div
          className="fixed top-0 left-0 rounded-full bg-white/10 pointer-events-none z-[9998]"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: 80,
            height: 80,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  )
}
