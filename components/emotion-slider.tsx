"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"


export function EmotionSlider() {
  const [value, setValue] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number.parseInt(e.target.value))

    if (!isDragging) {

      setIsDragging(true)
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {

      setIsDragging(false)
    }
  }

  // Get emoji based on value
  const getEmoji = () => {
    if (value < 20) return "😢"
    if (value < 40) return "😕"
    if (value < 60) return "😐"
    if (value < 80) return "🙂"
    return "😍"
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-center mb-2 text-muted-foreground">How does this make you feel?</p>

      <div className="emotion-slider">
        <motion.div className="emotion-slider-track" style={{ width: `${value}%` }} />

        <motion.div
          className="emotion-slider-thumb"
          style={{ left: `${value}%` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {getEmoji()}
        </motion.div>

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Sad</span>
        <span>Neutral</span>
        <span>Happy</span>
      </div>
    </div>
  )
}
