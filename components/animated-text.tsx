"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  delay?: number
  duration?: number
  staggerChildren?: number
  isInView?: boolean
  type?: "word" | "character" | "line"
}

export function AnimatedText({
  text,
  className = "",
  once = true,
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.03,
  isInView = true,
  type = "word",
}: AnimatedTextProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setShouldAnimate(true)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isInView, delay])

  // Split text into words, characters, or lines
  const getTextArray = () => {
    if (type === "word") {
      return text.split(" ").map((word) => `${word} `)
    } else if (type === "character") {
      return text.split("")
    } else {
      return text.split("\n").map((line) => `${line}\n`)
    }
  }

  const textArray = getTextArray()

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    }),
  }

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration,
      },
    },
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate={shouldAnimate && isInView ? "visible" : "hidden"}
    >
      {textArray.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{
            whiteSpace: type === "line" ? "pre-wrap" : "normal",
          }}
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  )
}
