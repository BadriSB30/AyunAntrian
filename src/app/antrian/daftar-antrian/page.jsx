"use client"

import React, { useEffect, useState } from 'react';
import EditModal from '@/components/antrian/EditModal';
import ScrollInSection from '@/components/Animate/ScroolInSelection';
import AntrianDesktop from '@/components/antrian/AntrianDesktop';
import AntrianMobile from '@/components/antrian/AntrianMobile';
import { confirmDelete, showSuccess, showError } from '@/lib/swal';

const DaftarAntrian = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/antrian/list');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    const confirmed = await confirmDelete({
      title: 'Yakin ingin menghapus data ini?',
      text: 'Tindakan ini tidak bisa dibatalkan!',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      icon: 'warning',
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/antrian/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
        showSuccess('Data berhasil dihapus!');
      } else {
        const err = await res.json();
        showError(err.message);
      }
    } catch (error) {
      console.error('Error saat menghapus data:', error);
      showError('Terjadi kesalahan saat menghapus data.');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setSelectedItem(null);
    setIsEditOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
        <EditModal
          isOpen={isEditOpen}
          onClose={handleCloseEdit}
          item={selectedItem}
          onSave={fetchData}
        />
        <ScrollInSection>
          {loading ? (
            <p className="p-4">Loading data...</p>
          ) : (
            <>
              <AntrianDesktop
                data={data}
                onDelete={deleteItem}
                onEdit={handleEdit}
              />
              <AntrianMobile
                data={data}
                onDelete={deleteItem}
                onEdit={handleEdit}
              />
            </>
          )}
        </ScrollInSection>
    </div>
  );
};

export default DaftarAntrian;
