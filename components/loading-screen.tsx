"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  title?: string
}

export function LoadingScreen({ title }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15
        return next > 100 ? 100 : next
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6 text-gradient">
          {title || "Loading Experience"}
        </h1>

        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-muted-foreground font-light">
          {progress < 100 ? "Preparing your sensory experience..." : "Ready to explore"}
        </p>
      </motion.div>
    </motion.div>
  )
}
