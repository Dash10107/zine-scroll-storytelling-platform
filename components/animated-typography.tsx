"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

interface AnimatedTypographyProps {
  text: string
  type: "heading" | "body" | "quote"
  delay?: number
  isInView?: boolean
}

export function AnimatedTypography({ text, type, delay = 0, isInView: propIsInView }: AnimatedTypographyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const internalIsInView = useInView(ref, { once: true, amount: 0.3 })
  const isInView = propIsInView !== undefined ? propIsInView : internalIsInView
  const [hasAnimated, setHasAnimated] = useState(false)

  // Track if animation has completed to prevent re-animation
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  // For headings, split into words for more dramatic animation
  if (type === "heading") {
    const words = text.split(" ")

    return (
      <motion.div ref={ref} className="overflow-hidden">
        <h2 className="text-4xl md:text-6xl font-bold font-playfair text-gradient tracking-tight flex flex-wrap justify-center md:justify-start">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mx-2 my-1"
              initial={{ opacity: 0, y: 50, rotate: Math.random() * 10 - 5 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: delay + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </motion.div>
    )
  }

  // For quotes, use a different style with character-by-character animation
  if (type === "quote") {
    const characters = text.split("")

    return (
      <motion.blockquote
        ref={ref}
        className="text-2xl md:text-3xl italic font-cormorant my-12 max-w-2xl mx-auto text-primary/90 border-l-4 border-primary/50 pl-6"
      >
        <span className="inline-block">"</span>
        {characters.map((char, idx) => (
          <motion.span
            key={idx}
            className="inline-block"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.3,
                      delay: delay + idx * 0.02,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
                : {}
            }
          >
            {char}
          </motion.span>
        ))}
        <span className="inline-block">"</span>
      </motion.blockquote>
    )
  }

  // For body text, animate paragraphs with staggered line reveals
  const paragraphs = text.split("\n").filter((p) => p.trim() !== "")

  return (
    <motion.div ref={ref} className="text-lg md:text-xl leading-relaxed space-y-6 max-w-3xl mx-auto">
      {paragraphs.map((paragraph, idx) => {
        // Split paragraph into lines for line-by-line animation
        // This is an approximation since actual line breaks depend on the browser
        const approximateLines = Math.ceil(paragraph.length / 50) // Assume ~50 chars per line

        return (
          <motion.p key={idx} className="font-light tracking-wide relative overflow-hidden">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: delay + idx * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {paragraph}
            </motion.span>

            {/* Animated underline effect for emphasis */}
            {idx === 0 && (
              <motion.span
                className="absolute bottom-0 left-0 h-[1px] bg-primary/30"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{
                  duration: 1.2,
                  delay: delay + 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            )}
          </motion.p>
        )
      })}
    </motion.div>
  )
}
