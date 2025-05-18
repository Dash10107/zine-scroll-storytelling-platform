"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"

import { MagneticButton } from "./magnetic-button"
import { LetterboxOverlay } from "./letterbox-overlay"
import Image from "next/image"
import { RevealText } from "./reveal-text"
import { PerspectiveText } from "./perspective-text"

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const trailerRef = useRef<HTMLDivElement>(null)

  const [hasInteracted, setHasInteracted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isVideoMounted, setIsVideoMounted] = useState(false)

  const isTitleInView = useInView(titleRef, { once: true })
  const isSubtitleInView = useInView(subtitleRef, { once: true })
  const isCtaInView = useInView(ctaRef, { once: true })
  const isTrailerInView = useInView(trailerRef, { once: false, amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 0.5], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9])
  const textY = useTransform(scrollYProgress, [0, 0.3], ["0%", "100%"])

  const smoothY = useSpring(y, { damping: 15, stiffness: 100 })
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 })
  const smoothScale = useSpring(scale, { damping: 15, stiffness: 100 })
  const smoothTextY = useSpring(textY, { damping: 20, stiffness: 80 })

  // Trailer section animations
  const trailerProgress = useScroll({
    target: trailerRef,
    offset: ["start end", "end start"],
  })

  const trailerOpacity = useTransform(trailerProgress.scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const trailerScale = useTransform(trailerProgress.scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])


  // Handle intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Improved video handling
  useEffect(() => {
    // Set video as mounted
    setIsVideoMounted(true)

    // Clean up function
    return () => {
      setIsVideoMounted(false)
    }
  }, [])

  // Handle video playback with better error handling
  useEffect(() => {
    if (!isVideoMounted || !videoRef.current) return

    let mounted = true
    let playAttempt: ReturnType<typeof setTimeout>

    const attemptPlay = async () => {
      if (!videoRef.current || !mounted) return

      try {
        // Use a low volume during initial play attempt to be less intrusive
        if (videoRef.current) {
          videoRef.current.volume = 0.1
          videoRef.current.playbackRate = 0.25
        }

        await videoRef.current.play()
        if (mounted) {
          setVideoLoaded(true)
          setVideoError(false)
        }
      } catch (error) {
        console.log("Video autoplay failed, using fallback:", error)
        if (mounted) setVideoError(true)
      }
    }

    // Add user interaction handlers to try playing again
    const handleUserInteraction = () => {
      if (videoError && videoRef.current && mounted) {
        attemptPlay()
      }
    }

    // Try to play the video
    attemptPlay()

    // Set up retry mechanism
    playAttempt = setTimeout(() => {
      if (!videoLoaded && mounted && videoRef.current) {
        attemptPlay()
      }
    }, 1000)

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      mounted = false
      clearTimeout(playAttempt)
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [isVideoMounted, videoError, videoLoaded])

  // Featured zines data for the trailer section
  const featuredZines = [
    {
      title: "Urban Dreams",
      subtitle: "A visual exploration of city life",
      description: "Discover the hidden beauty in concrete jungles and urban landscapes.",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1964&auto=format&fit=crop",
      slug: "urban-dreams",
    },
    {
      title: "Digital Nostalgia",
      subtitle: "Retro tech meets modern aesthetics",
      description: "A journey through the evolution of digital culture and technology.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      slug: "digital-nostalgia",
    },
    {
      title: "Nature Patterns",
      subtitle: "The mathematics of beauty",
      description: "Exploring the recurring patterns and symmetry found in the natural world.",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
      slug: "nature-patterns",
    },
  ]

  // Animated background gradient as fallback
  const AnimatedGradientBackground = () => (
    <motion.div
      className="absolute inset-0 w-full h-full"
      style={{
        background: "linear-gradient(to bottom, #0f0f1e, #2e1065, #4c1d95)",
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <div className="absolute inset-0 opacity-30">
        <Image
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop"
          alt="Background Texture"
          fill
          className="object-cover mix-blend-overlay"
          priority
        />
      </div>
    </motion.div>
  )

  return (
    <>
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <h1 className="text-6xl md:text-8xl font-bold font-display text-gradient">Zinima</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative min-h-[300vh] overflow-auto scroll-smooth" ref={containerRef}>
        {/* Cinematic Letterbox Effect */}
        <LetterboxOverlay />

        {/* Background Video or Fallback */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          {!videoError ? (
            isVideoMounted && (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline

                poster="https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop"
              >
                <source src="/videos/vide.mp4" type="video/mp4" />
              </video>
            )
          ) : (
            <AnimatedGradientBackground />
          )}

          {/* Animated gradient overlay */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-b from-black via-purple-950/30 to-black transition-opacity duration-1000 ${
              videoLoaded ? "opacity-60" : "opacity-100"
            }`}
            animate={{
              opacity: [0.4, 0.6, 0.4],
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-20" />
        </div>

        {/* Film Grain Effect */}
        <div className="film-grain" />

        {/* Vignette Effect */}
        <div className="vignette" />

        {/* Floating Particles */}
        <motion.div
          className="fixed inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100],
                x: [0, Math.random() * 50 - 25],
                opacity: [0.2, 0.8, 0],
                scale: [1, Math.random() * 3 + 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>



        {/* Hero Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
          style={{
            y: smoothY,
            opacity: smoothOpacity,
            scale: smoothScale,
          }}
        >
          <motion.h1
            ref={titleRef}
            className="text-7xl md:text-9xl lg:text-[10rem] font-bold font-display text-gradient mb-6 tracking-tighter"
            initial={{ opacity: 0, y: 50 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1.2,
              delay: showIntro ? 3.2 : 0.2,
              ease: [0.16, 1, 0.3, 1], // Custom ease curve for more artistic motion
            }}
          >
            Zinima
          </motion.h1>

          <motion.p
            ref={subtitleRef}
            className="text-xl md:text-2xl max-w-2xl mb-12 text-muted-foreground font-light tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={isSubtitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1,
              delay: showIntro ? 3.5 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ y: smoothTextY }}
          >
            An immersive, scroll-driven storytelling platform for flipping through digital zines
          </motion.p>

          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1,
              delay: showIntro ? 3.8 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <MagneticButton>
              <Link href="/zine/urban-dreams" >
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 rounded-full bg-primary hover:bg-primary/90 transition-all duration-500 shadow-[0_0_25px_rgba(236,72,153,0.5)] group"
                >
                  <span className="mr-2">Read Zine</span>
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={18} />
                </Button>
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Scroll down indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2 text-muted-foreground"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <span className="text-sm">Scroll to explore</span>
              <ChevronDown size={20} className="text-primary animate-bounce" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cinematic Trailer Section */}
        <div ref={trailerRef} className="relative z-10 min-h-[200vh] py-20">
          {/* Section Title */}
          <motion.div
            className="text-center mb-20 px-4"
            initial={{ opacity: 0 }}
            animate={isTrailerInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            <RevealText delay={0.2}>
              <h2 className="text-4xl md:text-6xl font-bold font-display mb-4 tracking-tight">
                <span className="text-gradient">Featured Zines</span>
              </h2>
            </RevealText>
            <RevealText delay={0.4}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Immerse yourself in our curated collection of digital storytelling experiences
              </p>
            </RevealText>
          </motion.div>

          {/* Featured Zines */}
          {featuredZines.map((zine, index) => (
            <motion.div
              key={zine.title}
              className="min-h-screen flex flex-col md:flex-row items-center relative overflow-hidden py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Background Image with Parallax */}
              <motion.div
                className="absolute inset-0 z-0"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                <Image
                  src={zine.image || "/placeholder.svg"}
                  alt={zine.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </motion.div>

              {/* Content */}
              <div className="container mx-auto px-4 z-10">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-sm uppercase tracking-widest text-primary mb-2 inline-block">
                      Featured Zine {index + 1}
                    </span>
                  </motion.div>

                  <motion.h3
                    className="text-4xl md:text-6xl font-bold font-display mb-4 tracking-tight"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <PerspectiveText>{zine.title}</PerspectiveText>
                  </motion.h3>

                  <motion.p
                    className="text-xl md:text-2xl text-primary/90 mb-4 font-medium"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {zine.subtitle}
                  </motion.p>

                  <motion.p
                    className="text-lg text-muted-foreground mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {zine.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <MagneticButton>
                      <Link href={`/zine/${zine.slug}`}>
                        <Button
                          variant="outline"
                          className="gap-2 group border-white/20 hover:bg-white/10"
                          
                        >
                          <span>Explore {zine.title}</span>
                          <ArrowRight
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            size={16}
                          />
                        </Button>
                      </Link>
                    </MagneticButton>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Final CTA Section */}
          <motion.div
            className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-20 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 z-0 opacity-30"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(236,72,153,0.3) 0%, transparent 70%)",
                backgroundSize: "120% 120%",
              }}
            />

            <RevealText delay={0.2}>
              <h2 className="text-4xl md:text-6xl font-bold font-display mb-6 tracking-tight">
                Ready to <span className="text-gradient">Dive In?</span>
              </h2>
            </RevealText>

            <RevealText delay={0.4}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Explore our collection of digital zines or create your own immersive storytelling experience
              </p>
            </RevealText>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <MagneticButton>
                <Link href="/library">
                  <Button size="lg" className="gap-2 group" onClick={() => playSound("click")}>
                    <span>Browse Library</span>
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                  </Button>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="/create">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 group border-white/20 hover:bg-white/10"

                  >
                    <span>Create Your Own</span>
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        {/* Footer */}
        <motion.footer
          className="relative z-10 py-12 border-t border-white/10 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold font-display text-gradient mb-2">Zinima</h3>
                <p className="text-sm text-muted-foreground">Immersive digital storytelling platform</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Navigation</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/library"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Library
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/create"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Create
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Connect</h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Zinima. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>
      </main>
    </>
  )
}
