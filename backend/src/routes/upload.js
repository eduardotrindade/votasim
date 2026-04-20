import express from 'express';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.use(authMiddleware);

const uploadDir = join(__dirname, '../../uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

router.post('/upload/foto', (req, res) => {
  const { foto, tipo } = req.body;
  
  if (!foto) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }
  
  try {
    const buffer = Buffer.from(foto.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const extensao = foto.match(/^data:image\/(\w+);base64,/)?.[1] || 'jpg';
    const nomeArquivo = `${tipo || 'foto'}_${Date.now()}.${extensao}`;
    const caminho = join(uploadDir, nomeArquivo);
    
    writeFileSync(caminho, buffer);
    
    res.json({ 
      url: `/uploads/${nomeArquivo}`,
      message: 'Foto salva com sucesso' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;