import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.js';
import { uploadFoto } from '../services/fotoService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { search = '', me } = req.query;
  
  let sql = `
    SELECT e.*, regiao.nome as regiao_nome, auth_users.nome as organizador_nome
    FROM evento e
    LEFT JOIN regiao ON e.regiao_id = regiao.id
    LEFT JOIN auth_users ON e.criado_por = auth_users.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ' AND (e.titulo ILIKE $' + (params.length + 1) + ' OR regiao.nome ILIKE $' + (params.length + 2) + ')';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (me === 'true' && req.query.usuario_id) {
    sql += ' AND e.criado_por = $' + (params.length + 1);
    params.push(req.query.usuario_id);
  }

  sql += ' ORDER BY e.data DESC, e.id DESC';

  try {
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await query(`
      SELECT e.*, regiao.nome as regiao_nome
      FROM evento e
      LEFT JOIN regiao ON e.regiao_id = regiao.id
      WHERE e.id = $1
    `, [id]);

    const evento = result.rows[0];
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(evento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { titulo, regiao_id, data, descricao, latitude, longitude, criado_por } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Título é obrigatório' });
  }

  try {
    const result = await query(`
      INSERT INTO evento (titulo, regiao_id, data, descricao, latitude, longitude, criado_por)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [titulo, regiao_id, data, descricao, latitude, longitude, criado_por]);

    res.json({ id: result.rows[0].id, success: true });
  } catch (err) {
    console.error('Erro ao criar evento:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, regiao_id, data, descricao, latitude, longitude } = req.body;

  try {
    await query(`
      UPDATE evento SET 
        titulo = COALESCE($1, titulo),
        regiao_id = COALESCE($2, regiao_id),
        data = COALESCE($3, data),
        descricao = COALESCE($4, descricao),
        latitude = COALESCE($5, latitude),
        longitude = COALESCE($6, longitude)
      WHERE id = $7
    `, [titulo, regiao_id, data, descricao, latitude, longitude, id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await query('DELETE FROM evento WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:eventoId/pessoas', async (req, res) => {
  const { eventoId } = req.params;
  
  try {
    const result = await query(`
      SELECT ep.*, p.nome, p.telefone, p.foto
      FROM evento_pessoas ep
      JOIN pessoa p ON ep.pessoa_id = p.id
      WHERE ep.evento_id = $1
    `, [eventoId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:eventoId/pessoas', async (req, res) => {
  const { eventoId } = req.params;
  const { pessoa_ids } = req.body;
  
  if (!pessoa_ids || !Array.isArray(pessoa_ids)) {
    return res.status(400).json({ error: 'Array pessoa_ids é obrigatório' });
  }

  try {
    for (const pessoaId of pessoa_ids) {
      await query(`
        INSERT INTO evento_pessoas (evento_id, pessoa_id, convidada)
        VALUES ($1, $2, true)
        ON CONFLICT DO NOTHING
      `, [eventoId, pessoaId]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:eventoId/checkin', async (req, res) => {
  const { eventoId } = req.params;
  const { pessoa_id, latitude, longitude, foto_checkin } = req.body;
  
  if (!pessoa_id) {
    return res.status(400).json({ error: 'pessoa_id é obrigatório' });
  }

  try {
    let fotoUrl = foto_checkin;
    if (foto_checkin && foto_checkin.startsWith('data:')) {
      fotoUrl = await uploadFoto(foto_checkin, 'checkin');
    }

    await query(`
      UPDATE evento_pessoas SET 
        presente = true,
        data_checkin = CURRENT_TIMESTAMP,
        latitude = $1,
        longitude = $2,
        foto_checkin = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE evento_id = $4 AND pessoa_id = $5
    `, [latitude, longitude, fotoUrl, eventoId, pessoa_id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;