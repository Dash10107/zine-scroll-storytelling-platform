"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MediaCarouselProps {
  images: string[]
  isInView: boolean
}

export function MediaCarousel({ images, isInView }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)

    // Get the starting position
    if ("touches" in e) {
      setDragStartX(e.touches[0].clientX)
    } else {
      setDragStartX(e.clientX)
    }

    setDragOffset(0)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return

    // Calculate drag distance
    let currentX
    if ("touches" in e) {
      currentX = e.touches[0].clientX
    } else {
      currentX = e.clientX
    }

    const offset = currentX - dragStartX
    setDragOffset(offset)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    // Determine if we should change slides based on drag distance
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  // Auto-advance carousel
  useEffect(() => {
    if (!isInView) return

    const interval = setInterval(() => {
      if (!isDragging) {
        nextSlide()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isInView, isDragging])

  // Calculate transform based on current index and drag offset
  const getTransform = () => {
    const baseTransform = -currentIndex * 100
    const dragPercent = (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100
    return `translateX(${baseTransform + dragPercent}%)`
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto my-12 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div
        ref={carouselRef}
        className="overflow-hidden rounded-lg shadow-2xl"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: getTransform(),
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="relative aspect-[16/9]">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        onClick={prevSlide}
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        onClick={nextSlide}
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-4" : "bg-white/50"
            }`}
            onClick={() => {
              setCurrentIndex(index)
            }}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  )
}
