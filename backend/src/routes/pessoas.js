import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.js';
import { uploadFoto } from '../services/fotoService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { search = '', me, usuario_id } = req.query;
  
  let sql = `
    SELECT p.*, 
           papel.papel as papel,
           agrupamento.nome as agrupamento_nome
    FROM pessoa p
    LEFT JOIN papel ON p.papel_id = papel.id
    LEFT JOIN agrupamento ON p.agrupamento_id = agrupamento.id
    WHERE p.ativo = true
  `;
  const params = [];

  if (search) {
    sql += ' AND (p.nome ILIKE $' + (params.length + 1) + ' OR p.email ILIKE $' + (params.length + 2) + ')';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (me === 'true' && usuario_id) {
    sql += ' AND p.cadastrado_por_usuario_id = $' + (params.length + 1);
    params.push(usuario_id);
  }

  sql += ' ORDER BY p.id DESC';

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
      SELECT p.*, papel.papel as papel_nome, agrupamento.nome as agrupamento_nome
      FROM pessoa p
      LEFT JOIN papel ON p.papel_id = papel.id
      LEFT JOIN agrupamento ON p.agrupamento_id = agrupamento.id
      WHERE p.id = $1
    `, [id]);

    const pessoa = result.rows[0];
    if (!pessoa) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    res.json(pessoa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { 
    nome, data_nascimento, papel_id, foto, observacao, anexos, 
    agrupamento_id, cadastrado_por_usuario_id, telefone, email 
  } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    let fotoUrl = foto;
    if (foto && foto.startsWith('data:')) {
      fotoUrl = await uploadFoto(foto, 'pessoa');
    }

    const result = await query(`
      INSERT INTO pessoa (nome, data_nascimento, papel_id, foto, observacao, anexos, agrupamento_id, cadastrado_por_usuario_id, telefone, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [nome, data_nascimento, papel_id, fotoUrl, observacao,JSON.stringify(anexos), agrupamento_id, cadastrado_por_usuario_id, telefone, email]);

    res.json({ id: result.rows[0].id, success: true });
  } catch (err) {
    console.error('Erro ao criar pessoa:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, papel_id, foto, observacao, anexos, agrupamento_id, telefone, email, ativo } = req.body;

  try {
    let fotoUrl = foto;
    if (foto && foto.startsWith('data:')) {
      fotoUrl = await uploadFoto(foto, 'pessoa');
    }

    await query(`
      UPDATE pessoa SET 
        nome = COALESCE($1, nome),
        data_nascimento = COALESCE($2, data_nascimento),
        papel_id = COALESCE($3, papel_id),
        foto = COALESCE($4, foto),
        observacao = COALESCE($5, observacao),
        anexos = COALESCE($6, anexos),
        agrupamento_id = COALESCE($7, agrupamento_id),
        telefone = COALESCE($8, telefone),
        email = COALESCE($9, email),
        ativo = COALESCE($10, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
    `, [nome, data_nascimento, papel_id, fotoUrl, observacao, anexos ? JSON.stringify(anexos) : null, agrupamento_id, telefone, email, ativo, id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await query('UPDATE pessoa SET ativo = false WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;