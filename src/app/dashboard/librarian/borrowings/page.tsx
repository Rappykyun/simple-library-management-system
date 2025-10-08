import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { borrowings, books, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ReturnBookButton } from "@/components/ReturnBookButton";

export default async function ManageBorrowingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "librarian") {
    redirect("/dashboard");
  }

  const activeBorrowings = await db
    .select({
      id: borrowings.id,
      bookTitle: books.title,
      bookId: books.id,
      studentName: users.name,
      studentEmail: users.email,
      borrowDate: borrowings.borrowDate,
      dueDate: borrowings.dueDate,
      status: borrowings.status,
    })
    .from(borrowings)
    .leftJoin(books, eq(borrowings.bookId, books.id))
    .leftJoin(users, eq(borrowings.userId, users.id))
    .where(eq(borrowings.status, "active"));

  // Check for overdue books
  const now = new Date();
  const overdueCount = activeBorrowings.filter(
    (b) => new Date(b.dueDate) < now
  ).length;

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Borrowings</h1>
          <p className="text-gray-600 mt-2">Track and process book returns</p>
        </div>

        {overdueCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">
              ⚠️ {overdueCount} overdue {overdueCount === 1 ? "book" : "books"}
            </p>
          </div>
        )}

        {activeBorrowings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="w-16 h-16 text-green-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">
              No active borrowings
            </h2>
            <p className="text-gray-500 mt-2">All books are in the library</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeBorrowings.map((borrowing) => {
              const isOverdue = new Date(borrowing.dueDate) < now;
              return (
                <div
                  key={borrowing.id}
                  className={`bg-white rounded-lg shadow-md p-6 ${
                    isOverdue ? "border-l-4 border-red-500" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {borrowing.bookTitle}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Borrowed by: {borrowing.studentName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {borrowing.studentEmail}
                      </p>
                      <div className="mt-3 flex gap-6 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Borrowed:
                          </span>{" "}
                          {new Date(borrowing.borrowDate!).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Due:
                          </span>{" "}
                          <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                            {new Date(borrowing.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {isOverdue && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          Overdue
                        </span>
                      )}
                      <ReturnBookButton
                        borrowingId={borrowing.id}
                        bookId={borrowing.bookId!}
                        isOverdue={isOverdue}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

