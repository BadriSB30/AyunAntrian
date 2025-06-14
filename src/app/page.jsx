"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handlePrintQueue = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/antrian/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Gagal mencetak antrian");
      }

      const data = await response.json();

      toast.success(`Antrian nomor ${data.nomor} berhasil ditambahkan!`);
    } catch (error) {
      console.error("Error printing queue:", error.message);
      toast.error(error.message || "Terjadi kesalahan saat mencetak antrian.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[20px_1fr_20px] gap-16 items-center justify-items-center p-8 sm:p-20 font-sans">
      <main className="row-start-2 flex flex-col items-center sm:items-start gap-8 w-full max-w-md">
        <button
          onClick={handlePrintQueue}
          disabled={loading}
          className={`w-full h-16 bg-green-600 hover:bg-green-700 text-white text-xl sm:text-2xl font-semibold px-5 rounded-2xl shadow-lg transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Memproses..." : "Cetak Antrian"}
        </button>
      </main>
    </div>
  );
}
