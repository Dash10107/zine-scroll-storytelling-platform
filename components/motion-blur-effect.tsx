"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface MotionBlurEffectProps {
  scrollVelocity: number
  isActive: boolean
}

export function MotionBlurEffect({ scrollVelocity, isActive }: MotionBlurEffectProps) {
  const [hasRendered, setHasRendered] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [overlayOpacity, setOverlayOpacity] = useState(0)

  // Calculate blur and opacity based on scroll velocity
  useEffect(() => {
    if (!isActive) return

    // Map scroll velocity to blur amount
    let newBlurAmount = 0
    if (scrollVelocity <= 5) {
      newBlurAmount = scrollVelocity * 0.4 // 0-2px blur for slow scrolling
    } else if (scrollVelocity <= 10) {
      newBlurAmount = 2 + (scrollVelocity - 5) * 0.6 // 2-5px blur for medium scrolling
    } else {
      newBlurAmount = 5 + Math.min(5, (scrollVelocity - 10) * 0.5) // 5-10px blur for fast scrolling
    }

    // Map scroll velocity to overlay opacity
    let newOpacity = 0
    if (scrollVelocity <= 5) {
      newOpacity = scrollVelocity * 0.02 // 0-0.1 opacity for slow scrolling
    } else if (scrollVelocity <= 10) {
      newOpacity = 0.1 + (scrollVelocity - 5) * 0.04 // 0.1-0.3 opacity for medium scrolling
    } else {
      newOpacity = 0.3 + Math.min(0.2, (scrollVelocity - 10) * 0.02) // 0.3-0.5 opacity for fast scrolling
    }

    setBlurAmount(newBlurAmount)
    setOverlayOpacity(newOpacity)
  }, [scrollVelocity, isActive])

  // Only enable on client-side to avoid hydration issues
  useEffect(() => {
    setHasRendered(true)
  }, [])

  if (!hasRendered || !isActive || scrollVelocity < 1) return null

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        opacity: overlayOpacity,
        background: "transparent",
      }}
      transition={{ duration: 0.2 }}
    />
  )
}
