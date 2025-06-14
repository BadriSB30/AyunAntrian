'use client';

import React, { useRef } from 'react';
import { FiTrash, FiEdit } from 'react-icons/fi';

const AntrianMobile = ({ data, onDelete, onEdit }) => {
  const containerRef = useRef(null);

  const slide = (direction) => {
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: direction * width, behavior: 'smooth' });
  };

  return (
    <div className="sm:hidden relative overflow-hidden">
      {/* Tombol navigasi kiri/kanan */}
      <div className="pointer-events-none absolute inset-0 flex justify-between items-center px-1 z-10">
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

      {/* Slide cards */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full"
      >
        {data.map((item) => (
          <div
            key={item.id}
            className="w-full flex-shrink-0 snap-center"
          >
            <div className="border rounded-lg shadow-sm p-4 text-sm bg-white mx-2">
              <div className="pl-2">
                <p><strong>Nomor Antrian:</strong> {item.nomor}</p>
                <p><strong>Ruangan:</strong> {item.ruangan}</p>
                <p><strong>Waktu:</strong> {item.waktu}</p>
              </div>
              <div className="mt-3 flex justify-end gap-3">
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Hapus"
                >
                  <FiTrash />
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <FiEdit />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AntrianMobile;
