"use client"

import { motion } from "framer-motion"
import { RevealText } from "./reveal-text"

interface ContentBlockProps {
  content: string
  isInView: boolean
  layout?: string
  isActive?: boolean
}

export function ContentBlock({ content, isInView, layout = "default", isActive = false }: ContentBlockProps) {
  // Split content into paragraphs
  const paragraphs = content.split("\n").filter((p) => p.trim() !== "")

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

  return (
    <motion.div className={`text-lg md:text-xl leading-relaxed mb-8 space-y-4 ${getTextAlignment()} ${getMaxWidth()}`}>
      {paragraphs.map((paragraph, idx) => (
        <RevealText key={idx} delay={0.3 + idx * 0.1} isActive={isActive}>
          <p className="text-white drop-shadow-lg bg-black/70 backdrop-blur-sm p-4 rounded-lg">{paragraph}</p>
        </RevealText>
      ))}
    </motion.div>
  )
}
