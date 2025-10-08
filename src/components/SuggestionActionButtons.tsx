"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SuggestionActionButtons({
  suggestionId,
}: {
  suggestionId: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: "approved" | "rejected") => {
    setLoading(true);
    try {
      const response = await fetch("/api/suggestions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId, status: action }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to update suggestion");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("approved")}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-green-300 disabled:cursor-not-allowed"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("rejected")}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-red-300 disabled:cursor-not-allowed"
      >
        Reject
      </button>
    </div>
  );
}

