"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GlitchTextProps {
  text: string
  isActive: boolean
}

export function GlitchText({ text, isActive }: GlitchTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [glitchIntensity, setGlitchIntensity] = useState(1)
  const [glitchColor, setGlitchColor] = useState("primary")

  // Randomly show and hide the glitch text
  useEffect(() => {
    if (!isActive) {
      setIsVisible(false)
      return
    }

    // Random position
    setPosition({
      x: Math.random() * 80 - 40, // -40% to 40%
      y: Math.random() * 60 - 30, // -30% to 30%
    })

    // Random glitch intensity (1-3)
    setGlitchIntensity(Math.floor(Math.random() * 3) + 1)

    // Random color
    const colors = ["primary", "blue-400", "purple-500", "pink-500"]
    setGlitchColor(colors[Math.floor(Math.random() * colors.length)])

    // Random appearance
    const showTimeout = setTimeout(
      () => {
        setIsVisible(true)

        // Hide after a short time
        const hideTimeout = setTimeout(
          () => {
            setIsVisible(false)
          },
          1000 + Math.random() * 2000,
        ) // 1-3 seconds

        return () => clearTimeout(hideTimeout)
      },
      1000 + Math.random() * 3000,
    ) // 1-4 seconds

    return () => clearTimeout(showTimeout)
  }, [isActive, isVisible])

  // Always render the component, but conditionally render its contents
  return (
    <AnimatePresence>
      {isVisible && isActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative"
            style={{
              x: `${position.x}vw`,
              y: `${position.y}vh`,
            }}
          >
            <motion.h2
              className="text-4xl md:text-7xl font-bold text-white mix-blend-difference font-playfair"
              initial={{ scale: 0.8, filter: "blur(10px)" }}
              animate={{
                scale: [0.8, 1.2, 1],
                filter: ["blur(10px)", "blur(0px)", "blur(2px)"],
              }}
              exit={{
                scale: [1, 1.1, 0],
                filter: ["blur(2px)", "blur(0px)", "blur(15px)"],
              }}
              transition={{ duration: 0.5 }}
            >
              {text}
            </motion.h2>

            {/* Glitch effects - intensity level 1 */}
            <motion.h2
              className={`text-4xl md:text-7xl font-bold text-${glitchColor} absolute top-0 left-0 opacity-70 font-playfair`}
              initial={{ x: -5, y: -5 }}
              animate={{ x: [-5, 5, -3], y: [-5, 3, -5] }}
              exit={{ x: 10, y: -10, opacity: 0 }}
              transition={{ duration: 0.3, repeat: 3, repeatType: "reverse" }}
            >
              {text}
            </motion.h2>

            <motion.h2
              className="text-4xl md:text-7xl font-bold text-blue-400 absolute top-0 left-0 opacity-70 font-playfair"
              initial={{ x: 5, y: 5 }}
              animate={{ x: [5, -5, 3], y: [5, -3, 5] }}
              exit={{ x: -10, y: 10, opacity: 0 }}
              transition={{ duration: 0.3, repeat: 3, repeatType: "reverse" }}
            >
              {text}
            </motion.h2>

            {/* Additional glitch effects for higher intensity levels */}
            {glitchIntensity >= 2 && (
              <>
                <motion.h2
                  className="text-4xl md:text-7xl font-bold text-purple-500 absolute top-0 left-0 opacity-50 font-playfair"
                  initial={{ x: 3, y: -8 }}
                  animate={{ x: [3, -8, 5], y: [-8, 4, -3] }}
                  exit={{ x: -15, y: 15, opacity: 0 }}
                  transition={{ duration: 0.2, repeat: 5, repeatType: "reverse" }}
                >
                  {text}
                </motion.h2>

                {/* Scanline effect */}
                <motion.div
                  className="absolute inset-0 overflow-hidden opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-[2px] bg-white w-full absolute"
                      style={{ top: `${i * 10}%` }}
                      animate={{
                        x: ["-100%", "100%"],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "linear",
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              </>
            )}

            {/* Even more intense effects for level 3 */}
            {glitchIntensity >= 3 && (
              <>
                <motion.h2
                  className="text-4xl md:text-7xl font-bold text-pink-500 absolute top-0 left-0 opacity-40 font-playfair"
                  initial={{ x: -10, y: 10 }}
                  animate={{
                    x: [-10, 15, -5, 20, -10],
                    y: [10, -15, 5, -20, 10],
                    opacity: [0.4, 0.6, 0.3, 0.7, 0.4],
                  }}
                  exit={{ x: 20, y: -20, opacity: 0 }}
                  transition={{
                    duration: 0.15,
                    repeat: 8,
                    repeatType: "reverse",
                    times: [0, 0.2, 0.4, 0.6, 1],
                  }}
                >
                  {text}
                </motion.h2>

                {/* Noise overlay */}
                <motion.div
                  className="absolute inset-0 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.2, repeat: 5, repeatType: "reverse" }}
                />
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
