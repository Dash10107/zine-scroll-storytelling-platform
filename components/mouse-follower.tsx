"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

export function MouseFollower() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [hoveredElementType, setHoveredElementType] = useState<string | null>(null)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Create springs with some damping and stiffness for smooth following
  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 })
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 })

  useEffect(() => {
    // Detect if we're on a touch device
    const isTouchDevice = () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0
    }

    // Don't initialize on touch devices
    if (isTouchDevice()) {
      return
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Add hover detection for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovered(true)

      // Detect element type for custom cursor styles
      if (target.tagName === "A" || target.closest("a")) {
        setHoveredElementType("link")
      } else if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.getAttribute("role") === "button" ||
        target.closest('[role="button"]')
      ) {
        setHoveredElementType("button")
      } else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        setHoveredElementType("input")
      } else {
        setHoveredElementType(null)
      }
    }

    const handleElementLeave = () => {
      setIsHovered(false)
      setHoveredElementType(null)
    }

    // Select all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, .hover-trigger',
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
  }, [cursorX, cursorY])

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  // Get cursor size based on state
  const getCursorSize = () => {
    if (hoveredElementType === "button") return 60
    if (hoveredElementType === "link") return 50
    if (hoveredElementType === "input") return 4
    if (isHovered) return 40
    return 30
  }

  // Get inner dot size based on state
  const getDotSize = () => {
    if (hoveredElementType === "button") return 0
    if (hoveredElementType === "link") return 0
    if (isHovered) return 0
    return 4
  }

  // Get cursor text based on element type
  const getCursorText = () => {
    if (hoveredElementType === "button") return "Click"
    if (hoveredElementType === "link") return "View"
    return ""
  }

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: getCursorSize(),
          height: getCursorSize(),
          backgroundColor: "transparent",
          border: "1.5px solid rgba(255, 255, 255, 0.8)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.9 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Text inside cursor for buttons/links */}
        <AnimatePresence>
          {getCursorText() && (
            <motion.span
              className="text-white text-[10px] font-medium uppercase tracking-wider"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {getCursorText()}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
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
      <AnimatePresence>
        {hoveredElementType === "button" && (
          <motion.div
            className="fixed top-0 left-0 rounded-full bg-white/10 pointer-events-none z-[9998]"
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: 80,
              height: 80,
              opacity: 0.2,
            }}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
