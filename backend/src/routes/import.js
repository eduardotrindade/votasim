const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require('../config/db');
const auth = require('../middlewares/auth');

const upload = multer({ dest: 'uploads/' });

router.post('/pessoas', auth(), upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv({
      separator: ',', // Pode ser parametrizado futuramente
      mapHeaders: ({ header }) => header.trim().toLowerCase()
    }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        let insertedCount = 0;
        for (const row of results) {
          // Mapeamento basico: nome, email, telefone
          const nome = row.nome || row.name;
          const email = row.email || row.e-mail;
          const telefone = row.telefone || row.phone || row.celular;

          if (nome && email) {
            await db.execute(
              'INSERT INTO pessoa (nome, email, telefone, cadastrado_por_usuario_id) VALUES (?, ?, ?, ?)',
              [nome, email, telefone || null, req.user.id]
            );
            insertedCount++;
          }
        }
        
        // Limpar arquivo temporario
        fs.unlinkSync(req.file.path);
        
        res.json({ message: `Importação concluída: ${insertedCount} pessoas cadastrados.` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao processar dados do CSV' });
      }
    });
});

module.exports = router;