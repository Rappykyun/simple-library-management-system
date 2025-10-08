import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { fines } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { fineId } = data;

  try {
    const now = new Date();

    await db
      .update(fines)
      .set({
        status: "paid",
        paidAt: now.toISOString(),
      })
      .where(eq(fines.id, fineId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to pay fine" }, { status: 500 });
  }
}

