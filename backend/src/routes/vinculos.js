import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { tipo } = req.query;
  
  try {
    let sql = `
      SELECT v.*, 
             p1.nome as pessoa_nome, 
             p2.nome as pessoa_relacionada_nome
      FROM vinculo v
      LEFT JOIN pessoa p1 ON v.pessoa_id = p1.id
      LEFT JOIN pessoa p2 ON v.pessoa_relacionada_id = p2.id
      WHERE v.ativo = true
    `;
    const params = [];
    
    if (tipo) {
      sql += ' AND v.tipo = $1';
      params.push(tipo);
    }
    
    sql += ' ORDER BY v.created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { pessoa_id, pessoa_relacionada_id, tipo } = req.body;
  
  if (!pessoa_id || !pessoa_relacionada_id || !tipo) {
    return res.status(400).json({ error: 'pessoa_id, pessoa_relacionada_id e tipo são obrigatórios' });
  }
  
  try {
    const result = await query(`
      INSERT INTO vinculo (pessoa_id, pessoa_relacionada_id, tipo)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [pessoa_id, pessoa_relacionada_id, tipo]);
    
    res.json({ id: result.rows[0].id, message: 'Vínculo criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tipo, ativo } = req.body;
  
  try {
    if (tipo) {
      await query('UPDATE vinculo SET tipo = $1 WHERE id = $2', [tipo, id]);
    }
    if (ativo !== undefined) {
      await query('UPDATE vinculo SET ativo = $1 WHERE id = $2', [ativo, id]);
    }
    res.json({ message: 'Vínculo atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await query('UPDATE vinculo SET ativo = false WHERE id = $1', [id]);
    res.json({ message: 'Vínculo desativado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;