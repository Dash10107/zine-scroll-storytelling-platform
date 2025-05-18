"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface ImageHoverEffectProps {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  tag?: string
}

export function ImageHoverEffect({ src, alt, width, height, caption, tag }: ImageHoverEffectProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          quality={90}
        />
      </motion.div>

      {/* Overlay gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Tag */}
      {tag && (
        <motion.div
          className="absolute top-4 right-4 bg-primary/80 text-white text-xs px-2 py-1 rounded"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {tag}
        </motion.div>
      )}

      {/* Caption */}
      {caption && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-sm font-medium">{caption}</p>
        </motion.div>
      )}

      {/* Blur overlay */}
      <motion.div
        className="absolute inset-0 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
