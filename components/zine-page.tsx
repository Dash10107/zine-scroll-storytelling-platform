"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, type MotionValue, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ContentBlock } from "./content-block"
import { MediaCarousel } from "./media-carousel"
import { InteractiveElement } from "./interactive-element"
import { ScrollIndicator } from "./scroll-indicator"
import { EmotionSlider } from "./emotion-slider"
import { RevealText } from "./reveal-text"
import { HoverReveal } from "./hover-reveal"
import { ParallaxLayers } from "./parallax-layers"

interface ZinePageProps {
  page: any
  index: number
  isActive: boolean
  scrollYProgress: MotionValue<number>
  totalPages: number
}

export function ZinePage({ page, index, isActive, scrollYProgress, totalPages }: ZinePageProps) {
  const ref = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })
  const [hasInteracted, setHasInteracted] = useState(false)

  // Calculate progress for this specific page
  const pageProgress = useTransform(
    scrollYProgress,
    // Map the overall scroll progress to this page's progress
    [index / (totalPages + 1), (index + 1) / (totalPages + 1)],
    [0, 1],
  )

  // Calculate parallax effects based on page progress
  const backgroundY = useTransform(pageProgress, [0, 1], ["0%", "10%"])
  const contentOpacity = useTransform(pageProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const contentY = useTransform(pageProgress, [0, 0.2, 0.8, 1], ["50px", "0px", "0px", "-50px"])

  // Parallax effects for different elements
  const titleY = useTransform(pageProgress, [0, 1], ["0%", "30%"])
  const imageScale = useTransform(pageProgress, [0, 0.5, 1], [1, 1.05, 1.1])
  const quoteOpacity = useTransform(pageProgress, [0.3, 0.4, 0.8, 0.9], [0, 1, 1, 0])
  const quoteY = useTransform(pageProgress, [0.3, 0.4, 0.8, 0.9], ["30px", "0px", "0px", "-30px"])

  // Reset interaction state when page changes
  useEffect(() => {
    if (!isActive) {
      setHasInteracted(false)
    }
  }, [isActive])

  // Determine layout class based on page.layout
  const getLayoutClass = () => {
    switch (page.layout) {
      case "cinematic-centered":
        return "flex flex-col items-center justify-center text-center px-8 md:px-16 lg:px-24"
      case "split-layout":
        return "grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-8 md:px-12"
      case "full-bleed":
        return "flex flex-col items-center justify-center text-center"
      case "grid-layout":
        return "grid grid-cols-1 md:grid-cols-3 gap-6 px-8 md:px-12"
      case "magazine-style":
        return "flex flex-col md:flex-row items-center gap-8 px-8 md:px-16"
      case "immersive-quote":
        return "flex flex-col items-center justify-center text-center px-8 md:px-24"
      case "photo-essay":
        return "grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-8 md:px-12"
      default:
        return "flex flex-col items-center justify-center text-center px-8 md:px-16"
    }
  }

  return (
    <motion.section
      ref={ref}
      className="zine-page relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start"
      id={`page-${index}`}
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background Layer */}
      {page.background && (
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            y: backgroundY,
            scale: 1.1, // Slightly larger to prevent edges showing during parallax
          }}
        >
          <Image
            src={page.background || "/placeholder.svg"}
            alt={page.title || `Page ${index + 1} background`}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />

          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]" />
        </motion.div>
      )}

      {/* Parallax Layers */}
      {page.parallaxLayers && <ParallaxLayers layers={page.parallaxLayers} pageProgress={pageProgress} />}

      {/* Content container with layout variations */}
      <motion.div
        ref={contentRef}
        className={`relative z-10 w-full max-w-7xl mx-auto py-24 ${getLayoutClass()}`}
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        {/* Page title with animated entrance */}
        {page.title && (
          <motion.div style={{ y: titleY }}>
            <RevealText delay={0.2}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display mb-8 text-gradient">{page.title}</h2>
            </RevealText>
          </motion.div>
        )}

        {/* Main content block */}
        <ContentBlock content={page.content} isInView={isInView} layout={page.layout} />

        {/* Quote if available */}
        {page.quote && (
          <motion.blockquote
            className="text-2xl md:text-3xl italic font-serif my-12 max-w-2xl mx-auto text-primary/90 border-l-4 border-primary/50 pl-6"
            style={{
              opacity: quoteOpacity,
              y: quoteY,
            }}
          >
            "{page.quote}"
          </motion.blockquote>
        )}

        {/* Image with zoom effect */}
        {page.image && (
          <HoverReveal>
            <motion.div
              className="relative overflow-hidden rounded-lg shadow-2xl my-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ scale: imageScale }}
            >
              <Image
                src={page.image || "/placeholder.svg"}
                alt={page.imageCaption || page.title || `Page ${index + 1}`}
                width={1200}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
              />

              {page.imageCaption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-3 text-sm">
                  {page.imageCaption}
                </div>
              )}
            </motion.div>
          </HoverReveal>
        )}

        {/* Media carousel if available */}
        {page.gallery && page.gallery.length > 0 && <MediaCarousel images={page.gallery} isInView={isInView} />}

        {/* Interactive elements if specified */}
        {page.interactive && (
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="mt-8 w-full max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {page.interactiveType === "emotion" ? (
                  <EmotionSlider />
                ) : (
                  <InteractiveElement type={page.interactiveType || "default"} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Next page indicator (only show if not the last page) */}
      {index < totalPages - 1 && isActive && (
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <ScrollIndicator />
        </motion.div>
      )}

      {/* Page number indicator */}
      <div className="absolute bottom-8 left-8 text-sm font-mono text-white/50">
        {index + 1} / {totalPages}
      </div>
    </motion.section>
  )
}
