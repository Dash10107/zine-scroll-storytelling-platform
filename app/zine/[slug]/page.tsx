"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ZineViewer } from "@/components/zine-viewer"
import { ProgressBar } from "@/components/progress-bar"
import { TableOfContents } from "@/components/table-of-contents"
import { zines } from "@/data/zines"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageTurnEffect } from "@/components/page-turn-effect"
import { ArrowLeft, Home } from "lucide-react"
import { ScrollProgressDots } from "@/components/scroll-progress-dots"
import { MouseFollower } from "@/components/mouse-follower"

export default function ZinePage() {
  const router = useRouter()
  const { slug } = useParams()
  const [currentZine, setCurrentZine] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPageTurning, setIsPageTurning] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState(null)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const currentSlug = Array.isArray(slug) ? slug[0] : String(slug);
  
    const zineData = zines.find((zine) => zine.slug === currentSlug);
  
    let loadingInterval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;
  
    // Start simulating loading progress
    loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const increment = Math.max(5, Math.min(15, (100 - prev) / 5));
        const newProgress = prev + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 120);
  
    // Simulate delay before showing content
    timer = setTimeout(() => {
      clearInterval(loadingInterval);
      setLoadingProgress(100);
  
      if (zineData) {
        setCurrentZine(zineData as any); // Cast as needed for TS
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } else {
        setError("Zine not found");
        setIsLoading(false);
      }
    }, 1800);
  
    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(loadingInterval);
    };
  }, [slug, zines]);
  

  const handlePageTurn = () => {
    setIsPageTurning(true)
    
    setTimeout(() => {
      setIsPageTurning(false)
    }, 1000)
  }

  const handlePageChange = (index) => {
    if (index < 0 || (currentZine && currentZine.pages && index >= currentZine.pages.length)) {
      console.warn("Page index out of bounds:", index)
      return
    }
    
    setActivePageIndex(index)

    // Get the target page element
    const pages = containerRef.current?.querySelectorAll("section")
    if (pages && pages[index]) {
      // Scroll to the target page
      pages[index].scrollIntoView({ behavior: "smooth", block: "start" })
      handlePageTurn()
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
        <motion.div
          className="text-5xl font-display text-gradient mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0.2, 1, 0.2],
            y: [10, 0, 10],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading Zine...
        </motion.div>

        {/* Loading progress bar with improved animation */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary/80 to-primary"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Loading percentage with smoother animation */}
        <motion.p
          className="text-sm text-muted-foreground mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(loadingProgress)}%
        </motion.p>
      </div>
    )
  }

  // Show error state if zine not found
  if (error || !currentZine) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black gap-8">
        <motion.div
          className="text-5xl font-display text-gradient text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Zine Not Found
        </motion.div>
        <motion.p
          className="text-muted-foreground mb-8 max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The zine you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/zine/library">
            <Button
              variant="outline"
              className="gap-2 border-white/20 hover:bg-white/10"
            >
              Browse Zine Library
            </Button>
          </Link>
          <Link href="/">
            <Button>
              <Home className="mr-2" size={16} />
              Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={String(slug)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-screen"
        ref={containerRef}
      >
        <ProgressBar />
        {currentZine.pages && (
          <TableOfContents 
            pages={currentZine.pages} 
            onPageSelect={handlePageChange} 
          />
        )}
        <MouseFollower />

        {/* Scroll Progress Dots */}
        {currentZine.pages && (
          <ScrollProgressDots
            totalPages={currentZine.pages.length + 1}
            activeIndex={activePageIndex}
            onDotClick={handlePageChange}
          />
        )}

        {/* Back button with improved animation */}
        <motion.div
          className="fixed top-6 left-6 z-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <Link href="/library">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-sm bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all duration-300"
            >
              <ArrowLeft size={16} />
              Back to Library
            </Button>
          </Link>
        </motion.div>

        <PageTurnEffect isActive={isPageTurning}>
          <ZineViewer
            zine={currentZine}
            onPageChange={handlePageTurn}
            onActivePageChange={setActivePageIndex}
            activePageIndex={activePageIndex}
          />
        </PageTurnEffect>
      </motion.div>
    </AnimatePresence>
  )
}
