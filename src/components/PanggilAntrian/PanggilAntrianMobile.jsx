'use client';

import React, { useRef } from 'react';
import TombolSuara from './Panggil';

const PanggilAntrianMobile = ({ data = [] }) => {
  const containerRef = useRef(null);

  const slide = (direction) => {
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: direction * width, behavior: 'smooth' });
  };

  return (
    <div className="sm:hidden relative overflow-hidden">
      {/* Navigasi scroll kiri/kanan */}
      <div className="pointer-events-none absolute inset-0 flex justify-between items-center px-2 z-10">
        <button
          onClick={() => slide(-1)}
          className="pointer-events-auto bg-white shadow rounded-full p-1"
        >
          ◀
        </button>
        <button
          onClick={() => slide(1)}
          className="pointer-events-auto bg-white shadow rounded-full p-1"
        >
          ▶
        </button>
      </div>

      {/* Card Antrian */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full"
      >
        {data.map((item) => (
          <div
            key={item.id}
            className="w-full flex-shrink-0 snap-center px-3 py-4"
          >
            <div className="border rounded-lg shadow p-4 bg-white text-sm">
              <div className="mb-2">
                <p><strong>Nomor:</strong> {item.nomor}</p>
                <p><strong>Ruangan:</strong> {item.ruangan}</p>
                <p><strong>Waktu:</strong> {item.waktu}</p>
              </div>
              <div className="mt-3 flex justify-center">
                <TombolSuara nomor={item.nomor} ruangan={item.ruangan} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanggilAntrianMobile;
