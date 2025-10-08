"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReserveButton({
  bookId,
  userId,
}: {
  bookId: number;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReserve = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, userId: parseInt(userId) }),
      });

      if (response.ok) {
        alert("Book reserved successfully!");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to reserve book");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReserve}
      disabled={loading}
      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-yellow-300 disabled:cursor-not-allowed"
    >
      {loading ? "Reserving..." : "Reserve"}
    </button>
  );
}

