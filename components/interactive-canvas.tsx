"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface Sticker {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  image: string
}

interface InteractiveCanvasProps {
  isActive: boolean
}

export function InteractiveCanvas({ isActive }: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [activeSticker, setActiveSticker] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Sticker images
  const stickerImages = [
    "/placeholder.svg?height=100&width=100&text=⭐",
    "/placeholder.svg?height=100&width=100&text=🌈",
    "/placeholder.svg?height=100&width=100&text=🔮",
    "/placeholder.svg?height=100&width=100&text=🌙",
    "/placeholder.svg?height=100&width=100&text=✨",
  ]

  // Add a new sticker
  const addSticker = (image: string) => {
    const newSticker: Sticker = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 80 + 10, // 10-90% of container height
      rotation: Math.random() * 30 - 15, // -15 to 15 degrees
      scale: 0.8 + Math.random() * 0.4, // 0.8-1.2
      image,
    }

    setStickers((prev) => [...prev, newSticker])
  }

  // Handle sticker drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    e.stopPropagation()
    setActiveSticker(id)
    setIsDragging(true)

    // Calculate offset
    const sticker = stickers.find((s) => s.id === id)
    if (!sticker) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    setOffset({
      x: x - (sticker.x / 100) * rect.width,
      y: y - (sticker.y / 100) * rect.height,
    })

  }

  // Handle sticker drag
  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || activeSticker === null || !canvasRef.current) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left - offset.x
    const y = clientY - rect.top - offset.y

    // Update sticker position
    setStickers(
      stickers.map((sticker) => {
        if (sticker.id === activeSticker) {
          return {
            ...sticker,
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
          }
        }
        return sticker
      }),
    )
  }

  // Handle sticker drag end
  const handleDragEnd = () => {
    setIsDragging(false)
    setActiveSticker(null)
  }

  // Set up event listeners
  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (e: MouseEvent) => handleDrag(e)
    const handleTouchMove = (e: TouchEvent) => handleDrag(e)
    const handleMouseUp = () => handleDragEnd()
    const handleTouchEnd = () => handleDragEnd()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isActive, isDragging, activeSticker])

  return (
    <div className="my-12 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-center font-playfair">Interactive Canvas</h3>
      <p className="text-center text-muted-foreground mb-6 font-light">Drag stickers to decorate this page</p>

      {/* Sticker palette */}
      <div className="flex justify-center gap-4 mb-6">
        {stickerImages.map((image, idx) => (
          <motion.div
            key={idx}
            className="w-12 h-12 rounded-full overflow-hidden cursor-pointer shadow-lg shadow-black/20"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addSticker(image)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Sticker ${idx + 1}`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        className="relative w-full h-[300px] bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-xl"
      >
        {stickers.map((sticker) => (
          <motion.div
            key={sticker.id}
            className="absolute cursor-move"
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              rotate: `${sticker.rotation}deg`,
              scale: sticker.scale,
              transformOrigin: "center center",
              zIndex: activeSticker === sticker.id ? 10 : 1,
            }}
            animate={
              activeSticker === sticker.id
                ? {
                    scale: sticker.scale * 1.2,
                    rotate: `${sticker.rotation + 5}deg`,
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
                  }
                : {
                    scale: sticker.scale,
                    rotate: `${sticker.rotation}deg`,
                    filter: "none",
                  }
            }
            transition={{ type: "spring", damping: 10 }}
            onMouseDown={(e) => handleDragStart(e, sticker.id)}
            onTouchStart={(e) => handleDragStart(e, sticker.id)}
          >
            <Image
              src={sticker.image || "/placeholder.svg"}
              alt="Sticker"
              width={100}
              height={100}
              className="pointer-events-none select-none"
              draggable={false}
            />
          </motion.div>
        ))}

        {/* Empty state message */}
        {stickers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 font-light">
            Click a sticker above to add it to the canvas
          </div>
        )}
      </div>
    </div>
  )
}
