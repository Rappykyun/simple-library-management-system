"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PayFineButton({ fineId }: { fineId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fines/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fineId }),
      });

      if (response.ok) {
        alert("Fine paid successfully!");
        router.refresh();
      } else {
        alert("Failed to pay fine");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:bg-green-300 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}

