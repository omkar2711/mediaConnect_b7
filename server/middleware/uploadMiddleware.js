import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

/**
 * Uploads a file to Cloudinary and returns the URL.
 * @param {string} filePath - The local path to the file to upload.
 * @param {string} folder - (Optional) The Cloudinary folder to upload to.
 * @returns {Promise<string>} The URL of the uploaded file.
 */
export async function uploadToCloudinary(filePath, folder = 'mediaConnect') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
}
