"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useScroll, useSpring, AnimatePresence, motion } from "framer-motion"
import { zines } from "@/data/zines"
import { LetterboxOverlay } from "@/components/letterbox-overlay"
import { ZineViewer } from "@/components/zine-viewer"
import { TableOfContents } from "@/components/table-of-contents"

import { ProgressBar } from "@/components/progress-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ChevronUp, Home } from "lucide-react"
import Link from "next/link"
import { LoadingScreen } from "@/components/loading-screen"

export default function ZinePage() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const [zine, setZine] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [currentNavPage, setCurrentNavPage] = useState(1) // 1-based index for navigation
  const containerRef = useRef<HTMLDivElement>(null)

  // Add scroll velocity state
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const lastScrollTop = useRef(0)
  const lastScrollTime = useRef(Date.now())

  // Add theme detection
  const [zineTheme, setZineTheme] = useState("default")

  // Find the zine data based on the slug
  useEffect(() => {
    const foundZine = zines.find((z) => z.slug === slug)
    setZine(foundZine || null)

    // Simulate loading for a smoother entrance
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [slug])

  // Add scroll velocity detection
  useEffect(() => {
    if (!zine) return

    // Detect theme from zine content
    const allText = zine.pages
      .map((page: any) => `${page.title || ""} ${page.content || ""} ${page.quote || ""}`)
      .join(" ")
      .toLowerCase()

    if (allText.includes("dream") || allText.includes("surreal") || allText.includes("fantasy")) {
      setZineTheme("dream")
    } else if (allText.includes("city") || allText.includes("urban") || allText.includes("street")) {
      setZineTheme("urban")
    } else if (allText.includes("nature") || allText.includes("forest") || allText.includes("ocean")) {
      setZineTheme("nature")
    } else {
      setZineTheme("default")
    }
  }, [zine, zineTheme])

  // Add scroll velocity detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const now = Date.now()
      const deltaTime = now - lastScrollTime.current

      if (deltaTime > 0) {
        // Calculate scroll velocity (pixels per millisecond)
        const rawVelocity = Math.abs(scrollTop - lastScrollTop.current) / deltaTime
        // Smooth the velocity value
        setScrollVelocity((prev) => prev * 0.8 + rawVelocity * 20)
      }

      lastScrollTop.current = scrollTop
      lastScrollTime.current = now
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth scroll progress for animations
  const smoothScrollProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 100 })

  // Handle page navigation
  const handlePageSelect = (index: number) => {
    setActivePageIndex(index)

    // Scroll to the selected page
    const pageElement = document.getElementById(`page-${index}`)
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const totalPages = zine ? zine.pages.length + 1 : 0

  const goUp = () => {
    if (currentNavPage > 1) {
      const newPage = currentNavPage - 1
      setCurrentNavPage(newPage)
      document.getElementById(`page-${newPage}`)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const goDown = () => {
    if (currentNavPage < totalPages) {
      const newPage = currentNavPage + 1
      setCurrentNavPage(newPage)
      document.getElementById(`page-${newPage}`)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // If zine not found
  if (!isLoading && !zine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-4xl font-bold mb-6">Zine Not Found</h1>
        <p className="text-xl mb-8">The zine you're looking for doesn't exist or has been moved.</p>
        <Link href="/library">
          <Button>Return to Library</Button>
        </Link>
      </div>
    )
  }


  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>{isLoading && <LoadingScreen title={zine?.title} />}</AnimatePresence>

      <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Film Grain Effect */}
        <div className="film-grain" />

        {/* Vignette Effect */}
        <div className="vignette" />

        {/* Cinematic Letterbox Effect */}
        <LetterboxOverlay />

        {/* Progress Bar */}
        <ProgressBar />

        {/* Navigation */}
        <motion.div
          className="fixed top-6 left-6 z-50 flex gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href="/library">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-sm bg-black/20 backdrop-blur-sm hover:bg-black/40"
            >
              <ArrowLeft size={16} />
              Back to Library
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-sm bg-black/20 backdrop-blur-sm hover:bg-black/40"
            >
              <Home size={16} />
              Home
            </Button>
          </Link>
        </motion.div>

        {/* Table of Contents */}
        {zine && <TableOfContents pages={zine.pages} onPageSelect={handlePageSelect} />}

        {/* Page Navigation Buttons Up and Down*/}
        {zine && (

    <div className="fixed right-6 bottom-10 z-50 flex flex-col items-center gap-2">
      <button
        onClick={goUp}

        className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition-colors disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronUp size={24} />
      </button>
      <button
        onClick={goDown}
        className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition-colors disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronDown size={24} />
      </button>
    </div>
        )}

        {/* Main Zine Content */}
        {zine && (
          <ZineViewer
            zine={zine}
            scrollProgress={smoothScrollProgress}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}
            scrollVelocity={scrollVelocity}
            theme={zineTheme}
          />
        )}
      </div>
    </>
  )
}