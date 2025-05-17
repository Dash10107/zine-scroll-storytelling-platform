"use client"

import { useRef } from "react"
import { motion, useInView, type MotionValue, useTransform } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Share2, MessageCircle, ArrowLeft } from "lucide-react"
import { RevealText } from "./reveal-text"

interface OutroPageProps {
  zine: any
  isActive: boolean
  scrollYProgress: MotionValue<number>
}

export function OutroPage({ zine, isActive, scrollYProgress }: OutroPageProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  // Calculate opacity based on scroll progress
  const opacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1])

  const y = useTransform(scrollYProgress, [0.8, 0.9, 1], ["50px", "0px", "0px"])

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start"
      style={{
        scrollSnapAlign: "start",
        opacity,
        y,
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/90" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <RevealText delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-display mb-4 text-gradient">Thanks for Reading</h2>
          </RevealText>
          <RevealText delay={0.4}>
            <p className="text-xl text-muted-foreground">
              We hope you enjoyed "{zine.title}" by {zine.author}
            </p>
          </RevealText>
        </motion.div>

        {/* Credits section */}
        {zine.credits && (
          <motion.div
            className="mb-16 p-8 rounded-xl bg-white/5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-display mb-6 text-center">Credits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(zine.credits).map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">{key}</p>
                  <p className="font-medium">{String(value)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback and share section */}
        <motion.div
          className="flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/20 hover:bg-white/10"
            >
              <Heart size={18} className="text-red-500" />
              Like
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/20 hover:bg-white/10"
            >
              <Share2 size={18} />
              Share
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/20 hover:bg-white/10"
            >
              <MessageCircle size={18} />
              Feedback
            </Button>
          </div>

          <div className="mt-8">
            <Link href="/zine/library">
              <Button size="lg" className="gap-2">
                <ArrowLeft size={18} />
                Back to Library
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
