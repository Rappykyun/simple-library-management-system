import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { title, author, isbn, category, totalCopies, availableCopies } = data;

  try {
    await db.insert(books).values({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}

