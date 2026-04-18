"use client"
import { motion } from "framer-motion"

export default function OrganicBlob({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.3, 0.5, 0.3],
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        delay,
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute rounded-full blur-3xl ${className}`}
    />
  )
}
