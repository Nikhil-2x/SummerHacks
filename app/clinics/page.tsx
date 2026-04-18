"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceDoctor from "@/components/VoiceDoctor";
import OrganicBlob from "@/components/organic-blob";
import { MapPin, Star, Navigation, ArrowLeft, Activity, Search, Box } from "lucide-react";

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClinics = () => {
    setLoading(true);
    setError(null);

    // Default search for heart-related care as an example
    const disease = "heart";

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const res = await fetch(
            `/api/clinics?lat=${lat}&lng=${lng}&disease=${disease}`
          );

          if (!res.ok) throw new Error("Failed to fetch clinics");
          
          const data = await res.json();
          setClinics(data.clinics || []);
        } catch (err) {
          setError("Could not find nearby clinics. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Permission to access location was denied.");
        setLoading(false);
      }
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Warm ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <OrganicBlob
          className="w-[600px] h-[600px] -top-48 -right-48 bg-primary/20"
          delay={0}
        />
        <OrganicBlob
          className="w-[500px] h-[500px] -bottom-32 -left-32 bg-accent/15"
          delay={2}
        />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute inset-0 paper-texture" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Analysis</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => window.location.href = "/visualizer"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-warm border border-accent/20 text-accent-foreground hover:bg-accent/10 transition-all text-sm font-medium"
          >
            <Box className="w-4 h-4" />
            <span>3D Human Visualizer</span>
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Clinic Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 leading-tight">
                Nearby <span className="text-gradient-primary">Medical Care</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Find the best specialists and clinics near you based on your health profile.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={fetchClinics}
                disabled={loading}
                className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-medium shadow-lg glow-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Activity className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
                Find Nearby Specialists
              </button>
            </div>

            {error && (
              <p className="text-destructive font-medium">{error}</p>
            )}

            {/* Results */}
            <div className="grid gap-6">
              <AnimatePresence>
                {clinics.map((clinic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group card-warm p-6 rounded-2xl relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-serif font-medium text-foreground group-hover:text-primary transition-colors">
                          {clinic.name}
                        </h2>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <MapPin className="w-3 h-3" />
                          {clinic.address}
                        </div>
                      </div>
                      {clinic.rating && (
                        <div className="flex items-center gap-1 bg-warning/10 text-warning px-2 py-1 rounded-lg text-sm font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {clinic.rating}
                        </div>
                      )}
                    </div>

                    {clinic.insight && (
                      <div className="bg-success/5 text-success text-sm p-3 rounded-xl border border-success/10 mb-4 inline-block">
                        {clinic.insight}
                      </div>
                    )}

                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`,
                          "_blank"
                        )
                      }
                      className="w-full mt-2 py-2 rounded-xl border border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-primary font-medium"
                    >
                      <Navigation className="w-4 h-4" />
                      View Directions
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!loading && clinics.length === 0 && !error && (
                <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl">
                  <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Click the button above to discover local care options.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Voice Doctor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-12"
          >
            <div className="relative">
              {/* Decorative Glow */}
              <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50" />
              
              <VoiceDoctor />
              
              <div className="mt-8 card-warm p-6 rounded-2xl border-primary/10 bg-primary/5">
                <h3 className="font-serif font-medium text-lg mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  AI Consultation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our Voice AI assistant can help you understand your results while we search for specialists. 
                  Start a call to discuss your report in natural language.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
