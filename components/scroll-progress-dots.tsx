"use client"

import { motion } from "framer-motion"


interface ScrollProgressDotsProps {
  totalPages: number
  activeIndex: number
  onDotClick: (index: number) => void
}

export function ScrollProgressDots({ totalPages, activeIndex, onDotClick }: ScrollProgressDotsProps) {

  // Only show a maximum of 7 dots, with ellipsis for the rest
  const showAllDots = totalPages <= 7

  // Generate array of dots to display
  const dotsToShow = () => {
    if (showAllDots) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    // Always show first, last, active, and dots around active
    const dots: number[] = [0, totalPages - 1]

    // Add active and surrounding dots
    const surroundingDots = [activeIndex - 1, activeIndex, activeIndex + 1]
    surroundingDots.forEach((index) => {
      if (index > 0 && index < totalPages - 1) {
        dots.push(index)
      }
    })

    // Sort and remove duplicates
    return [...new Set(dots)].sort((a, b) => a - b)
  }

  const dots = dotsToShow()

  // Check if we need to add ellipsis
  const needsStartEllipsis = !showAllDots && !dots.includes(1)
  const needsEndEllipsis = !showAllDots && !dots.includes(totalPages - 2)

  return (
    <motion.div
      className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      {dots.map((index, i) => {
        // Add ellipsis if needed
        const showStartEllipsis = needsStartEllipsis && index === 0 && dots[i + 1] !== 1
        const showEndEllipsis = needsEndEllipsis && index === totalPages - 1 && dots[i - 1] !== totalPages - 2

        return (
          <div key={index} className="flex flex-col items-center gap-2">
            <motion.button
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-primary scale-125" : "bg-white/30 hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                onDotClick(index)

              }}
              aria-label={`Go to page ${index + 1}`}
            />

            {showStartEllipsis && <div className="my-1 text-white/30 text-xs font-bold">⋮</div>}

            {showEndEllipsis && <div className="my-1 text-white/30 text-xs font-bold">⋮</div>}
          </div>
        )
      })}
    </motion.div>
  )
}
