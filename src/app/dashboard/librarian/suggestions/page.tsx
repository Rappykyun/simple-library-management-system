import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { suggestions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SuggestionActionButtons } from "@/components/SuggestionActionButtons";

export default async function ManageSuggestionsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "librarian") {
    redirect("/dashboard");
  }

  const allSuggestions = await db
    .select({
      id: suggestions.id,
      title: suggestions.title,
      author: suggestions.author,
      reason: suggestions.reason,
      status: suggestions.status,
      createdAt: suggestions.createdAt,
      studentName: users.name,
      studentEmail: users.email,
    })
    .from(suggestions)
    .leftJoin(users, eq(suggestions.userId, users.id));

  const pendingSuggestions = allSuggestions.filter(
    (s) => s.status === "pending"
  );

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Suggestions
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage book suggestions from students
          </p>
        </div>

        {pendingSuggestions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-medium">
              📋 {pendingSuggestions.length} pending{" "}
              {pendingSuggestions.length === 1 ? "suggestion" : "suggestions"}
            </p>
          </div>
        )}

        {allSuggestions.length === 0 ? (
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">
              No suggestions yet
            </h2>
            <p className="text-gray-500 mt-2">
              Students haven't suggested any books
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {suggestion.title}
                    </h3>
                    {suggestion.author && (
                      <p className="text-gray-600 mt-1">
                        by {suggestion.author}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      suggestion.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : suggestion.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {suggestion.status}
                  </span>
                </div>

                {suggestion.reason && (
                  <p className="text-gray-600 mb-3">{suggestion.reason}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm text-gray-500">
                    <p className="font-medium">Suggested by:</p>
                    <p>
                      {suggestion.studentName} ({suggestion.studentEmail})
                    </p>
                    <p className="text-xs mt-1">
                      {new Date(suggestion.createdAt!).toLocaleDateString()}
                    </p>
                  </div>

                  {suggestion.status === "pending" && (
                    <SuggestionActionButtons suggestionId={suggestion.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

