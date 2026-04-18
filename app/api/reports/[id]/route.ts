import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const report = await db.labReport.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        tests: {
          orderBy: { testName: "asc" },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("[report] Failed to fetch report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 },
    );
  }
}
