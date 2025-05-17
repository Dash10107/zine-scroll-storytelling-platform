"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"


interface RevealTextProps {
  children: React.ReactNode
  delay?: number
}

export function RevealText({ children, delay = 0 }: RevealTextProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  // const { playSound } = useSoundContext()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true)
      // playSound("reveal")
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <motion.div className="relative overflow-hidden" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
      {/* The actual content */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={isRevealed ? { y: 0, opacity: 1 } : {}}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>

      {/* Reveal overlay */}
      <motion.div
        className="absolute inset-0 bg-primary z-10"
        initial={{ scaleX: 1 }}
        animate={isRevealed ? { scaleX: 0 } : {}}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ originX: 0 }}
      />
    </motion.div>
  )
}
