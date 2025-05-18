"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { motion } from "framer-motion"

interface AmbientBackgroundProps {
  theme: string
  scrollVelocity: number
  isActive: boolean
}

export function AmbientBackground({ theme, scrollVelocity, isActive }: AmbientBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [blurAmount, setBlurAmount] = useState(0)
  const [opacity, setOpacity] = useState(0.7)

  // Update effects based on scroll velocity
  useEffect(() => {
    // Calculate blur based on scroll velocity
    const newBlur = Math.min(5, scrollVelocity * 0.5)
    setBlurAmount(newBlur)

    // Calculate opacity based on scroll velocity
    const newOpacity = Math.max(0.3, 0.7 - scrollVelocity * 0.04)
    setOpacity(newOpacity)
  }, [scrollVelocity])

  // Track mouse movement for ambient effects
  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const normalizedX = (e.clientX - rect.left) / rect.width
      const normalizedY = (e.clientY - rect.top) / rect.height

      setMousePosition({ x: normalizedX, y: normalizedY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isActive])

  // Get theme-specific gradient
  const themeGradient = useMemo(() => {
    switch (theme) {
      case "dream":
        return [
          "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.2), transparent 70%)",
          "radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.2), transparent 70%)",
          "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.2), transparent 70%)",
        ].join(",")
      case "urban":
        return [
          "radial-gradient(circle at 50% 50%, rgba(75, 85, 99, 0.2), transparent 70%)",
          "radial-gradient(circle at 70% 30%, rgba(31, 41, 55, 0.2), transparent 70%)",
          "radial-gradient(circle at 30% 70%, rgba(107, 114, 128, 0.2), transparent 70%)",
        ].join(",")
      case "nature":
        return [
          "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2), transparent 70%)",
          "radial-gradient(circle at 70% 30%, rgba(5, 150, 105, 0.2), transparent 70%)",
          "radial-gradient(circle at 30% 70%, rgba(52, 211, 153, 0.2), transparent 70%)",
        ].join(",")
      default:
        return [
          "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.2), transparent 70%)",
          "radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.2), transparent 70%)",
          "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.2), transparent 70%)",
        ].join(",")
    }
  }, [theme])

  // Get theme-specific particle color
  const themeParticleColor = useMemo(() => {
    switch (theme) {
      case "dream":
        return "rgba(236, 72, 153, 0.4)"
      case "urban":
        return "rgba(156, 163, 175, 0.4)"
      case "nature":
        return "rgba(16, 185, 129, 0.4)"
      default:
        return "rgba(255, 255, 255, 0.4)"
    }
  }, [theme])
  const b = true;
  // Particle data should be memoized to avoid re-randomizing on every render
  const particleCount = (b) ? 30 : 15
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }).map(() => ({
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        y: Math.random() * -200,
        x: Math.random() * 100 - 50,
        opacity: 0.7,
        scale: Math.random() * 2 + 1,
        duration: Math.random() * 20 + 10,
      })),
    [particleCount],
  )

  // Calculate vignette opacity based on scroll velocity
  const vignetteOpacity = Math.min(0.9, 0.5 + scrollVelocity * 0.04)

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient gradient background */}
      <motion.div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          opacity: opacity,
          background: themeGradient,
          filter: `blur(${blurAmount}px)`,
          backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
        }}
      />

      {/* Floating particles */}
      {isActive &&
        particles.map((p, i) => (
          <motion.div
            key={`ambient-particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: p.width,
              height: p.height,
              backgroundColor: themeParticleColor,
              left: p.left,
              top: p.top,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, p.y],
              x: [0, p.x],
              opacity: [0, p.opacity, 0],
              scale: [0, p.scale, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}

      {/* Mouse-following gradient */}
      {isActive && (
        <motion.div
          className="absolute w-full h-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
              mousePosition.y * 100
            }%, rgba(255, 255, 255, 0.1), transparent 50%)`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Vignette effect that reacts to scroll velocity */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.8) 100%)",
          opacity: vignetteOpacity,
        }}
      />
    </div>
  )
}
