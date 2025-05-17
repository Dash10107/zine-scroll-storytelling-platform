"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface PerspectiveTextProps {
  children: React.ReactNode
}

export function PerspectiveText({ children }: PerspectiveTextProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="perspective-[1000px] inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          rotateX: isHovered ? 15 : 0,
          y: isHovered ? -5 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
