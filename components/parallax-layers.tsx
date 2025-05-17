"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useTransform } from "framer-motion"
import type { MotionValue } from "framer-motion"
import { useMemo } from "react"

interface ParallaxLayer {
  image: string
  depth: number // 0-1, where 0 is no parallax and 1 is maximum parallax
  position?: "foreground" | "midground" | "background"
}

interface ParallaxLayersProps {
  layers: ParallaxLayer[]
  pageProgress: MotionValue<number>
}

export function ParallaxLayers({ layers, pageProgress }: ParallaxLayersProps) {
  // Create all transforms at the top level
  const yValues = layers.map((layer) => useTransform(pageProgress, [0, 1], ["0%", `${layer.depth * 20}%`]))
  const zIndexValues = layers.map((layer) =>
    layer.position === "foreground" ? 20 : layer.position === "midground" ? 10 : 5,
  )
  const opacityValues = layers.map((layer) =>
    layer.position === "foreground" ? 0.9 : layer.position === "midground" ? 0.7 : 0.5,
  )

  const parallaxValues = useMemo(() => {
    return layers.map((_, index) => ({
      y: yValues[index],
      zIndex: zIndexValues[index],
      opacity: opacityValues[index],
    }))
  }, [layers, pageProgress])

  return (
    <>
      {layers.map((layer, index) => {
        const { y, zIndex, opacity } = parallaxValues[index]

        return (
          <motion.div
            key={index}
            className="absolute inset-0 pointer-events-none"
            style={{
              y,
              zIndex,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={layer.image || "/placeholder.svg"}
                alt={`Parallax layer ${index + 1}`}
                fill
                className="object-cover"
                style={{ opacity }}
              />

              {/* Add overlay for better text readability */}
              {layer.position === "background" && <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />}
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
