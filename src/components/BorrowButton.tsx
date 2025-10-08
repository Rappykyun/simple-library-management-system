"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BorrowButton({
  bookId,
  userId,
}: {
  bookId: number;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBorrow = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/borrowings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, userId: parseInt(userId) }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to borrow book");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBorrow}
      disabled={loading}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-green-300 disabled:cursor-not-allowed"
    >
      {loading ? "Borrowing..." : "Borrow"}
    </button>
  );
}

