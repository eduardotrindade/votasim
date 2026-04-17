const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Listar eventos
router.get('/', auth(), async (req, res) => {
  try {
    const { search, me } = req.query;
    let query = `
      SELECT e.*, r.nome as regiao_nome 
      FROM evento e
      LEFT JOIN regiao r ON e.regiao_id = r.id
      WHERE 1=1
    `;
    let params = [];

    if (search) {
      query += ` AND (e.titulo LIKE ? OR r.nome LIKE ?) `;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (me === 'true') {
      query += ` AND e.usuario_organizador_id = ? `;
      params.push(req.user.id);
    }

    query += ` ORDER BY e.data DESC `;

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// Buscar evento por ID
router.get('/:id', auth(), async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      `SELECT e.*, r.nome as regiao_nome 
       FROM evento e
       LEFT JOIN regiao r ON e.regiao_id = r.id
       WHERE e.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// Criar evento
router.post('/', auth(), async (req, res) => {
  try {
    const { titulo, data, regiao_id, observacao } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO evento (titulo, data, regiao_id, observacao, usuario_organizador_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, data, regiao_id, observacao, req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Evento criado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// Fazer check-in num evento
router.post('/:id/checkin', auth(), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { id } = req.params;

    // Regras de checkin
    await db.execute(
      `UPDATE evento 
       SET check_in = true, latitude = ?, longitude = ?, data_hora_check_in = NOW()
       WHERE id = ?`,
      [latitude, longitude, id]
    );

    res.json({ message: 'Check-in realizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer checkin' });
  }
});

// Convidar pessoas para evento
router.post('/:eventoId/convidar', auth(), async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { pessoaIds } = req.body;

    if (!pessoaIds || !Array.isArray(pessoaIds) || pessoaIds.length === 0) {
      return res.status(400).json({ error: 'Nenhuma pessoa selecionada' });
    }

    for (const pessoaId of pessoaIds) {
      await db.execute(
        `INSERT OR IGNORE INTO evento_pessoas (evento_id, pessoa_id, convidada) VALUES (?, ?, 1)`,
        [eventoId, pessoaId]
      );
    }

    res.json({ message: 'Pessoas convidadas com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao convidar pessoas' });
  }
});

// Listar pessoas convidadas a um evento
router.get('/:eventoId/convidados', auth(), async (req, res) => {
  try {
    const { eventoId } = req.params;

    const [rows] = await db.execute(
      `SELECT ep.*, p.nome, p.telefone, p.email, p.foto
       FROM evento_pessoas ep
       LEFT JOIN pessoa p ON ep.pessoa_id = p.id
       WHERE ep.evento_id = ?`,
      [eventoId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar convidados' });
  }
});

// Marcar presença de pessoa no evento
router.put('/:eventoId/presenca/:pessoaId', auth(), async (req, res) => {
  try {
    const { eventoId, pessoaId } = req.params;
    const { presente } = req.body;

    await db.execute(
      `UPDATE evento_pessoas SET presente = ? WHERE evento_id = ? AND pessoa_id = ?`,
      [presente ? 1 : 0, eventoId, pessoaId]
    );

    res.json({ message: 'Presença atualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar presença' });
  }
});

// Remover convidado do evento
router.delete('/:eventoId/convidados/:pessoaId', auth(), async (req, res) => {
  try {
    const { eventoId, pessoaId } = req.params;

    await db.execute(
      `DELETE FROM evento_pessoas WHERE evento_id = ? AND pessoa_id = ?`,
      [eventoId, pessoaId]
    );

    res.json({ message: 'Convidado removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover convidado' });
  }
});

// Listar todas as pessoas para invitar (ativas)
router.get('/:eventoId/pessoas-disponiveis', auth(), async (req, res) => {
  try {
    const { eventoId } = req.params;

    const [rows] = await db.execute(
      `SELECT id, nome, telefone, email, foto, agrupamento_id
       FROM pessoa 
       WHERE ativo = 1 AND id NOT IN (
         SELECT pessoa_id FROM evento_pessoas WHERE evento_id = ?
       )`,
      [eventoId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
});

// Check-in de pessoa no evento (presença automática)
router.post('/:eventoId/checkin-pessoa/:pessoaId', auth(), async (req, res) => {
  try {
    const { eventoId, pessoaId } = req.params;
    const { latitude, longitude } = req.body;

    // Marcar presença + localização
    await db.execute(
      `UPDATE evento_pessoas 
       SET presente = 1, latitude = ?, longitude = ?, data_hora_check_in = NOW()
       WHERE evento_id = ? AND pessoa_id = ?`,
      [latitude || null, longitude || null, eventoId, pessoaId]
    );

    res.json({ message: 'Check-in realizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer check-in' });
  }
});

// Upload de foto do evento
router.post('/:eventoId/fotos', auth(), async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { foto, localizacao_foto } = req.body;

    if (!foto) {
      return res.status(400).json({ error: 'Foto não fornecida' });
    }

    const [result] = await db.execute(
      `INSERT INTO evento_fotos (evento_id, foto, localizacao_foto) VALUES (?, ?, ?)`,
      [eventoId, foto, localizacao_foto || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Foto adicionada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar foto' });
  }
});

// Upload de foto por arquivo
router.post('/:eventoId/fotos/upload', auth(), upload.single('foto'), async (req, res) => {
  try {
    const { eventoId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não fornecido' });
    }

    const fotoUrl = `/uploads/${req.file.filename}`;
    
    const [result] = await db.execute(
      `INSERT INTO evento_fotos (evento_id, foto) VALUES (?, ?)`,
      [eventoId, fotoUrl]
    );

    res.status(201).json({ id: result.insertId, message: 'Foto adicionada', foto: fotoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
});

// Listar fotos de um evento
router.get('/:eventoId/fotos', auth(), async (req, res) => {
  try {
    const { eventoId } = req.params;

    const [rows] = await db.execute(
      `SELECT * FROM evento_fotos WHERE evento_id = ? ORDER BY cadastrado_em DESC`,
      [eventoId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar fotos' });
  }
});

// Deletar foto do evento
router.delete('/fotos/:fotoId', auth(), async (req, res) => {
  try {
    const { fotoId } = req.params;

    await db.execute(`DELETE FROM evento_fotos WHERE id = ?`, [fotoId]);

    res.json({ message: 'Foto removida' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover foto' });
  }
});

// Estatísticas do evento (presenças)
router.get('/:eventoId/estatisticas', auth(), async (req, res) => {
  try {
    const { eventoId } = req.params;

    const [total] = await db.execute(
      `SELECT COUNT(*) as total FROM evento_pessoas WHERE evento_id = ?`,
      [eventoId]
    );

    const [presentes] = await db.execute(
      `SELECT COUNT(*) as presentes FROM evento_pessoas WHERE evento_id = ? AND presente = 1`,
      [eventoId]
    );

    const [convidados] = await db.execute(
      `SELECT COUNT(*) as convidados FROM evento_pessoas WHERE evento_id = ? AND convidada = 1`,
      [eventoId]
    );

    res.json({
      total: total[0].total,
      presentes: presentes[0].presentes,
      confirmados: convidados[0].convidados,
      ausentes: total[0].total - presentes[0].presentes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;