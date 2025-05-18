"use client"

import { useEffect, useState } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface EnhancedScrollIndicatorProps {
  scrollProgress: MotionValue<number>
  isActive: boolean
}

export function EnhancedScrollIndicator({ scrollProgress, isActive }: EnhancedScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Transform values based on scroll progress
  const opacity = useTransform(scrollProgress, [0, 0.1, 0.9, 1], [1, 0.7, 0.7, 0])
  const scale = useTransform(scrollProgress, [0, 0.1, 0.9, 1], [1, 0.9, 0.9, 0.8])
  const y = useTransform(scrollProgress, [0, 0.1, 0.9, 1], [0, 5, 5, 10])

  // Hide indicator after a delay
  useEffect(() => {
    if (!isActive) return

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isActive])

  // Show indicator when user stops scrolling
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsVisible(false)
      clearTimeout(scrollTimeout)

      scrollTimeout = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  if (!isActive) return null
  const b = false
  return (
    <motion.div
      className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-50"
      style={{
        opacity: isVisible ? opacity : 0,
        scale,
        y,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-white/70 text-sm font-medium backdrop-blur-sm px-3 py-1 rounded-full bg-black/20"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        Scroll to explore
      </motion.div>

      <motion.div
        className="flex flex-col items-center"
        animate={{
          y: [0, 5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={{
            y: [0, 5, 0],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="text-primary" size={20} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 5, 0],
            opacity: [0.7, 0.5, 0.7],
          }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <ChevronDown className="text-primary/70 -mt-3" size={16} />
        </motion.div>
      </motion.div>

      {/* Add a pulsing circle for extra visual interest */}
      {b && (
        <motion.div
          className="absolute -z-10 rounded-full bg-primary/20 backdrop-blur-sm"
          initial={{ width: 30, height: 30 }}
          animate={{
            width: [30, 60, 30],
            height: [30, 60, 30],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  )
}
