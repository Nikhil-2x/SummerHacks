"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Utensils, Upload, X, Loader2, CheckCircle, AlertCircle,
  Maximize2, Minimize2, ChevronUp, ChefHat, Info, ArrowRight,
  TrendingDown, TrendingUp, Check
} from "lucide-react"

interface MenuAnalysisDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  healthSummary?: string
}

interface Recommendation {
  dish_name: string
  category: "Recommend" | "Avoid" | "Neutral"
  reason: string
}

export default function MenuAnalysisDrawer({
  isOpen,
  onOpenChange,
  healthSummary
}: MenuAnalysisDrawerProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<{ recommendations: Recommendation[]; overall_advice: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    await analyzeMenu(file)
  }

  const analyzeMenu = async (file: File) => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    const formData = new FormData()
    formData.append("file", file)
    if (healthSummary) {
      formData.append("summary", healthSummary)
    }

    try {
      const response = await fetch("/api/analyze-menu", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to analyze menu")
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setResults(null)
    setError(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const drawerHeight = isMaximized ? "100vh" : "85vh"

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{ height: drawerHeight }}
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
            >
              <div className="absolute inset-0 bg-card/95 backdrop-blur-2xl rounded-t-3xl border-t border-border" />

              <div className="relative flex flex-col h-full rounded-t-3xl overflow-hidden">
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-12 h-1 rounded-full bg-border" />
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <ChefHat className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-serif font-medium text-foreground">Menu Advisor</h3>
                      <p className="text-[10px] text-muted-foreground">Personalized dining recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {results && (
                      <button
                        onClick={reset}
                        className="p-2 rounded-lg hover:bg-muted text-xs font-medium flex items-center gap-2"
                      >
                        Try another menu
                      </button>
                    )}
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onOpenChange(false)}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
                  {!results && !isAnalyzing && (
                    <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto text-center">
                      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                        <Utensils className="w-10 h-10 text-primary" />
                      </div>
                      <h4 className="text-xl font-serif font-medium mb-3">What's on the menu?</h4>
                      <p className="text-sm text-muted-foreground mb-8">
                        Upload a photo of a restaurant menu, and our AI will suggest the best choices based on your recent blood report results.
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Menu Photo
                      </button>

                      <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3 text-left w-full">
                        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Our advisor analyzes ingredients and preparation methods mentioned on the menu to see how they align with your biomarkers like glucose and cholesterol.
                        </p>
                      </div>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="relative mb-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="w-24 h-24 rounded-full border-b-2 border-primary"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ChefHat className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                      </div>
                      <h4 className="text-lg font-serif font-medium mb-2">Analyzing Menu</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Identifying ingredients and matching with your profile...
                      </p>
                    </div>
                  )}

                  {results && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8 pb-10"
                    >
                      {/* Overall Advice Card */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Info className="w-4 h-4 text-primary" />
                          </div>
                          <h4 className="font-medium">Nutritional Advice</h4>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                          "{results.overall_advice}"
                        </p>
                      </div>

                      {/* Recommendations List */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-widest pl-1">
                          Food Suggestions
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results.recommendations.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`p-4 rounded-xl border flex flex-col gap-3 ${
                                item.category === "Recommend" 
                                  ? "bg-success/5 border-success/20" 
                                  : item.category === "Avoid" 
                                    ? "bg-danger/5 border-danger/20" 
                                    : "bg-muted/30 border-border"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <h5 className="font-medium text-foreground">{item.dish_name}</h5>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  item.category === "Recommend" 
                                    ? "bg-success/20 text-success" 
                                    : item.category === "Avoid" 
                                      ? "bg-danger/20 text-danger" 
                                      : "bg-muted text-muted-foreground"
                                }`}>
                                  {item.category}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {item.reason}
                              </p>
                              <div className="mt-auto pt-2 flex items-center gap-2">
                                {item.category === "Recommend" ? (
                                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                                ) : item.category === "Avoid" ? (
                                  <TrendingDown className="w-3.5 h-3.5 text-danger" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                                <span className="text-[10px] text-muted-foreground/70">
                                  {item.category === "Recommend" ? "Healthy choice" : item.category === "Avoid" ? "High risk" : "Moderate choice"}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="p-6 rounded-2xl bg-danger/5 border border-danger/20 text-center flex flex-col items-center">
                      <AlertCircle className="w-10 h-10 text-danger mb-4" />
                      <h4 className="font-medium text-foreground mb-2">Analysis Failed</h4>
                      <p className="text-sm text-muted-foreground mb-6">{error}</p>
                      <button
                        onClick={reset}
                        className="px-6 py-2 rounded-xl bg-danger text-danger-foreground text-sm font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
