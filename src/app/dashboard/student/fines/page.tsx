import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { fines, borrowings, books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PayFineButton } from "@/components/PayFineButton";

export default async function FinesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    redirect("/dashboard");
  }

  const userFines = await db
    .select({
      fineId: fines.id,
      amount: fines.amount,
      status: fines.status,
      createdAt: fines.createdAt,
      paidAt: fines.paidAt,
      bookTitle: books.title,
    })
    .from(fines)
    .leftJoin(borrowings, eq(fines.borrowingId, borrowings.id))
    .leftJoin(books, eq(borrowings.bookId, books.id))
    .where(eq(fines.userId, parseInt(session.user.id)));

  const unpaidFines = userFines.filter((fine) => fine.status === "unpaid");
  const totalUnpaid = unpaidFines.reduce((sum, fine) => sum + fine.amount!, 0);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Fines</h1>
          <p className="text-gray-600 mt-2">View and pay your library fines</p>
        </div>

        {unpaidFines.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Total Unpaid Fines
                </h3>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  ${(totalUnpaid / 100).toFixed(2)}
                </p>
              </div>
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {userFines.length === 0 ? (
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
            <h2 className="text-xl font-semibold text-gray-700">No fines</h2>
            <p className="text-gray-500 mt-2">
              You don't have any fines. Keep it up!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {userFines.map((fine) => (
              <div
                key={fine.fineId}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {fine.bookTitle}
                    </h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                      ${(fine.amount! / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Issued on:{" "}
                      {new Date(fine.createdAt!).toLocaleDateString()}
                    </p>
                    {fine.paidAt && (
                      <p className="text-sm text-green-600 mt-1">
                        Paid on: {new Date(fine.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        fine.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {fine.status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                    {fine.status === "unpaid" && (
                      <PayFineButton fineId={fine.fineId!} />
                    )}
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

