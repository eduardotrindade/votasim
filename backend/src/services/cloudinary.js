import { v2 as cloudinary } from 'cloudinary';
import { readFileSync } from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
});

export async function uploadImage(base64Image, folder = 'votasim') {
  try {
    if (!base64Image || !base64Image.startsWith('data:image')) {
      return { url: base64Image };
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(base64Image, {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Erro ao fazer upload:', error.message);
    return { url: base64Image, error: error.message };
  }
}

export async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar:', error.message);
    return { success: false, error: error.message };
  }
}

export default { uploadImage, deleteImage };