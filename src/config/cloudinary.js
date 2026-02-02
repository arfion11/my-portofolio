// Konfigurasi Cloudinary dari Environment Variables
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

/**
 * Upload gambar ke Cloudinary
 * @param {File} file - File gambar yang akan diupload
 * @returns {Promise<string>} - URL gambar yang berhasil diupload
 */
export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("Tidak ada file yang dipilih");
  }

  if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
    console.error("Cloudinary Configuration:", CLOUDINARY_CONFIG);
    throw new Error("Konfigurasi Cloudinary belum lengkap. Cek file .env anda.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Gagal upload gambar");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};