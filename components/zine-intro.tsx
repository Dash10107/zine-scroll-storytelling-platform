"use client"

import { forwardRef, useRef } from "react"
import { motion, useTransform, type MotionValue, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { RevealText } from "@/components/reveal-text"

interface ZineIntroProps {
  zine: any
  scrollProgress: MotionValue<number>
  isActive: boolean
}

export const ZineIntro = forwardRef<HTMLElement, ZineIntroProps>(({ zine, scrollProgress, isActive }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true })

  // Parallax effects
  const coverScale = useTransform(scrollProgress, [0, 0.1], [1, 1.1])
  const coverOpacity = useTransform(scrollProgress, [0, 0.1], [1, 0])
  const titleY = useTransform(scrollProgress, [0, 0.1], [0, -50])
  const contentOpacity = useTransform(scrollProgress, [0, 0.05, 0.1], [1, 0.5, 0])

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start"
      id="intro"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background Cover Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          scale: coverScale,
          opacity: coverOpacity,
        }}
      >
        <Image
          src={zine.cover || "/placeholder.svg"}
          alt={zine.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={95}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </motion.div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 container mx-auto px-4 text-center"
        style={{
          opacity: contentOpacity,
          y: titleY,
        }}
      >
        <RevealText delay={0.2}>
          <h1 className="text-6xl md:text-8xl font-bold font-playfair mb-6 text-gradient tracking-tight">
            {zine.title}
          </h1>
        </RevealText>

        <RevealText delay={0.4}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto font-light">
            {zine.description}
          </p>
        </RevealText>

        <RevealText delay={0.6}>
          <p className="text-lg text-primary/80 mb-12 font-cormorant italic">By {zine.author || "Anonymous"}</p>
        </RevealText>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg group"
            onClick={() => {
              document.getElementById("page-1")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Begin Experience
            <ChevronDown className="ml-2 group-hover:animate-bounce" size={18} />
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {isActive && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span className="text-sm text-muted-foreground">Scroll to begin</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ChevronDown className="text-primary" size={24} />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  )
})

ZineIntro.displayName = "ZineIntro"
