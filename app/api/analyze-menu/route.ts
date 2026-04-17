import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey || "")

// Configurable model name
const GEMINI_VISION_MODEL = process.env.GEMINI_VISION_MODEL || "gemini-flash-latest"

const menuAnalysisPromptBase = `
You are a health-conscious nutrition assistant. Analyze the restaurant menu from the image and provide personalized food recommendations based on the patient's health summary provided below.

HEALTH SUMMARY:
{{HEALTH_SUMMARY}}

TASK:
1. Identify key dishes/items from the menu.
2. For each relevant item, categorize it as "Recommend", "Avoid", or "Neutral".
3. Provide a brief "Why" based on the health summary (e.g., "High in sugar", "Good source of Vitamin D", "Heart-healthy fats").

Return the results in this exact JSON format:
{
  "recommendations": [
    {
      "dish_name": "Grilled Salmon",
      "category": "Recommend",
      "reason": "Excellent source of Vitamin D and healthy omega-3 fats which are beneficial for your heart health."
    },
    {
      "dish_name": "Pasta Carbonara",
      "category": "Avoid",
      "reason": "High in saturated fats and refined carbohydrates, which may further elevate your glucose levels."
    }
  ],
  "overall_advice": "Focus on lean proteins and fiber-rich vegetables. Avoid sugary drinks and creamy sauces."
}

Return ONLY valid JSON, no markdown or explanation.
`

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured." },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const customSummary = formData.get("summary") as string // Optional summary from client

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    // Get health summary (use custom or default)
    let summaryText = customSummary
    if (!summaryText) {
      // In a real app, we'd fetch this from the database or the other API route
      // Here we use the same default as in /api/patient/insight
      summaryText = "Patient has slightly elevated blood glucose (110 mg/dL) and low Vitamin D (22 ng/mL). LDL cholesterol is slightly high."
    }

    const visionModel = genAI.getGenerativeModel({ model: GEMINI_VISION_MODEL })
    const prompt = menuAnalysisPromptBase.replace("{{HEALTH_SUMMARY}}", summaryText)

    const result = await visionModel.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      },
    ])

    const responseText = result.response.text()
    
    // Extract JSON
    let jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
       const codeBlockMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
       if (codeBlockMatch) {
         jsonMatch = [codeBlockMatch[1]]
       }
    }

    if (!jsonMatch) {
      throw new Error("Could not parse recommendations from AI response.")
    }

    const data = JSON.parse(jsonMatch[0])
    return NextResponse.json(data)

  } catch (error) {
    console.error("[analyze-menu] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze menu" },
      { status: 500 }
    )
  }
}
