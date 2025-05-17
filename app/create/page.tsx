"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

import { LetterboxOverlay } from "@/components/letterbox-overlay"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Trash2, Upload, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RevealText } from "@/components/reveal-text"
import Image from "next/image"

export default function CreateZinePage() {

  const [activeTab, setActiveTab] = useState("details")
  const [zineTitle, setZineTitle] = useState("")
  const [zineDescription, setZineDescription] = useState("")
  const [zineAuthor, setZineAuthor] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [pages, setPages] = useState([{ title: "", content: "", layout: "centered-text", image: null }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const handleAddPage = () => {
    setPages([...pages, { title: "", content: "", layout: "centered-text", image: null }])
  }

  const handleRemovePage = (index: number) => {
    const newPages = [...pages]
    newPages.splice(index, 1)
    setPages(newPages)
  }

  const handlePageChange = (index: number, field: string, value: string | null) => {
    const newPages = [...pages]
    newPages[index] = { ...newPages[index], [field]: value }
    setPages(newPages)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 2000)
  }

  // Sample cover images for demonstration
  const sampleCovers = [
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1964&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop",
  ]

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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950">
      <div className="absolute inset-0 bg-noise z-0" />

      {/* Background image with overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Film Grain Effect */}
      <div className="film-grain" />

      {/* Vignette Effect */}
      <div className="vignette" />

      {/* Cinematic Letterbox Effect */}
      <LetterboxOverlay />


      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-16"
        >
          <RevealText delay={0.2}>
            <h1 className="text-6xl md:text-8xl font-bold font-playfair text-center mb-6 text-gradient tracking-tight">
              Create Your Zine
            </h1>
          </RevealText>

          <RevealText delay={0.4}>
            <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Design your own digital zine with our easy-to-use editor
            </p>
          </RevealText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="details" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-12 bg-black/40 backdrop-blur-sm border border-white/10 p-1">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-3"
                
              >
                Zine Details
              </TabsTrigger>
              <TabsTrigger
                value="pages"
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-3"
                
              >
                Pages
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-3"
                
              >
                Preview & Publish
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="floating-label">
                      <Input
                        id="title"
                        placeholder=" "
                        value={zineTitle}
                        onChange={(e) => setZineTitle(e.target.value)}
                      />
                      <Label htmlFor="title">Zine Title</Label>
                    </div>

                    <div className="floating-label">
                      <Textarea
                        id="description"
                        placeholder=" "
                        className="min-h-[120px] pt-6"
                        value={zineDescription}
                        onChange={(e) => setZineDescription(e.target.value)}
                      />
                      <Label htmlFor="description">Description</Label>
                    </div>

                    <div className="floating-label">
                      <Input
                        id="author"
                        placeholder=" "
                        value={zineAuthor}
                        onChange={(e) => setZineAuthor(e.target.value)}
                      />
                      <Label htmlFor="author">Author</Label>
                    </div>

                    <div>
                      <Label htmlFor="cover" className="text-lg mb-4 block">
                        Cover Image
                      </Label>

                      {coverImage ? (
                        <div className="relative aspect-[3/4] max-w-xs mx-auto rounded-lg overflow-hidden border-2 border-primary/50 mb-4">
                          <Image
                            src={coverImage || "/placeholder.svg"}
                            alt="Cover preview"
                            fill
                            className="object-cover"
                          />
                          <button
                          type="button"
                            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                            onClick={() => {
                              setCoverImage(null)
                              
                            }}
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Upload className="mb-2 text-muted-foreground" size={24} />
                            <span className="text-muted-foreground mb-4">
                              Drag and drop an image or click to browse
                            </span>
                            <Button variant="outline" className="border-white/20" >
                              Upload Cover
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <p className="text-sm text-muted-foreground mb-3">Or select from our templates:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {sampleCovers.map((cover, index) => (
                            <div
                              key={index}
                              className={`relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                                coverImage === cover ? "border-primary" : "border-transparent hover:border-white/50"
                              }`}
                              onClick={() => {
                                setCoverImage(cover)
                                
                              }}
                            >
                              <Image
                                src={cover || "/placeholder.svg"}
                                alt={`Template ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {coverImage === cover && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <Check className="text-white" size={24} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages">
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {pages.map((page, index) => (
                      <motion.div
                        key={index}
                        className="p-6 border border-white/10 rounded-md bg-black/20 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold">Page {index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-white hover:bg-red-900/20"
                            onClick={() => handleRemovePage(index)}
                            disabled={pages.length === 1}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="floating-label">
                            <Input
                              placeholder=" "
                              value={page.title}
                              onChange={(e) => handlePageChange(index, "title", e.target.value)}
                              
                            />
                            <Label>Page Title</Label>
                          </div>

                          <div className="floating-label">
                            <Textarea
                              placeholder=" "
                              className="min-h-[120px] pt-6"
                              value={page.content}
                              onChange={(e) => handlePageChange(index, "content", e.target.value)}
                              
                            />
                            <Label>Page Content</Label>
                          </div>

                          <div>
                            <Label className="mb-2 block">Layout Style</Label>
                            <Select
                              defaultValue={page.layout}
                              onValueChange={(value) => handlePageChange(index, "layout", value)}
                            >
                              <SelectTrigger className="bg-black/40 border-white/10">
                                <SelectValue placeholder="Select layout" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                                <SelectItem value="cinematic-centered">Cinematic Centered</SelectItem>
                                <SelectItem value="split-layout">Split Layout</SelectItem>
                                <SelectItem value="full-bleed">Full Bleed</SelectItem>
                                <SelectItem value="grid-layout">Grid Layout</SelectItem>
                                <SelectItem value="magazine-style">Magazine Style</SelectItem>
                                <SelectItem value="immersive-quote">Immersive Quote</SelectItem>
                                <SelectItem value="photo-essay">Photo Essay</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="mb-2 block">Background Image</Label>
                            {page.image ? (
                              <div className="relative h-40 rounded-md overflow-hidden mb-2">
                                <Image
                                  src={(page.image as string) || "/placeholder.svg"}
                                  alt="Page background"
                                  fill
                                  className="object-cover"
                                />
                                <button
                                type="button"
                                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                                  onClick={() => {
                                    handlePageChange(index, "image", null)
                                    
                                  }}
                                >
                                  <X size={16} className="text-white" />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="border-2 border-dashed border-white/20 rounded-md p-4 text-center hover:border-primary/50 transition-colors cursor-pointer h-40 flex flex-col items-center justify-center"
                                onClick={() => {
                                  // For demo, just set a random image
                                  const randomImage = sampleCovers[Math.floor(Math.random() * sampleCovers.length)]
                                  handlePageChange(index, "image", randomImage)
                                  
                                }}
                              >
                                <Upload className="mb-2 text-muted-foreground" size={20} />
                                <span className="text-sm text-muted-foreground">Click to add background image</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <Button
                        variant="outline"
                        className="w-full py-6 border-dashed border-white/20 hover:border-primary/50 hover:bg-black/20"
                        onClick={handleAddPage}
                      >
                        <Plus size={18} className="mr-2" />
                        Add New Page
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold font-display mb-4">Preview Your Zine</h3>
                      <p className="text-muted-foreground mb-8">
                        Here's how your zine will look when published. Make any final adjustments before publishing.
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="relative aspect-[3/4] w-full max-w-xs rounded-lg overflow-hidden shadow-xl">
                        <Image
                          src={
                            coverImage ||
                            "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop"
                           || "/placeholder.svg"}
                          alt="Zine cover preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
                        <div className="absolute bottom-0 left-0 p-6">
                          <h3 className="text-2xl font-bold font-display mb-2">{zineTitle || "Untitled Zine"}</h3>
                          <p className="text-sm text-muted-foreground">{zineAuthor || "Anonymous"}</p>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2">Zine Details</h4>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm text-muted-foreground">Title</dt>
                            <dd className="font-medium">{zineTitle || "Untitled Zine"}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Author</dt>
                            <dd className="font-medium">{zineAuthor || "Anonymous"}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Pages</dt>
                            <dd className="font-medium">{pages.length}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Description</dt>
                            <dd className="font-medium line-clamp-3">
                              {zineDescription || "No description provided."}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-xl font-bold mb-4">Page Previews</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {pages.map((page, index) => (
                          <div key={index} className="relative aspect-[3/4] rounded-md overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"/>
                            <Image
                              src={
                                page.image ||
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
                               || "/placeholder.svg"}
                              alt={`Page ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-3 z-20">
                              <p className="text-xs font-medium">{page.title || `Page ${index + 1}`}</p>
                            </div>
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                              <p className="text-xs font-bold bg-black/60 px-2 py-1 rounded">Page {index + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center pt-8">
                      <Button
                        size="lg"
                        className="relative overflow-hidden group"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.div
                              key="submitting"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Publishing...
                            </motion.div>
                          ) : isSuccess ? (
                            <motion.div
                              key="success"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              <Check className="mr-2" size={18} />
                              Published!
                            </motion.div>
                          ) : (
                            <motion.div
                              key="default"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              Publish Zine
                              <ArrowRight
                                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                size={18}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        </div>
        </div>
    )


}