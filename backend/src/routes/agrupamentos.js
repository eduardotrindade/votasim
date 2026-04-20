import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT a.*, regiao.nome as regiao_nome, auth_users.nome as referencia_nome
      FROM agrupamento a
      LEFT JOIN regiao ON a.regiao_id = regiao.id
      LEFT JOIN auth_users ON a.pessoa_referencia_id = auth_users.id
      ORDER BY a.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await query(`
      SELECT a.*, regiao.nome as regiao_nome
      FROM agrupamento a
      LEFT JOIN regiao ON a.regiao_id = regiao.id
      WHERE a.id = $1
    `, [id]);

    const agrupamento = result.rows[0];
    if (!agrupamento) {
      return res.status(404).json({ error: 'Agrupamento não encontrado' });
    }
    res.json(agrupamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    const result = await query(`
      INSERT INTO agrupamento (nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao]);
    
    res.json({ id: result.rows[0].id, message: 'Agrupamento criado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, regiao_id, endereco, cep, observacao } = req.body;

  try {
    await query(`
      UPDATE agrupamento SET nome = $1, regiao_id = $2, endereco = $3, cep = $4, observacao = $5
      WHERE id = $6
    `, [nome, regiao_id, endereco, cep, observacao, id]);
    
    res.json({ message: 'Agrupamento atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await query('DELETE FROM agrupamento WHERE id = $1', [id]);
    res.json({ message: 'Agrupamento removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;