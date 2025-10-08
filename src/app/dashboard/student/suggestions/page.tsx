import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SuggestionForm } from "@/components/SuggestionForm";

export default async function SuggestionsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    redirect("/dashboard");
  }

  const userSuggestions = await db
    .select()
    .from(suggestions)
    .where(eq(suggestions.userId, parseInt(session.user.id)));

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Book Suggestions</h1>
          <p className="text-gray-600 mt-2">
            Suggest books you'd like to see in our library
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Make a Suggestion
            </h2>
            <SuggestionForm userId={session.user.id} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Suggestions
            </h2>
            {userSuggestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg
                  className="w-12 h-12 text-green-300 mx-auto mb-4"
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
                <p className="text-gray-500">No suggestions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {suggestion.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
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
                    {suggestion.author && (
                      <p className="text-gray-600 text-sm mb-2">
                        by {suggestion.author}
                      </p>
                    )}
                    {suggestion.reason && (
                      <p className="text-gray-500 text-sm mb-2">
                        {suggestion.reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Suggested on{" "}
                      {new Date(suggestion.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

