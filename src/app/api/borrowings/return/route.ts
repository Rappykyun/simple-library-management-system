import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { borrowings, books, fines } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { borrowingId, bookId } = data;

  try {
    // Get borrowing details
    const [borrowing] = await db
      .select()
      .from(borrowings)
      .where(eq(borrowings.id, borrowingId))
      .limit(1);

    if (!borrowing) {
      return NextResponse.json(
        { error: "Borrowing not found" },
        { status: 404 }
      );
    }

    // Check if overdue and create fine
    const now = new Date();
    const dueDate = new Date(borrowing.dueDate);
    if (now > dueDate) {
      const daysOverdue = Math.ceil(
        (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const fineAmount = daysOverdue * 100; // $1 per day in cents

      await db.insert(fines).values({
        userId: borrowing.userId,
        borrowingId: borrowing.id,
        amount: fineAmount,
        status: "unpaid",
      });
    }

    // Update borrowing status
    await db
      .update(borrowings)
      .set({
        status: "returned",
        returnDate: now.toISOString(),
      })
      .where(eq(borrowings.id, borrowingId));

    // Update available copies
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (book) {
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies! + 1 })
        .where(eq(books.id, bookId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process return" },
      { status: 500 }
    );
  }
}

