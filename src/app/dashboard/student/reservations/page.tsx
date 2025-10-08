import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { reservations, books } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function ReservationsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    redirect("/dashboard");
  }

  const userReservations = await db
    .select({
      id: reservations.id,
      bookTitle: books.title,
      bookAuthor: books.author,
      reservationDate: reservations.reservationDate,
      status: reservations.status,
    })
    .from(reservations)
    .leftJoin(books, eq(reservations.bookId, books.id))
    .where(eq(reservations.userId, parseInt(session.user.id)));

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Reservations</h1>
          <p className="text-gray-600 mt-2">Track your book reservations</p>
        </div>

        {userReservations.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">
              No reservations
            </h2>
            <p className="text-gray-500 mt-2">
              Reserve books when they're not available
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {userReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {reservation.bookTitle}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      by {reservation.bookAuthor}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      reservation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : reservation.status === "fulfilled"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">Reserved on:</span>{" "}
                  {new Date(
                    reservation.reservationDate!
                  ).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

