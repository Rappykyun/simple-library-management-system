"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReturnBookButton({
  borrowingId,
  bookId,
  isOverdue,
}: {
  borrowingId: number;
  bookId: number;
  isOverdue: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReturn = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/borrowings/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowingId, bookId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to process return");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReturn}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:bg-green-300 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "Mark as Returned"}
    </button>
  );
}

