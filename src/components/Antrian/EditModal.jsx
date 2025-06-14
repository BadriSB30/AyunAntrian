'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EditModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    nomor: '',
    ruangan: '',
    waktu: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id ?? '',
        nomor: item.nomor ?? '',
        ruangan: item.ruangan ?? '',
        waktu: item.waktu ?? '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const { id, nomor, ruangan, waktu } = formData;

    if (!id || !nomor || !ruangan || !waktu) {
      alert('Harap isi semua data dengan benar.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/antrian/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nomor, ruangan, waktu }),
      });

      const result = await res.json();

      if (res.ok) {
        onSave?.(); // refresh data parent jika ada
        onClose?.();
      } else {
        alert(result.message || 'Gagal mengupdate data');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto p-4 sm:p-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">Edit Antrian</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <input
            type="text"
            name="nomor"
            placeholder="Nomor Antrian"
            value={formData.nomor}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="ruangan"
            placeholder="Ruangan"
            value={formData.ruangan}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="datetime-local"
            name="waktu"
            value={formData.waktu}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${
                isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSaving}
            >
              {isSaving && (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                />
              )}
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditModal;
