"use client";

import { useState } from "react";
import VoiceDoctor from "@/components/VoiceDoctor";

export default function ClinicsPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClinics = () => {
    setLoading(true);

    // 🔥 Replace with your AI output later
    const disease = "heart";

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const res = await fetch(
        `/api/clinics?lat=${lat}&lng=${lng}&disease=${disease}`,
      );

      const data = await res.json();

      setClinics(data.clinics || []);
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Button */}
      <button
        onClick={fetchClinics}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Find Nearby Clinics
      </button>

      {/* Loading */}
      {loading && <p className="mt-4">Loading...</p>}

      {/* Results */}
      <div className="mt-6 grid gap-4">
        {clinics.map((clinic, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">{clinic.name}</h2>

            <p className="text-gray-600">{clinic.address}</p>

            {/* Extra fields */}
            {clinic.rating && (
              <p className="text-yellow-600">⭐ {clinic.rating}</p>
            )}

            {clinic.insight && (
              <p className="text-green-600">{clinic.insight}</p>
            )}

            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`,
                  "_blank",
                )
              }
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Get Directions
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center min-h-screen">
      <VoiceDoctor />
    </div>
    </div>
  );
}
