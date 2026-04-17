import { NextResponse } from "next/server"

export async function GET() {
  // Default health summary based on common blood test results
  // In a real app, this would be fetched from a database after processing a report
  const defaultSummary = {
    summary: "Your overall health shows a few areas that need attention. Blood glucose levels are slightly elevated (110 mg/dL), indicating pre-diabetes risk. Vitamin D levels are low (22 ng/mL), which may affect energy and bone health. Cholesterol levels show slightly high LDL, though HDL remains within a healthy range.",
    recommendations: [
      "Limit high-glycemic carbohydrates and added sugars.",
      "Increase Vitamin D intake through fatty fish, egg yolks, or fortified foods.",
      "Choose healthy fats (nuts, avocado, olive oil) over saturated fats.",
      "Regular physical activity is recommended to help manage blood sugar."
    ],
    last_report_date: "2026-04-15",
    status: "Attention Required"
  }

  return NextResponse.json(defaultSummary)
}
