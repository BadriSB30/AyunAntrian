"use client";

import { FiVolume2 } from "react-icons/fi"; // Ganti lucide-react dengan react-icons

export default function TombolSuara({ nomor, ruangan }) {
  const handleSpeak = () => {
    const pesan = `Nomor antrian ${nomor}, menuju ruangan ${ruangan}`;
    const utterance = new SpeechSynthesisUtterance(pesan);
    utterance.lang = "id-ID";
    speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition duration-200"
    >
      <FiVolume2 size={18} />
      Panggil
    </button>
  );
}
