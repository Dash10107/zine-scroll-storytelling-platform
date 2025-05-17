"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PageTurnEffectProps {
  children: React.ReactNode
  isActive: boolean
}

export function PageTurnEffect({ children, isActive }: PageTurnEffectProps) {
  const [isTurning, setIsTurning] = useState(false)
  const [key, setKey] = useState(0) // Key to force re-render

  useEffect(() => {
    if (isActive) {
      setIsTurning(true)

      // Increment key to force re-render and reset animation
      setKey((prev) => prev + 1)

      const timer = setTimeout(() => {
        setIsTurning(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <div className="perspective-[2000px] w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          className="w-full h-full transform-style-preserve-3d"
          style={{
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          initial={{ rotateY: isTurning ? -90 : 0 }}
          animate={{ rotateY: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: isTurning ? 0.1 : 0,
          }}
        >
          <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: "hidden" }}>
            {children}
          </div>

          {/* Add page edge shadow effect */}
          {isTurning && (
            <motion.div
              className="absolute inset-y-0 left-0 w-12 pointer-events-none"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.3), transparent)",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
