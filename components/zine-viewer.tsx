"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useScroll, useMotionValueEvent, motion } from "framer-motion"
import { ZinePage } from "@/components/zine-page"
import { OutroPage } from "@/components/outro-page"
import { LetterboxOverlay } from "./letterbox-overlay"

export function ZineViewer({ zine, onPageChange, onActivePageChange, activePageIndex = 0 }) {
  const containerRef = useRef(null)
  const [scrollSnapping, setScrollSnapping] = useState(false)
  const [prevActiveIndex, setPrevActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTimeout, setScrollTimeout] = useState(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Safety check to ensure zine and zine.pages exist
  const pages = zine?.pages || []
  const totalPages = pages.length

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Debounced scroll handler for better performance
  const debouncedScrollHandler = useCallback(
    (value) => {
      // Skip processing if zine data isn't properly loaded
      if (!zine || !pages.length) return

      // Calculate the active page index based on scroll progress
      const newIndex = Math.min(
        Math.floor(value * (totalPages + 1)), // +1 for outro page
        totalPages,
      )

      if (newIndex !== activePageIndex) {
        setPrevActiveIndex(activePageIndex)

        // Update parent component with new active page
        if (onActivePageChange) {
          onActivePageChange(newIndex)
        }

        // Trigger page turn effect when changing pages
        if (onPageChange && !isInitialLoad) {
          onPageChange()
        }
      }

      // Track scrolling state
      if (!isScrolling) {
        setIsScrolling(true)

        // Clear any existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }

        // Set a new timeout
        const timeout = setTimeout(() => {
          setIsScrolling(false)
        }, 150)

        setScrollTimeout(timeout)
      }

      // After first scroll event, we're no longer in initial load
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    },
    [
      activePageIndex,
      isInitialLoad,
      isScrolling,
      onActivePageChange,
      onPageChange,
      scrollSnapping,
      scrollTimeout,
      totalPages,
      zine,
      pages.length,
    ],
  )

  // Use useMotionValueEvent for more reliable scroll tracking
  useMotionValueEvent(scrollYProgress, "change", debouncedScrollHandler)

  // Add smooth scrolling behavior
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      // Reset scroll behavior when component unmounts
      document.documentElement.style.scrollBehavior = ""

      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [scrollTimeout])

  // Add keyboard navigation
  useEffect(() => {
    // Skip if zine data isn't properly loaded
    if (!zine || !pages.length) return

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        // Navigate to next page
        if (activePageIndex < totalPages) {
          e.preventDefault() // Prevent default scroll behavior
          if (onActivePageChange) {
            onActivePageChange(activePageIndex + 1)
          }
          if (onPageChange) {
            onPageChange()
          }
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        // Navigate to previous page
        if (activePageIndex > 0) {
          e.preventDefault() // Prevent default scroll behavior
          if (onActivePageChange) {
            onActivePageChange(activePageIndex - 1)
          }
          if (onPageChange) {
            onPageChange()
          }
        }
      } else if (e.key === "Home") {
        // Navigate to first page
        e.preventDefault()
        if (onActivePageChange) {
          onActivePageChange(0)
        }
        if (onPageChange) {
          onPageChange()
        }
      } else if (e.key === "End") {
        // Navigate to last page
        e.preventDefault()
        if (onActivePageChange) {
          onActivePageChange(totalPages)
        }
        if (onPageChange) {
          onPageChange()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activePageIndex, onActivePageChange, onPageChange, totalPages, zine, pages.length])

  // If zine isn't loaded properly, show a loading placeholder
  if (!zine || !pages.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl opacity-50">Loading zine content...</div>
      </div>
    )
  }

  return (
    <>
      {/* Cinematic Letterbox Effect */}
      <LetterboxOverlay />

      {/* Initial fade-in animation for the entire zine */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        ref={containerRef}
        className="relative"
      >
        {/* Render all zine pages */}
        {pages.map((page, index) => (
          <ZinePage
            key={`page-${index}`}
            page={page}
            index={index}
            isActive={index === activePageIndex}
            scrollYProgress={scrollYProgress}
            totalPages={totalPages}
          />
        ))}

        {/* Outro page */}
        <OutroPage 
          zine={zine} 
          isActive={activePageIndex === totalPages} 
          scrollYProgress={scrollYProgress} 
        />
      </motion.div>
    </>
  )
}
