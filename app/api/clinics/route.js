import { NextResponse } from "next/server";

// 🧠 map disease → search keyword
const diseaseMap = {
  diabetes: "diabetes clinic",
  heart: "cardiologist",
  skin: "dermatologist",
  eye: "ophthalmologist",
  dental: "dentist",
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const disease = searchParams.get("disease") || "general";

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and Longitude required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.TOMTOM_API_KEY;

    // 🧠 convert disease → search query
    const searchQuery =
      diseaseMap[disease.toLowerCase()] || "clinic";

    // 🔥 use TEXT SEARCH instead of nearbySearch
    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
      searchQuery
    )}.json?key=${apiKey}&lat=${lat}&lon=${lng}&limit=10`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("TomTom Response:", data);

    if (!data.results) {
      return NextResponse.json(
        { error: "API failed", details: data },
        { status: 500 }
      );
    }

    const clinics = data.results.map((place) => {
      const clinicLat = place.position.lat;
      const clinicLng = place.position.lon;

      return {
        name: place.poi?.name || "Unknown",
        address: place.address?.freeformAddress || "No address",
        latitude: clinicLat,
        longitude: clinicLng,

        // 🔥 Hackathon enhancements
        rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
        insight: `Best for ${disease} care`,
      };
    });

    return NextResponse.json({ clinics });

  } catch (err) {
    console.error("ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}