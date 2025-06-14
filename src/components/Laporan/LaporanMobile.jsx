// components/laporan/LaporanMobile.jsx

import React, { useRef } from 'react';

const LaporanMobile = ({ data }) => {
  const containerRef = useRef(null);

  const slide = (direction) => {
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: direction * width, behavior: 'smooth' });
  };

  return (
    <div className="sm:hidden relative overflow-hidden">
      {/* Tombol navigasi */}
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

      {/* Container slide */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full gap-4 px-2"
      >
        {data.map((item, index) => (
          <div
            key={item.id}
            className="w-full flex-shrink-0 snap-center"
          >
            <div className="border rounded-lg shadow-sm p-4 pl-4 text-sm bg-white">
              <p><strong>No:</strong> {index + 1}</p>
              <p><strong>Nomor:</strong> {item.nomor}</p>
              <p><strong>Ruangan:</strong> {item.ruangan}</p>
              <p><strong>Wkatu:</strong> {item.waktu}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaporanMobile;
