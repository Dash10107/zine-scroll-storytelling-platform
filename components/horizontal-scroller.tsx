"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"

interface HorizontalScrollerProps {
  content: string
  images: string[]
}

export function HorizontalScroller({ content, images }: HorizontalScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Calculate the width of the horizontal content
  useEffect(() => {
    if (!containerRef.current) return

    const updateWidth = () => {
      const scrollWidth = containerRef.current?.scrollWidth || 0
      const viewportWidth = window.innerWidth
      setContainerWidth(Math.max(0, scrollWidth - viewportWidth))
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)

    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Set up horizontal scroll based on vertical scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Transform vertical scroll to horizontal movement with spring physics
  const springScrollYProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 })
  const x = useTransform(springScrollYProgress, [0, 1], [0, -containerWidth])

  // Split content into paragraphs
  const paragraphs = content.split("\n").filter((p) => p.trim() !== "")

  // Ensure we have at least some images to display
  const displayImages = images.length > 0 ? images : Array(3).fill("/placeholder.svg?height=800&width=1200")

  return (
    <div
      className="relative h-[50vh] md:h-[70vh] overflow-hidden my-12"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="absolute top-0 left-0 h-full flex items-center"
        style={{ x }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex gap-8 px-8 md:px-16">
          {/* Text content */}
          <motion.div
            className="w-[80vw] md:w-[50vw] flex-shrink-0 bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-6 text-gradient font-playfair"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Horizontal Perspective
            </motion.h3>
            <div className="space-y-4">
              {paragraphs.map((paragraph, idx) => (
                <motion.p
                  key={idx}
                  className="text-lg leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Images */}
          {displayImages.map((image, idx) => (
            <motion.div
              key={idx}
              className="w-[80vw] md:w-[60vw] h-full flex-shrink-0 relative rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                quality={90}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
                animate={{
                  opacity: isHovering ? 0.4 : 0.7,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Image number indicator */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {idx + 1} / {displayImages.length}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/70 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          Scroll to explore horizontally
        </motion.span>
      </motion.div>
    </div>
  )
}
