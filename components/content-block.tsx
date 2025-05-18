"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AnimatedText } from "./animated-text"

interface ContentBlockProps {
  content: string
  isInView: boolean
  layout?: string
}

export function ContentBlock({ content, isInView, layout = "default" }: ContentBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isContentInView = useInView(containerRef, { once: false, amount: 0.2 })
  const shouldAnimate = isContentInView && isInView

  // Split content into paragraphs
  const paragraphs = content.split("\n\n").filter(Boolean)

  // Animation variants for staggered content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const paragraphVariants = {
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

  // Determine text alignment based on layout
  const getTextAlignment = () => {
    if (layout === "cinematic-centered" || layout === "immersive-quote") {
      return "text-center"
    } else if (layout === "split-layout" || layout === "magazine-style") {
      return "text-left"
    }
    return "text-left"
  }

  // Determine max width based on layout
  const getMaxWidth = () => {
    if (layout === "cinematic-centered" || layout === "immersive-quote") {
      return "max-w-3xl mx-auto"
    } else if (layout === "full-bleed") {
      return "max-w-4xl mx-auto"
    }
    return ""
  }

  // Determine if we should use a special layout
  const useSpecialLayout = layout === "magazine-style" || layout === "photo-essay"

  return (
    <motion.div
      ref={containerRef}
      className={`prose prose-invert max-w-none ${getTextAlignment()} ${getMaxWidth()} ${
        useSpecialLayout ? "magazine-style" : ""
      }`}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
    >
      {paragraphs.map((paragraph, index) => (
        <motion.div key={index} variants={paragraphVariants}>
          {index === 0 && layout === "magazine-style" ? (
            <p className="first-paragraph" dangerouslySetInnerHTML={{ __html: paragraph }} />
          ) : (
            <AnimatedText
              text={paragraph}
              isInView={shouldAnimate}
              delay={0.1 * index}
              type="line"
              staggerChildren={0.01}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
