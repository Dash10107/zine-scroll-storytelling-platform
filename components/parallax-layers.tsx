"use client"

import { motion, useTransform, type MotionValue } from "framer-motion"
import Image from "next/image"
import React from "react"

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
  return (
    <>
      {layers.map((layer, index) => {
        const y = useTransform(pageProgress, [0, 1], ["0%", `${layer.depth * 20}%`])
        const zIndex =
          layer.position === "foreground" ? 20 :
          layer.position === "midground" ? 10 :
          5
        const opacity =
          layer.position === "foreground" ? 0.9 :
          layer.position === "midground" ? 0.7 :
          0.5

        return (
          <motion.div
            key={index}
            className="absolute inset-0 pointer-events-none"
            style={{ y, zIndex }}
          >
            <div className="relative w-full h-full">
              <Image
                src={layer.image || "/placeholder.svg"}
                alt={`Parallax layer ${index + 1}`}
                fill
                className="object-cover"
                style={{ opacity }}
              />
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
