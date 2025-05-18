"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { MotionValue } from "framer-motion"
import { SensoryPage } from "@/components/sensory-page"
import { ZineIntro } from "@/components/zine-intro"
import { ZineOutro } from "@/components/zine-outro"


interface ZineViewerProps {
  zine: any
  scrollProgress: MotionValue<number>
  activePageIndex: number
  setActivePageIndex: (index: number) => void
  scrollVelocity?: number
  theme?: string
}

export function ZineViewer({
  zine,
  scrollProgress,
  activePageIndex,
  setActivePageIndex,
  scrollVelocity = 0,
  theme = "default",
}: ZineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Array<HTMLElement | null>>([])

  const [hasInteracted, setHasInteracted] = useState(false)
  const [isReversing, setIsReversing] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Set up page refs
  useEffect(() => {
    pageRefs.current = Array(zine.pages.length + 2).fill(null)

    // Mark initial load as complete after a short delay
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [zine.pages.length])

  // Handle scroll to detect active page and scroll direction
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const scrollTop = window.scrollY || document.documentElement.scrollTop

    // Detect scroll direction
    const isScrollingUp = scrollTop < lastScrollTop
    if (isScrollingUp !== isReversing) {
      setIsReversing(isScrollingUp)

      // Trigger easter egg when scrolling backward
      if (isScrollingUp && !hasInteracted && !isInitialLoad) {
        setHasInteracted(true)
      }
    }

    setLastScrollTop(scrollTop)

    // Find active page based on scroll position
    const viewportHeight = window.innerHeight
    const viewportCenter = scrollTop + viewportHeight / 2

    let newActiveIndex = 0
    pageRefs.current.forEach((ref, index) => {
      if (!ref) return

      const rect = ref.getBoundingClientRect()
      const offsetTop = rect.top + scrollTop
      const offsetBottom = offsetTop + rect.height

      if (viewportCenter >= offsetTop && viewportCenter < offsetBottom) {
        newActiveIndex = index
      }
    })

    if (newActiveIndex !== activePageIndex) {
      setActivePageIndex(newActiveIndex)
      if (!isInitialLoad) {
      }
    }
  }, [activePageIndex, setActivePageIndex, lastScrollTop, isReversing, hasInteracted, isInitialLoad])

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Keyboard navigation for up/down arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActivePageIndex((prev) => Math.min(prev + 1, zine.pages.length + 1))
      }
      if (e.key === "ArrowUp") {
        setActivePageIndex((prev) => Math.max(prev - 1, 0))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setActivePageIndex, zine.pages.length])

  return (
    <div ref={containerRef} className="relative">
      {/* Intro Page */}
      <ZineIntro
        zine={zine}
        scrollProgress={scrollProgress}
        ref={(el) => (pageRefs.current[0] = el)}
        isActive={activePageIndex === 0}
      />

      {/* Content Pages */}
      {zine.pages.map((page: any, index: number) => (
        <SensoryPage
          key={index}
          page={page}
          index={index}
          scrollProgress={scrollProgress}
          totalPages={zine.pages.length}
          isActive={activePageIndex === index + 1}
          isReversing={isReversing}
          ref={(el) => (pageRefs.current[index + 1] = el)}
          scrollVelocity={scrollVelocity}
          theme={theme}
        />
      ))}

      {/* Outro Page */}
      <ZineOutro
        zine={zine}
        scrollProgress={scrollProgress}
        ref={(el) => (pageRefs.current[zine.pages.length + 1] = el)}
        isActive={activePageIndex === zine.pages.length + 1}
      />
    </div>
  )
}
