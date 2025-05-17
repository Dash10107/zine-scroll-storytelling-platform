"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  strength?: number
}

export function MagneticButton({ children, strength = 30 }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()

    const x = (clientX - (left + width / 2)) / strength
    const y = (clientY - (top + height / 2)) / strength

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }



  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    button.addEventListener("mousemove", handleMouseMove)
    button.addEventListener("mouseleave", handleMouseLeave)
 
    return () => {
      button.removeEventListener("mousemove", handleMouseMove)
      button.removeEventListener("mouseleave", handleMouseLeave)

    }
  }, [])

  const springConfig = {
    type: "spring",
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  }

  return (
    <motion.div
      ref={buttonRef}
      className="magnetic-button"
      animate={{ x: position.x, y: position.y }}
      transition={springConfig}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="magnetic-button-content"
        animate={{ x: position.x * 1.5, y: position.y * 1.5 }}
        transition={springConfig}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
