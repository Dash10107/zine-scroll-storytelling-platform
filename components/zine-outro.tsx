"use client"

import { forwardRef, useRef } from "react"
import { motion, useTransform, type MotionValue, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { RevealText } from "@/components/reveal-text"

interface ZineOutroProps {
  zine: any
  scrollProgress: MotionValue<number>
  isActive: boolean
}

export const ZineOutro = forwardRef<HTMLElement, ZineOutroProps>(({ zine, scrollProgress, isActive }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true })

  // Animation values
  const contentY = useTransform(scrollProgress, [0.9, 1], [50, 0])
  const contentOpacity = useTransform(scrollProgress, [0.9, 0.95], [0, 1])

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start bg-gradient-to-b from-black via-purple-950/30 to-black"
      id="outro"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.3), transparent 70%)",
            "radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.3), transparent 70%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 container mx-auto px-4 py-16 text-center"
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <RevealText delay={0.2}>
          <h2 className="text-4xl md:text-6xl font-bold font-playfair mb-8 text-gradient tracking-tight">
            Thank You for Experiencing
          </h2>
        </RevealText>

        <RevealText delay={0.4}>
          <h3 className="text-3xl md:text-5xl font-bold mb-12">{zine.title}</h3>
        </RevealText>

        {/* Credits */}
        <motion.div
          className="max-w-2xl mx-auto mb-16 p-8 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h4 className="text-2xl font-bold mb-6 font-playfair">Credits</h4>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <dt className="text-sm text-muted-foreground">Author</dt>
              <dd className="font-medium">{zine.author || "Anonymous"}</dd>
            </div>
            {zine.credits?.design && (
              <div>
                <dt className="text-sm text-muted-foreground">Design</dt>
                <dd className="font-medium">{zine.credits.design}</dd>
              </div>
            )}
            {zine.credits?.content && (
              <div>
                <dt className="text-sm text-muted-foreground">Content</dt>
                <dd className="font-medium">{zine.credits.content}</dd>
              </div>
            )}
            {zine.credits?.photography && (
              <div>
                <dt className="text-sm text-muted-foreground">Photography</dt>
                <dd className="font-medium">{zine.credits.photography}</dd>
              </div>
            )}
          </dl>
        </motion.div>

        {/* Feedback and Share */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-white/20 hover:bg-white/10"
          >
            <Heart size={18} className="text-red-500" />
            <span>Like</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-white/20 hover:bg-white/10"
          >
            <MessageCircle size={18} />
            <span>Comment</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-white/20 hover:bg-white/10"
          >
            <Share2 size={18} />
            <span>Share</span>
          </Button>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="/library">
            <Button size="lg" className="gap-2" >
              <ArrowLeft size={18} />
              <span>Back to Library</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  )
})

ZineOutro.displayName = "ZineOutro"
