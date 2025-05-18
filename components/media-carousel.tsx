"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ImageHoverEffect } from "./image-hover-effect"

interface MediaCarouselProps {
  images: string[]
  isInView: boolean
}

export function MediaCarousel({ images, isInView }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const controls = useAnimation()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset animation when images change
  useEffect(() => {
    controls.set({ opacity: 0, scale: 0.95 })
    controls.start({ opacity: 1, scale: 1, transition: { duration: 0.5 } })
  }, [images, controls])

  // Handle autoplay
  useEffect(() => {
    if (!isInView || isHovering) {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
      return
    }

    autoplayTimerRef.current = setTimeout(() => {
      handleNext()
    }, 5000)

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }
  }, [currentIndex, isInView, isHovering])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    }),
  }

  return (
    <motion.div
      ref={carouselRef}
      className="relative w-full max-w-4xl mx-auto my-8 overflow-hidden rounded-lg"
      animate={controls}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          <ImageHoverEffect
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Gallery image ${currentIndex + 1}`}
            width={1200}
            height={800}
            caption={`Image ${currentIndex + 1} of ${images.length}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <motion.button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full"
        onClick={handlePrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronLeft size={20} />
      </motion.button>

      <motion.button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full"
        onClick={handleNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronRight size={20} />
      </motion.button>

      {/* Dots indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {images.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-white/50"}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            whileHover={{ scale: 1.5 }}
            animate={{
              scale: index === currentIndex ? 1.5 : 1,
              backgroundColor: index === currentIndex ? "rgb(236, 72, 153)" : "rgba(255, 255, 255, 0.5)",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
