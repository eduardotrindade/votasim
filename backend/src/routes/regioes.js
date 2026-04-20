import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

router.get('/ufs', async (req, res) => {
  try {
    const result = await query('SELECT * FROM uf ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cidades', async (req, res) => {
  const { uf_id } = req.query;
  
  try {
    let sql = 'SELECT * FROM cidade ORDER BY nome';
    const params = [];
    if (uf_id) {
      sql = 'SELECT * FROM cidade WHERE uf_id = $1 ORDER BY nome';
      params.push(uf_id);
    }
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cidades/:ufId', async (req, res) => {
  const { ufId } = req.params;
  
  try {
    const result = await query('SELECT * FROM cidade WHERE uf_id = $1 ORDER BY nome', [ufId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { cidade_id } = req.query;
  
  try {
    let sql = `
      SELECT r.*, c.nome as cidade_nome, u.sigla as uf_sigla
      FROM regiao r
      LEFT JOIN cidade c ON r.cidade_id = c.id
      LEFT JOIN uf u ON c.uf_id = u.id
      ORDER BY r.nome
    `;
    const params = [];
    if (cidade_id) {
      sql = `SELECT r.*, c.nome as cidade_nome, u.sigla as uf_sigla
        FROM regiao r
        LEFT JOIN cidade c ON r.cidade_id = c.id
        LEFT JOIN uf u ON c.uf_id = u.id
        WHERE r.cidade_id = $1
        ORDER BY r.nome`;
      params.push(cidade_id);
    }
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { nome, cidade_id } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  try {
    const result = await query('INSERT INTO regiao (nome, cidade_id) VALUES ($1, $2) RETURNING id', [nome, cidade_id]);
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;