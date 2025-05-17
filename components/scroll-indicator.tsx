"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.span
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="text-sm text-muted-foreground"
      >
        Scroll to continue
      </motion.span>
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
      >
        <ChevronDown className="text-primary" size={20} />
        <ChevronDown className="text-primary/70 -mt-3" size={16} />
        <ChevronDown className="text-primary/40 -mt-3" size={12} />
      </motion.div>
    </motion.div>
  )
}
