import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, '../../uploads');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

let cloudinary = null;
let useCloud = false;

try {
  const { uploadImage: cloudUpload } = await import('./cloudinary.js');
  cloudinary = cloudUpload;
  useCloud = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';
} catch {
  useCloud = false;
}

export async function uploadFoto(fotoBase64, tipo = 'foto', latitude, longitude) {
  if (useCloud && cloudinary) {
    try {
      const result = await cloudinary.uploadImage(fotoBase64, `votasim/${tipo}`);
      return {
        url: result.url,
        latitude,
        longitude
      };
    } catch (err) {
      console.error('Cloudinary erro, usando local:', err.message);
    }
  }

  if (!fotoBase64 || !fotoBase64.startsWith('data:image')) {
    return { url: fotoBase64, latitude, longitude };
  }

  try {
    const buffer = Buffer.from(fotoBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const extensao = fotoBase64.match(/^data:image\/(\w+);base64,/)?.[1] || 'jpg';
    const nomeArquivo = `${tipo}_${Date.now()}.${extensao}`;
    const caminho = join(uploadDir, nomeArquivo);
    
    writeFileSync(caminho, buffer);
    
    return {
      url: `/uploads/${nomeArquivo}`,
      latitude,
      longitude
    };
  } catch (err) {
    console.error('Erro ao salvar foto:', err.message);
    return { url: fotoBase64, latitude, longitude };
  }
}

export default { uploadFoto };