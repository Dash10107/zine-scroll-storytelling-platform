"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, X, Home, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { zines } from "@/data/zines"

import { MagneticButton } from "@/components/magnetic-button"
import { LetterboxOverlay } from "@/components/letterbox-overlay"
import { RevealText } from "@/components/reveal-text"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ZineLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("latest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Get all unique tags from zines
  const allTags = Array.from(new Set(zines.flatMap((zine) => zine.tags || [])))

  // Define categories
  const categories = [
    { id: "all", name: "All Zines" },
    { id: "photography", name: "Photography" },
    { id: "technology", name: "Technology" },
    { id: "nature", name: "Nature" },
  ]

  // Filter zines based on search query, active tag, and category
  const filteredZines = zines.filter((zine) => {
    const matchesSearch =
      searchQuery === "" ||
      zine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zine.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = activeTag === null || (zine.tags && zine.tags.includes(activeTag))

    const matchesCategory = activeCategory === "all" || (zine.tags && zine.tags.includes(activeCategory))

    return matchesSearch && matchesTag && matchesCategory
  })

  // Sort zines based on sort order
  const sortedZines = [...filteredZines].sort((a, b) => {
    if (sortOrder === "latest") {
      return b.id - a.id
    } else if (sortOrder === "oldest") {
      return a.id - b.id
    } else if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag)
    
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const handleSortChange = (value: string) => {
    setSortOrder(value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  // Use useInView at the top level
  const isHeaderInView = useInView(headerRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -100])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const smoothHeaderY = useSpring(headerY, { damping: 15, stiffness: 100 })
  const smoothHeaderOpacity = useSpring(headerOpacity, { damping: 15, stiffness: 100 })

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950" ref={containerRef}>
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-purple-950 animate-gradient-flow" />

        {/* Background image with overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Floating elements */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/5 backdrop-blur-3xl"
            style={{
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>

      {/* Film Grain Effect */}
      <div className="film-grain" />

      {/* Vignette Effect */}
      <div className="vignette" />

      {/* Cinematic Letterbox Effect */}
      <LetterboxOverlay />



      {/* Home button */}
      <motion.div
        className="fixed top-6 left-20 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm bg-black/20 backdrop-blur-sm hover:bg-black/40"
            data-cursor-interact
          >
            <Home size={16} />
            Home
          </Button>
        </Link>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          ref={headerRef}
          style={{
            y: smoothHeaderY,
            opacity: smoothHeaderOpacity,
          }}
          className="mb-16"
        >
          <RevealText delay={0.2}>
            <h1 className="text-6xl md:text-8xl font-bold font-playfair text-center mb-6 text-gradient tracking-tight">
              Zine Library
            </h1>
          </RevealText>

          <RevealText delay={0.4}>
            <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Explore our collection of digital zines, each with a unique story to tell
            </p>
          </RevealText>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs defaultValue="all" className="w-full" onValueChange={handleCategoryChange}>
          <TabsList className="grid grid-cols-4 mb-12 bg-black/40 backdrop-blur-sm border border-white/10 p-1 w-full max-w-2xl mx-auto h-14">

              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-3"
                  data-cursor-interact
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8 sticky top-4 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="search"
              placeholder="Search zines..."
              className="pl-10 pr-10 h-12 bg-black/40 backdrop-blur-sm border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-cursor-interact
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                onClick={clearSearch}
                data-cursor-interact
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Select defaultValue="latest" onValueChange={handleSortChange}>
              <SelectTrigger
                className="w-[180px] h-12 border-white/10 bg-black/40 backdrop-blur-sm hover:bg-white/10 focus:ring-1 focus:ring-primary/30"
                data-cursor-interact
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-12 border-white/10 bg-black/40 backdrop-blur-sm hover:bg-white/10 focus:ring-1 focus:ring-primary/30"
              onClick={toggleFilter}
              data-cursor-interact
            >
              <Filter size={18} />
              <span className="ml-2 hidden md:inline">Filters</span>
            </Button>
          </div>
        </motion.div>

        {/* Tag filters - only show when filter is open */}
        <motion.div
          className="flex flex-wrap gap-2 mb-12"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isFilterOpen ? 1 : 0,
            height: isFilterOpen ? "auto" : 0,
            marginBottom: isFilterOpen ? "3rem" : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="cursor-pointer text-sm py-1.5 px-4 rounded-full"
              onClick={() => handleTagClick(tag)}
              data-cursor-interact
            >
              {tag}
            </Badge>
          ))}
        </motion.div>

        {!isLoaded ? (
          // Loading skeleton
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-black/40"
                variants={itemVariants}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [0.98, 1, 0.98],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        ) : (
          // Actual content
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedZines.map((zine, index) => (
              <motion.div
                key={zine.slug}
                variants={itemVariants}
                whileHover={{ y: -15, transition: { duration: 0.3 } }}
                className="group"
                data-cursor-interact
              >
                <Link href={`/zine/${zine.slug}`} >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-6 bg-black/40 shadow-xl shadow-black/50 border border-white/5 group-hover:border-primary/30 transition-all duration-300">
                    <Image
                      src={zine.cover || "/placeholder.svg?height=600&width=450"}
                      alt={zine.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Animated overlay content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <motion.h3
                        className="text-2xl font-bold font-playfair mb-2 group-hover:text-primary transition-colors duration-300"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                      >
                        {zine.title}
                      </motion.h3>

                      <p className="text-sm text-muted-foreground mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {zine.author || "Anonymous"}
                      </p>

                      <div className="flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        {zine.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* View button that appears on hover */}
                      <motion.div
                        className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                        >
                          <span className="mr-1">View Zine</span>
                          <ArrowRight size={14} />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {isLoaded && sortedZines.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-2">No zines found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}

        <motion.div
          className="flex justify-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MagneticButton>
            <Link href="/">
              <Button
                variant="outline"
                className="gap-2 group border-white/10 bg-black/40 backdrop-blur-sm hover:bg-white/10"
                data-cursor-interact
              >
                <span>Back to Home</span>
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
              </Button>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  )
}
