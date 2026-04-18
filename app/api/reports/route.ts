import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitRaw = request.nextUrl.searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitRaw || "2") || 2, 1), 10);

    const reports = await db.labReport.findMany({
      where: { userId: session.user.id },
      include: {
        tests: {
          orderBy: { testName: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("[reports] Failed to fetch reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}
