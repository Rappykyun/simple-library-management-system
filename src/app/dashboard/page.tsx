import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { borrowings, books, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  // Student view: Show borrowed books
  if (user.role === "student") {
    const userBorrowings = await db
      .select({
        id: borrowings.id,
        bookTitle: books.title,
        bookAuthor: books.author,
        borrowDate: borrowings.borrowDate,
        dueDate: borrowings.dueDate,
        status: borrowings.status,
      })
      .from(borrowings)
      .leftJoin(books, eq(borrowings.bookId, books.id))
      .where(
        and(
          eq(borrowings.userId, parseInt(user.id)),
          eq(borrowings.status, "active")
        )
      );

    return (
      <div className="min-h-screen bg-green-50">
        <Navbar user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600 mt-2">Your currently borrowed books</p>
          </div>

          {userBorrowings.length === 0 ? (
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700">
                No borrowed books
              </h2>
              <p className="text-gray-500 mt-2">
                Browse our collection to find your next read!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {userBorrowings.map((borrowing) => (
                <div
                  key={borrowing.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {borrowing.bookTitle}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        by {borrowing.bookAuthor}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        borrowing.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {borrowing.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Borrowed:</span>{" "}
                      {new Date(borrowing.borrowDate!).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Due:</span>{" "}
                      {new Date(borrowing.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Librarian view: Show overview statistics
  const totalBooks = await db.select().from(books);
  const activeLoans = await db
    .select()
    .from(borrowings)
    .where(eq(borrowings.status, "active"));
  const totalUsers = await db
    .select()
    .from(users)
    .where(eq(users.role, "student"));

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Librarian Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Library management overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Books</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {totalBooks.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Active Loans
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {activeLoans.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {totalUsers.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

