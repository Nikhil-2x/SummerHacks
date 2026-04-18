"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Vapi from "@vapi-ai/web";
import { Phone, PhoneOff, Mic, MicOff, Activity, ShieldCheck, Info } from "lucide-react";

export default function VoiceDoctor() {
    const [vapi, setVapi] = useState<any>(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [status, setStatus] = useState("Ready to assist");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);

        // Events
        vapiInstance.on("call-start", () => {
            setIsCallActive(true);
            setStatus("Connected to AI Doctor");
        });

        vapiInstance.on("call-end", () => {
            setIsCallActive(false);
            setIsListening(false);
            setStatus("Call ended");
            setTimeout(() => setStatus("Ready to assist"), 3000);
        });

        vapiInstance.on("speech-start", () => {
            setIsListening(true);
            setStatus("Listening...");
        });

        vapiInstance.on("speech-end", () => {
            setIsListening(false);
            setStatus("Thinking...");
        });

        vapiInstance.on("message", (msg) => {
            console.log("AI Message:", msg);
        });

        vapiInstance.on("error", (e) => {
            console.error("Vapi Error:", e);
            setStatus("System error");
        });

        setVapi(vapiInstance);

        return () => {
            vapiInstance.stop();
        };
    }, []);

    const toggleCall = useCallback(() => {
        if (!vapi) return;

        if (isCallActive) {
            vapi.stop();
        } else {
            setStatus("Initiating secure call...");
            vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
        }
    }, [vapi, isCallActive]);

    return (
        <motion.div
            layout
            className="w-full max-w-md mx-auto card-warm p-8 rounded-[2rem] relative overflow-hidden glass-warm border-primary/10"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
                {/* Header Section */}
                <div className="flex items-center gap-3 mb-10 w-full justify-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-serif font-medium leading-none">AI Medical Assistant</h2>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Direct Consultation</p>
                    </div>
                </div>

                {/* AI Orb / Visualizer */}
                <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
                    {/* Pulsating background layers */}
                    <AnimatePresence>
                        {isCallActive && (
                            <>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ 
                                        scale: isListening ? [1, 1.2, 1] : 1.1, 
                                        opacity: 0.2 
                                    }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-primary rounded-full blur-2xl"
                                />
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ 
                                        scale: isListening ? [1.1, 1.3, 1.1] : 1.2, 
                                        opacity: 0.1 
                                    }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                    className="absolute inset-0 bg-accent rounded-full blur-3xl"
                                />
                            </>
                        )}
                    </AnimatePresence>

                    {/* The Core Orb */}
                    <motion.div
                        animate={{
                            y: isCallActive ? [0, -8, 0] : 0,
                            scale: isCallActive ? 1.05 : 1
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={`w-32 h-32 rounded-full flex items-center justify-center relative transition-all duration-500 shadow-2xl ${
                            isCallActive 
                            ? 'bg-gradient-to-br from-primary to-accent breathe-glow' 
                            : 'bg-secondary border border-border/50'
                        }`}
                    >
                        {isCallActive ? (
                            <Activity className={`w-12 h-12 text-primary-foreground ${isListening ? 'animate-pulse' : ''}`} />
                        ) : (
                            <MicOff className="w-10 h-10 text-muted-foreground" />
                        )}

                        {/* Status Ring */}
                        <div className={`absolute -inset-2 rounded-full border-2 border-dashed transition-all duration-1000 ${
                            isCallActive ? 'border-primary/30 animate-spin-slow' : 'border-border/20'
                        }`} />
                    </motion.div>
                </div>

                {/* Status Section */}
                <div className="text-center mb-10">
                    <p className={`text-lg font-serif transition-colors ${isCallActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {status}
                    </p>
                    {isCallActive && (
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-[10px] text-success font-bold uppercase tracking-tighter">Live Session</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleCall}
                        className={`group relative px-10 py-4 rounded-2xl font-medium transition-all flex items-center gap-3 overflow-hidden ${
                            isCallActive 
                            ? 'bg-danger text-danger-foreground glow-danger' 
                            : 'bg-primary text-primary-foreground shadow-lg glow-primary'
                        }`}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isCallActive ? (
                                <>
                                    <PhoneOff className="w-5 h-5" />
                                    End Consultation
                                </>
                            ) : (
                                <>
                                    <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Start AI Call
                                </>
                            )}
                        </span>
                    </motion.button>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center gap-2 text-muted-foreground/50 text-[10px]">
                    <Info className="w-3 h-3" />
                    <span>Secure medical-grade connection</span>
                </div>
            </div>
        </motion.div>
    );
}