"use client"

import { forwardRef, useRef, useEffect, useState } from "react"
import {
  motion,
  useTransform,
  type MotionValue,
  useInView,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion"

import Image from "next/image"
import { ParallaxLayers } from "@/components/parallax-layers"

import { HorizontalScroller } from "@/components/horizontal-scroller"
import { GlitchText } from "@/components/glitch-text"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MediaCarousel } from "@/components/media-carousel"
import { ContentBlock } from "@/components/content-block"
import { AnimatedText } from "@/components/animated-text"
import { ImageHoverEffect } from "@/components/image-hover-effect"

// Import the new components
import { AmbientBackground } from "@/components/ambient-background"
import { EnhancedScrollIndicator } from "@/components/enhanced-scroll-indicator"
import { MotionBlurEffect } from "@/components/motion-blur-effect"

// Add these props to the component
interface SensoryPageProps {
  page: any
  index: number
  scrollProgress: MotionValue<number>
  totalPages: number
  isActive: boolean
  isReversing: boolean
  scrollVelocity?: number
  theme?: string
}

export const SensoryPage = forwardRef<HTMLElement, SensoryPageProps>(
  ({ page, index, scrollProgress, totalPages, isActive, isReversing, scrollVelocity = 0, theme = "default" }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const isInView = useInView(contentRef, { once: false, amount: 0.3 })
    const isFullyInView = useInView(sectionRef, { once: false, amount: 0.8 })
    const [hasInteracted, setHasInteracted] = useState(false)
    const [showEasterEgg, setShowEasterEgg] = useState(false)
    const isMobile = useMediaQuery("(max-width: 768px)")
    const [hasPlayedEntrance, setHasPlayedEntrance] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Calculate progress for this specific page
    const pageProgress = useTransform(
      scrollProgress,
      // Map the overall scroll progress to this page's progress
      [index / (totalPages + 2), (index + 1) / (totalPages + 2)],
      [0, 1],
    )

    // Add spring physics to page progress for smoother animations
    const smoothPageProgress = useSpring(pageProgress, { damping: 30, stiffness: 100 })

    // Track scroll velocity for dynamic effects
    const scrollVelocityValue = useMotionValue(scrollVelocity)
    useEffect(() => {
      scrollVelocityValue.set(scrollVelocity)
    }, [scrollVelocity, scrollVelocityValue])

    const smoothScrollVelocity = useSpring(scrollVelocityValue, { damping: 50, stiffness: 400 })

    // Enhance the parallax effects for more dramatic movement
    const backgroundY = useTransform(smoothPageProgress, [0, 1], ["0%", "30%"])
    const backgroundScale = useTransform(smoothPageProgress, [0, 0.5, 1], [1, 1.08, 1.15])
    const contentOpacity = useTransform(smoothPageProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const contentY = useTransform(smoothPageProgress, [0, 0.2, 0.8, 1], ["80px", "0px", "0px", "-80px"])

    // Add more dramatic parallax for title elements
    const titleY = useTransform(smoothPageProgress, [0, 1], ["0%", "40%"])
    const titleOpacity = useTransform(smoothPageProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])

    // Enhance image effects
    const imageScale = useTransform(smoothPageProgress, [0, 0.5, 1], [1, 1.08, 1.15])
    const imageOpacity = useTransform(smoothPageProgress, [0, 0.2, 0.8, 1], [0.7, 1, 1, 0.7])
    const imageRotate = useTransform(smoothScrollVelocity, [-0.5, 0, 0.5], ["-2deg", "0deg", "2deg"])

    // Track mouse position for hover effects
    useEffect(() => {
      if (!isActive) return

      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        })
      }

      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [isActive])

    useEffect(() => {
      if (isFullyInView && isActive && !hasPlayedEntrance) {
        setHasPlayedEntrance(true)

        // Reset after leaving view
        return () => {
          setHasPlayedEntrance(false)
        }
      }
    }, [isFullyInView, isActive, hasPlayedEntrance])

    // Handle interaction when elements are clicked
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
      }
    }

    // Easter egg effect when scrolling backward
    useEffect(() => {
      if (isActive && isReversing && !showEasterEgg) {
        setShowEasterEgg(true)
        const timer = setTimeout(() => setShowEasterEgg(false), 5000)
        return () => clearTimeout(timer)
      }
    }, [isActive, isReversing, showEasterEgg])

    // Determine if this page has horizontal scroll
    const hasHorizontalScroll = page.layout === "horizontal-scroll" || page.gallery?.length > 2

    // Determine if this page has interactive elements
    const hasInteractiveElement = page.interactive || page.interactiveType

    // Determine layout class based on page layout
    const getLayoutClass = () => {
      switch (page.layout) {
        case "cinematic-centered":
          return "items-center text-center"
        case "split-layout":
          return "items-center md:flex-row md:items-start md:gap-12"
        case "full-bleed":
          return "items-start"
        case "grid-layout":
          return "items-center grid-layout"
        case "magazine-style":
          return "items-start magazine-style"
        case "immersive-quote":
          return "items-center text-center"
        case "photo-essay":
          return "items-center photo-essay"
        default:
          return "items-center"
      }
    }

    // Get background overlay style based on layout
    const getBackgroundOverlay = () => {
      switch (page.layout) {
        case "cinematic-centered":
          return "bg-gradient-to-b from-black/70 via-black/40 to-black/70"
        case "split-layout":
          return "bg-gradient-to-r from-black/80 via-black/50 to-black/30"
        case "full-bleed":
          return "bg-gradient-to-t from-black/70 via-black/30 to-black/50"
        case "immersive-quote":
          return "bg-black/60 backdrop-blur-[2px]"
        default:
          return "bg-gradient-to-b from-black/60 via-black/40 to-black/60"
      }
    }

    // Animation variants for staggered content
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    }

    return (
      <motion.section
        ref={(el) => {
          // Assign to both refs
          if (el) {
            if (typeof ref === "function") ref(el)
            sectionRef.current = el
          }
        }}
        className="sensory-page relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start"
        id={`page-${index + 1}`}
        style={{ scrollSnapAlign: "start" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Layer with Parallax and Dynamic Blur */}
        {page.background && !page.parallaxLayers && (
          <motion.div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              y: backgroundY,
              scale: backgroundScale,
            }}
          >
            <Image
              src={page.background || "/placeholder.svg"}
              alt={page.title || `Page ${index + 1} background`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={90}
            />

            {/* Overlay gradient for better text readability */}
            <motion.div
              className={`absolute inset-0 ${getBackgroundOverlay()} backdrop-blur-[2px]`}
              animate={{
                opacity: isFullyInView ? [0.7, 0.5, 0.7] : 0.7,
                background: isFullyInView
                  ? [
                      "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
                      "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
                      "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
                    ]
                  : "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
              }}
              transition={{
                opacity: { duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                background: { duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              }}
            />
          </motion.div>
        )}

        {/* Theme-specific ambient background */}
        <AmbientBackground theme={theme} scrollVelocity={scrollVelocity} isActive={isActive} />

        {/* Motion blur effect based on scroll velocity */}
        <MotionBlurEffect scrollVelocity={scrollVelocity} isActive={isActive} />

        {/* Enhanced Parallax Layers */}
        {page.parallaxLayers && (
          <ParallaxLayers
            layers={page.parallaxLayers}
            pageProgress={smoothPageProgress}
            enableGrain={true}
            enableGlow={true}
            fallbackImage={page.background || "/placeholder.svg"}
          />
        )}

        {/* Animated color gradient background */}
        <motion.div
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.3), transparent 70%)",
              "radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.3), transparent 70%)",
              "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3), transparent 70%)",
              "radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3), transparent 70%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />


        {/* Content container with layout variations */}
        <motion.div
          ref={contentRef}
          className={`relative z-10 w-full max-w-7xl mx-auto py-24 px-4 md:px-8 lg:px-16 flex flex-col ${getLayoutClass()}`}
          style={{
            opacity: contentOpacity,
            y: contentY,
          }}
          onClick={handleInteraction}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Page title with animated typography */}
          {page.title && (
            <motion.div
              style={{ y: titleY, opacity: titleOpacity }}
              className={`mb-12 ${page.layout === "cinematic-centered" ? "w-full" : "max-w-3xl"}`}
              variants={itemVariants}
            >
              <AnimatedText
                text={page.title}
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                type="word"
                staggerChildren={0.05}
                isInView={isInView}
              />
            </motion.div>
          )}

          {/* Glitch Quote - appears based on page type */}
          {page.quote && (
            <motion.div variants={itemVariants}>
              <GlitchText
                text={page.quote}
                isActive={isFullyInView && (page.layout === "immersive-quote" || Math.random() > 0.5)}
              />
            </motion.div>
          )}

          {/* Main content - either horizontal scroll or regular content */}
          <motion.div variants={itemVariants}>
            {hasHorizontalScroll ? (
              <HorizontalScroller content={page.content} images={page.gallery || []} />
            ) : (
              <ContentBlock content={page.content} isInView={isInView} layout={page.layout} />
            )}
          </motion.div>

          {/* Featured image with parallax zoom and rotation effects */}
          {page.image && (
            <motion.div
              className={`relative overflow-hidden rounded-lg my-12 ${
                page.layout === "full-bleed" ? "w-full" : "max-w-4xl mx-auto"
              }`}
              style={{
                scale: imageScale,
                opacity: imageOpacity,
                rotate: imageRotate,
              }}
              variants={itemVariants}
            >
              <ImageHoverEffect
                src={page.image || "/placeholder.svg"}
                alt={page.imageCaption || page.title || `Page ${index + 1}`}
                width={1200}
                height={800}
                caption={page.imageCaption}
                tag={page.imageTag}
              />
            </motion.div>
          )}

          {/* Image Gallery/Carousel if available */}
          {page.gallery && page.gallery.length > 0 && !hasHorizontalScroll && (
            <motion.div variants={itemVariants}>
              <MediaCarousel images={page.gallery} isInView={isInView} />
            </motion.div>
          )}





          {/* Easter Egg Animation */}
          <AnimatePresence>
            {showEasterEgg && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="bg-black/80 backdrop-blur-md p-8 rounded-lg max-w-md text-center"
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{
                    scale: [0.8, 1.1, 1],
                    rotate: [-5, 5, 0],
                  }}
                  transition={{ duration: 1 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-primary">Easter Egg Unlocked!</h3>
                  <p className="mb-4">You've discovered a hidden feature by scrolling backward.</p>
                  <Button variant="outline" className="pointer-events-auto" onClick={() => setShowEasterEgg(false)}>
                    Continue Exploring
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Next page indicator (only show if not the last page) */}
        {index < totalPages - 1 && isActive && !isMobile && (
          <EnhancedScrollIndicator scrollProgress={pageProgress} isActive={isActive} />
        )}

        {/* Page number indicator */}
        <motion.div
          className="absolute bottom-8 left-8 text-sm font-mono text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {index + 1} / {totalPages}
        </motion.div>
      </motion.section>
    )
  },
)
