import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { books } from "@/db/schema";
import { BorrowButton } from "@/components/BorrowButton";
import { ReserveButton } from "@/components/ReserveButton";

export default async function BrowseBooksPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    redirect("/dashboard");
  }

  const allBooks = await db.select().from(books);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Browse Books</h1>
          <p className="text-gray-600 mt-2">
            Explore our collection and borrow books
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    book.availableCopies! > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.availableCopies! > 0 ? "Available" : "Out of Stock"}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
              
              {book.isbn && (
                <p className="text-gray-500 text-xs mb-2">ISBN: {book.isbn}</p>
              )}
              
              {book.category && (
                <p className="text-gray-500 text-xs mb-4">
                  Category: {book.category}
                </p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">
                  Available: {book.availableCopies}/{book.totalCopies}
                </span>
              </div>

              <div className="flex gap-2">
                {book.availableCopies! > 0 ? (
                  <BorrowButton bookId={book.id} userId={session.user.id} />
                ) : (
                  <ReserveButton bookId={book.id} userId={session.user.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

