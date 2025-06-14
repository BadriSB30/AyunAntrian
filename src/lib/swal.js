'use client'; // Diperlukan karena Swal hanya berjalan di sisi klien

import Swal from 'sweetalert2';

/**
 * Menampilkan notifikasi sukses.
 * @param {string} message - Pesan utama.
 * @param {string} title - Judul dialog.
 */
export const showSuccess = (message = 'Berhasil!', title = 'Sukses') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonText: 'Oke',
  });
};

/**
 * Menampilkan notifikasi gagal.
 * @param {string} message - Pesan utama.
 * @param {string} title - Judul dialog.
 */
export const showError = (message = 'Terjadi kesalahan.', title = 'Gagal') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'Tutup',
  });
};

/**
 * Menampilkan konfirmasi penghapusan data.
 * Bisa dikustomisasi dengan opsi tambahan.
 * @param {Object} options - Opsi swal tambahan.
 * @returns {Promise<boolean>} - True jika dikonfirmasi.
 */
export const confirmDelete = async (options = {}) => {
  const result = await Swal.fire({
    title: 'Hapus Data?',
    text: 'Data yang dihapus tidak dapat dikembalikan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    ...options,
  });

  return result.isConfirmed;
};

/**
 * Menampilkan konfirmasi pengubahan data.
 * Bisa dikustomisasi dengan opsi tambahan.
 * @param {Object} options - Opsi swal tambahan.
 * @returns {Promise<boolean>} - True jika dikonfirmasi.
 */
export const confirmEdit = async (options = {}) => {
  const result = await Swal.fire({
    title: 'Ubah Data?',
    text: 'Apakah kamu yakin ingin mengubah data ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, ubah',
    cancelButtonText: 'Batal',
    ...options,
  });

  return result.isConfirmed;
};
