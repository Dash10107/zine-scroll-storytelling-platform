"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, X, ChevronRight } from "lucide-react"


interface TableOfContentsProps {
  pages: any[]
  onPageSelect?: (index: number) => void
}

export function TableOfContents({ pages, onPageSelect }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)


  const toggleTOC = () => {
    setIsOpen(!isOpen)
   
  }

  const handlePageClick = (index: number) => {
    // Close the TOC
    setIsOpen(false)


    // Call the page select handler if provided
    if (onPageSelect) {
      onPageSelect(index)
    }
  }

  return (
    <>
      <motion.button
        className="toc-button"
        onClick={toggleTOC}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        aria-label="Table of contents"
      >
        {isOpen ? <X size={20} /> : <List size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-background/95 backdrop-blur-md border-l border-border z-40 overflow-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-display mb-2">Contents</h2>
                <motion.button
                  onClick={toggleTOC}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close table of contents"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <ul className="space-y-4">
                {pages.map((page, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.button
                      className="w-full text-left p-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group"
                      onClick={() => handlePageClick(index)}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{page.title || `Page ${index + 1}`}</span>
                      <ChevronRight
                        size={16}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </motion.button>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: pages.length * 0.05 }}
                >
                  <motion.button
                    className="w-full text-left p-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group"
                    onClick={() => handlePageClick(pages.length)}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                      {pages.length + 1}
                    </span>
                    <span className="font-medium">Credits & Feedback</span>
                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
