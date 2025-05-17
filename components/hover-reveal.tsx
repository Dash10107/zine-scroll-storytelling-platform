"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"


interface HoverRevealProps {
  children: React.ReactNode
}

export function HoverReveal({ children }: HoverRevealProps) {
  const [isHovered, setIsHovered] = useState(false)
 

  const handleMouseEnter = () => {
    setIsHovered(true)

  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <motion.div
      className="hover-reveal hover-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
