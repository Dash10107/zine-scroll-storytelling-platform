"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EmotionSlider } from "./emotion-slider"

interface InteractiveElementProps {
  type: string
}

export function InteractiveElement({ type }: InteractiveElementProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  // Poll options
  const pollOptions = [
    { id: "option1", label: "Strongly Agree" },
    { id: "option2", label: "Agree" },
    { id: "option3", label: "Neutral" },
    { id: "option4", label: "Disagree" },
    { id: "option5", label: "Strongly Disagree" },
  ]

  // Handle poll selection
  const handlePollSelect = (optionId: string) => {
    setSelectedOption(optionId)

    // Simulate revealing results after selection
    setTimeout(() => {
      setIsRevealed(true)
    }, 500)
  }

  // Render different interactive elements based on type
  const renderInteractiveContent = () => {
    switch (type) {
      case "poll":
        return (
          <div className="space-y-6 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-xl font-medium text-center mb-4">What do you think?</h3>

            <div className="space-y-3">
              {pollOptions.map((option) => (
                <motion.button
                  key={option.id}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedOption === option.id ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"
                  }`}
                  onClick={() => handlePollSelect(option.id)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isRevealed}
                >
                  {option.label}

                  {isRevealed && (
                    <motion.div
                      className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 70 + 30}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <div className="h-full bg-primary/70" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {isRevealed && (
              <motion.p
                className="text-center text-sm text-muted-foreground mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Thanks for sharing your opinion!
              </motion.p>
            )}
          </div>
        )

      case "tabs":
        return (
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-black/40 backdrop-blur-sm border border-white/10 p-1">
              <TabsTrigger
                value="tab1"
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-3"
              >
                First Perspective
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-3"
              >
                Second Perspective
              </TabsTrigger>
              <TabsTrigger
                value="tab3"
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-3"
              >
                Third Perspective
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tab1" className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-medium mb-3">The First Perspective</h3>
              <p className="text-muted-foreground">
                This viewpoint emphasizes the importance of individual experience and personal interpretation. It
                suggests that meaning is derived from our unique perspectives and lived experiences.
              </p>
            </TabsContent>

            <TabsContent value="tab2" className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-medium mb-3">The Second Perspective</h3>
              <p className="text-muted-foreground">
                This approach considers the collective understanding and shared cultural context. It explores how
                meaning is constructed through social interaction and community values.
              </p>
            </TabsContent>

            <TabsContent value="tab3" className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-medium mb-3">The Third Perspective</h3>
              <p className="text-muted-foreground">
                This viewpoint transcends both individual and collective understanding to examine universal patterns. It
                looks for underlying structures and principles that may exist across different contexts.
              </p>
            </TabsContent>
          </Tabs>
        )

      case "emotion":
        return <EmotionSlider />

      case "reveal":
        return (
          <div className="text-center">
            <motion.div
              className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
              initial={{ height: isRevealed ? "auto" : "100px" }}
              animate={{ height: isRevealed ? "auto" : "100px" }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-medium mb-3">Hidden Content</h3>

              <div className={`transition-opacity duration-500 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
                <p className="text-muted-foreground mb-4">
                  This is the hidden content that is revealed when you click the button below. It contains additional
                  insights and perspectives that add depth to the narrative.
                </p>

                <p className="text-muted-foreground">
                  By revealing this content, you're engaging more deeply with the material and exploring the layers of
                  meaning embedded within the story.
                </p>
              </div>
            </motion.div>

            <Button
              variant="outline"
              className="mt-4 border-white/20 hover:bg-white/10"
              onClick={() => {
                setIsRevealed(!isRevealed)
              }}
            >
              {isRevealed ? "Hide Content" : "Reveal Content"}
            </Button>
          </div>
        )

      default:
        return (
          <div className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 text-center">
            <h3 className="text-xl font-medium mb-3">Interactive Element</h3>
            <p className="text-muted-foreground">
              This is an interactive element that invites reader engagement. Interact with it to explore additional
              dimensions of the content.
            </p>
            <Button className="mt-4" >
              Interact
            </Button>
          </div>
        )
    }
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {renderInteractiveContent()}
    </motion.div>
  )
}
