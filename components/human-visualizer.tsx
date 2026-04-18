"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Maximize2, Info, Activity, ShieldCheck, Zap } from "lucide-react"

export default function HumanVisualizer() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-[2rem] overflow-hidden border border-border/50 bg-card shadow-2xl group">
      {/* Premium Header/Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 px-4 py-2 rounded-full glass-warm border border-primary/20"
        >
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Digital Twin Active</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2 pointer-events-auto"
        >
          <button className="w-10 h-10 rounded-full glass-warm border border-border/50 flex items-center justify-center hover:bg-secondary transition-all">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full glass-warm border border-border/50 flex items-center justify-center hover:bg-secondary transition-all">
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>
      </div>

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
          <div className="relative w-24 h-24 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full"
            />
            <div className="absolute inset-4 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-serif italic text-muted-foreground animate-pulse">
            Calibrating bio-digital markers...
          </p>
        </div>
      )}

      {/* The 3D Viewer Iframe */}
      <iframe
        id="embedded-human"
        frameBorder="0"
        className="w-full h-full min-h-[600px]"
        allowFullScreen={true}
        loading="lazy"
        src="https://human.biodigital.com/viewer/?id=79yd&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=MbTVo&paid=o_13b18c13"
        onLoad={() => setIsLoading(false)}
      />

      {/* Interactive HUD Overlays */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 flex items-end justify-between pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-[280px] p-5 rounded-3xl glass-warm border border-border/50 shadow-xl pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider">System Integrity</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Real-time synchronization with current biomarker data. Organ transparency adjusted for clinical focus.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3 pointer-events-auto"
        >
          <div className="flex flex-col gap-2 p-1 rounded-2xl glass-warm border border-border/50">
             {[
               { icon: Activity, label: "Cardiac" },
               { icon: Zap, label: "Neurological" },
             ].map((item, i) => (
               <button key={i} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary/10 transition-all text-left">
                 <item.icon className="w-3.5 h-3.5 text-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
               </button>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative Scan Line */}
      {!isLoading && <div className="scan-line pointer-events-none opacity-20" />}
    </div>
  )
}
