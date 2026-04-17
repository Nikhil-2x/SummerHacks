import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const res = await fetch(`https://api.foursquare.com/v3/places/${id}`, {
      headers: {
        Authorization: process.env.FOURSQUARE_API_KEY,
      },
    });

    const data = await res.json();

    return NextResponse.json({
      name: data.name,
      phone: data.tel || "Not available",
      rating: data.rating || "N/A",
    });

  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}