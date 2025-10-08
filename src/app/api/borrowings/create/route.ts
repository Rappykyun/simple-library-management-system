import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { borrowings, books } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { bookId, userId } = data;

  try {
    // Check if book is available
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book || book.availableCopies! <= 0) {
      return NextResponse.json(
        { error: "Book not available" },
        { status: 400 }
      );
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create borrowing record
    await db.insert(borrowings).values({
      userId,
      bookId,
      dueDate: dueDate.toISOString(),
      status: "active",
    });

    // Update available copies
    await db
      .update(books)
      .set({ availableCopies: book.availableCopies! - 1 })
      .where(eq(books.id, bookId));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to borrow book" },
      { status: 500 }
    );
  }
}

