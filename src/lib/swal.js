'use client'; // Swal harus berjalan di client

// src/lib/swal.js
import Swal from 'sweetalert2';

/** ================================
 *  DEFAULT CONFIG (Theme)
 *  ================================ */
const baseConfig = {
	confirmButtonColor: '#2563eb', // Tailwind blue-600
	cancelButtonColor: '#6b7280', // Tailwind gray-500
	buttonsStyling: true,
};

/** ================================
 *  ALERT: SUCCESS
 *  ================================ */
export const showSuccess = (message = 'Berhasil!', title = 'Sukses') => {
	return Swal.fire({
		title,
		text: message,
		icon: 'success',
		confirmButtonText: 'Oke',
		...baseConfig,
	});
};

/** ================================
 *  ALERT: ERROR
 *  ================================ */
export const showError = (message = 'Terjadi kesalahan.', title = 'Gagal') => {
	return Swal.fire({
		title,
		text: message,
		icon: 'error',
		confirmButtonText: 'Tutup',
		...baseConfig,
	});
};

/** ================================
 *  CONFIRM: HAPUS
 *  ================================ */
export const confirmDelete = async (options = {}) => {
	const result = await Swal.fire({
		title: 'Hapus Data?',
		text: 'Data yang dihapus tidak dapat dikembalikan.',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Ya, hapus!',
		cancelButtonText: 'Batal',
		...baseConfig,
		...options,
	});

	return result.isConfirmed;
};

/** ================================
 *  CONFIRM: EDIT
 *  ================================ */
export const confirmEdit = async (options = {}) => {
	const result = await Swal.fire({
		title: 'Ubah Data?',
		text: 'Apakah kamu yakin ingin mengubah data ini?',
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Ya, ubah',
		cancelButtonText: 'Batal',
		...baseConfig,
		...options,
	});

	return result.isConfirmed;
};
