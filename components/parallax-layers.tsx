"use client"

import { motion, useTransform, useSpring, useVelocity, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { MotionValue } from "framer-motion"
import { useMemo, useState, useEffect } from "react"

interface ParallaxLayer {
  image: string
  depth: number // 0-1, where 0 is no parallax and 1 is maximum parallax
  position?: "foreground" | "midground" | "background"
  opacityOverride?: number
  blendMode?: string
  transitionStyle?: "smooth" | "sharp" | "elastic"
}

interface ParallaxLayersProps {
  layers?: ParallaxLayer[]
  pageProgress: MotionValue<number>
  fallbackImage?: string
  enableGrain?: boolean
  enableGlow?: boolean
}

export function ParallaxLayers({
  layers = [],
  pageProgress,
  fallbackImage = "/placeholder.svg?height=1080&width=1920",
  enableGrain = true,
  enableGlow = true,
}: ParallaxLayersProps) {
  const [isClient, setIsClient] = useState(false)
  const [hasWarned, setHasWarned] = useState(false)

  // Track scroll velocity for dynamic effects
  const scrollVelocity = useVelocity(pageProgress)
  const smoothScrollVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })

  // --- FIX: Move hooks to top level ---
  // These arrays will always have the same length as normalizedLayers
  const normalizedLayers = useMemo(() => {
    if (!layers || layers.length === 0) {
      return [
        {
          image: fallbackImage,
          depth: 0.5,
          position: "background" as const,
        },
      ]
    }
    return layers.map((layer) => ({
      image: layer.image || fallbackImage,
      depth: Math.max(0, Math.min(1, layer.depth || 0.5)),
      position: layer.position || "background",
      opacityOverride: layer.opacityOverride,
      blendMode: layer.blendMode,
      transitionStyle: layer.transitionStyle || "smooth",
    }))
  }, [layers, fallbackImage])

  const yTransforms = normalizedLayers.map((layer) =>
    useTransform(pageProgress, [0, 1], ["0%", `${layer.depth * 40}%`]),
  )
  const xTransforms = normalizedLayers.map((layer) => {
    const xDirection = layer.position === "foreground" ? 1 : layer.position === "midground" ? -1 : 0.5
    const xAmount = layer.depth * 15 * xDirection
    return useTransform(pageProgress, [0, 0.5, 1], ["0%", `${xAmount / 2}%`, `${xAmount}%`])
  })
  const scaleTransforms = normalizedLayers.map((layer) =>
    useTransform(pageProgress, [0, 0.5, 1], [1, 1 + layer.depth * 0.15, 1 + layer.depth * 0.08]),
  )
  const rotateTransforms = normalizedLayers.map((layer) => {
    const baseRotation = layer.depth * 8 * (layer.position === "foreground" ? 1 : -1)
    return useTransform(
      smoothScrollVelocity,
      [-1, 0, 1],
      [`${baseRotation * 0.8}deg`, "0deg", `${-baseRotation * 0.8}deg`],
    )
  })
  const zIndexValues = normalizedLayers.map((layer) =>
    layer.position === "foreground" ? 20 : layer.position === "midground" ? 10 : 5,
  )
  const opacityValues = normalizedLayers.map((layer) => {
    const baseOpacity =
      layer.opacityOverride ?? (layer.position === "foreground" ? 0.95 : layer.position === "midground" ? 0.8 : 0.6)
    return useTransform(smoothScrollVelocity, [-0.5, 0, 0.5], [baseOpacity * 0.9, baseOpacity, baseOpacity * 0.9])
  })
  const blurValues = normalizedLayers.map((layer) => {
    const baseBlur = layer.position === "foreground" ? 0 : layer.position === "midground" ? 2 : 4
    return useTransform(smoothScrollVelocity, [-0.5, 0, 0.5], [baseBlur + 2, baseBlur, baseBlur + 2])
  })
  const brightnessValues = normalizedLayers.map((layer) =>
    layer.position === "foreground" ? 1.1 : layer.position === "midground" ? 1 : 0.9,
  )
  const saturationValues = normalizedLayers.map((layer) =>
    layer.position === "foreground" ? 1.2 : layer.position === "midground" ? 1 : 0.85,
  )

  // Client-side only to avoid hydration issues
  useEffect(() => {
    setIsClient(true)

    // Developer warning for empty layers (only in development)
    if (process.env.NODE_ENV === "development" && layers.length === 0 && !hasWarned) {
      console.warn(
        "ParallaxLayers: No layers provided. Using fallback image. Provide at least one layer for parallax effect.",
      )
      setHasWarned(true)
    }
  }, [layers, hasWarned])

  // --- Springify transforms for each layer ---
  const springConfigs = normalizedLayers.map((layer) => {
    switch (layer.transitionStyle) {
      case "sharp":
        return { damping: 50, stiffness: 500 }
      case "elastic":
        return { damping: 15, stiffness: 200, mass: 1.2 }
      case "smooth":
      default:
        return { damping: 30, stiffness: 300 }
    }
  })

  const springY = yTransforms.map((y, i) => useSpring(y, springConfigs[i]))
  const springX = xTransforms.map((x, i) => useSpring(x, springConfigs[i]))
  const springScale = scaleTransforms.map((s, i) => useSpring(s, springConfigs[i]))
  const springRotate = rotateTransforms.map((r, i) => useSpring(r, springConfigs[i]))

  // Don't render anything during SSR to avoid hydration issues with motion values
  if (!isClient) {
    return null
  }

  return (
    <>
      {normalizedLayers.map((layer, index) => {
        // Use the arrays above for transforms
        const y = springY[index]
        const x = springX[index]
        const scale = springScale[index]
        const rotate = springRotate[index]
        const zIndex = zIndexValues[index]
        const opacity = opacityValues[index]
        const blur = blurValues[index]
        const brightness = brightnessValues[index]
        const saturation = saturationValues[index]
        const position = layer.position
        const blendMode = layer.blendMode || (layer.position === "foreground" ? "normal" : "normal")

        return (
          <motion.div
            key={`${layer.image}-${index}`}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              y,
              x,
              scale,
              rotate,
              zIndex,
              mixBlendMode: blendMode as any,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full h-full">
              {/* Main image layer */}
              <Image
                src={layer.image || "/placeholder.svg"}
                alt={`Parallax layer ${index + 1}`}
                fill
                className="object-cover"
                style={{
                  opacity,
                  filter: `blur(${blur}px) brightness(${brightness}) saturate(${saturation})`,
                }}
                sizes="100vw"
                priority={index === 0}
                onError={(e) => {
                  // Fallback to placeholder on error
                  const target = e.target as HTMLImageElement
                  if (target.src !== fallbackImage) {
                    target.src = fallbackImage
                    console.warn(`ParallaxLayers: Failed to load image at index ${index}, using fallback.`)
                  }
                }}
              />

              {/* Position-specific overlays for depth and mood */}
              {position === "background" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"
                  animate={{
                    opacity: [0.5, 0.4, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}

              {position === "midground" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"
                  animate={{
                    opacity: [0.3, 0.2, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}

              {position === "foreground" && enableGlow && (
                <motion.div
                  className="absolute inset-0 mix-blend-overlay"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%)",
                  }}
                  animate={{
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}

              {/* Optional grain overlay for texture */}
              {enableGrain && position === "foreground" && (
                <motion.div
                  className="absolute inset-0 mix-blend-overlay opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}
            </div>
          </motion.div>
        )
      })}

      {/* Floating particles for depth enhancement */}
      {enableGlow && (
        <AnimatePresence>
          <motion.div
            className="absolute inset-0 pointer-events-none z-15 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-white/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  filter: "blur(1px)",
                }}
                animate={{
                  y: [0, Math.random() * -150],
                  x: [0, Math.random() * 80 - 40],
                  opacity: [0, 0.8, 0],
                  scale: [0, Math.random() * 4 + 1],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}
