"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Box, ShieldCheck, Activity, Zap } from "lucide-react"
import HumanVisualizer from "@/components/human-visualizer"
import OrganicBlob from "@/components/organic-blob"

export default function VisualizerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Shared Design System Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <OrganicBlob className="w-[800px] h-[800px] -top-96 -right-96 bg-primary/10" delay={1} />
        <OrganicBlob className="w-[600px] h-[600px] -bottom-48 -left-48 bg-accent/10" delay={3} />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute inset-0 paper-texture" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 relative z-10">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group px-0"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Health Dashboard</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight mb-4">
                Bio-Digital <span className="text-gradient-primary">Human</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                A high-fidelity 3D visualization of your anatomy. Interacted with biomarker insights for a true "Digital Twin" perspective.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Rendering Engine</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-warm border border-primary/20">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">WebGL 2.0 Active</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* The Visualizer Hub */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-accent/30 rounded-br-2xl pointer-events-none" />
          
          <HumanVisualizer />
        </motion.div>

        {/* Key Features / Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: ShieldCheck, title: "Anatomical Accuracy", desc: "Clinically validated 3D models of all major organ systems." },
            { icon: Activity, title: "Live Sync", desc: "Biomarker data determines focuses on specific anatomical regions." },
            { icon: Zap, title: "Interactive HUD", desc: "Deep dive into cellular-level descriptions for every active label." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-6 rounded-3xl card-warm bg-card/50"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
