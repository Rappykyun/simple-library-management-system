import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { books } from "@/db/schema";
import { AddBookForm } from "@/components/AddBookForm";

export default async function ManageBooksPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "librarian") {
    redirect("/dashboard");
  }

  const allBooks = await db.select().from(books);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
          <p className="text-gray-600 mt-2">
            Add and manage library collection
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Book
            </h2>
            <AddBookForm />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              All Books ({allBooks.length})
            </h2>
            <div className="grid gap-4">
              {allBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mt-1">by {book.author}</p>
                      {book.isbn && (
                        <p className="text-gray-500 text-sm mt-1">
                          ISBN: {book.isbn}
                        </p>
                      )}
                      {book.category && (
                        <p className="text-gray-500 text-sm">
                          Category: {book.category}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          book.availableCopies! > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.availableCopies! > 0 ? "Available" : "All Borrowed"}
                      </span>
                      <p className="text-sm text-gray-600 mt-2">
                        {book.availableCopies}/{book.totalCopies} copies
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

