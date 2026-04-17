const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middlewares/auth');

// Listar todas as pessoas
router.get('/', auth(), async (req, res) => {
  try {
    const { search, me } = req.query;
    let query = `
      SELECT p.*, a.nome as agrupamento_nome, u.nome as usuario_nome
      FROM pessoa p
      LEFT JOIN agrupamento a ON p.agrupamento_id = a.id
      LEFT JOIN usuario u ON p.usuario_id = u.id
      WHERE 1=1
    `;
    let params = [];

    if (search) {
      query += ` AND (p.nome LIKE ? OR p.email LIKE ?) `;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (me === 'true') {
      query += ` AND p.cadastrado_por_usuario_id = ? `;
      params.push(req.user.id);
    }

    query += ` ORDER BY p.nome ASC `;

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
});

// Criar nova pessoa
router.post('/', auth(), async (req, res) => {
  try {
    const { nome, email, telefone, data_nascimento, agrupamento_id, observacao } = req.body;
    
    if (email) {
      const [existing] = await db.execute('SELECT id FROM pessoa WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
    }
    
    const [result] = await db.execute(
      `INSERT INTO pessoa (
        nome, email, telefone, data_nascimento, agrupamento_id, observacao, cadastrado_por_usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, telefone, data_nascimento, agrupamento_id, observacao, req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Pessoa criada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pessoa' });
  }
});

// Detalhar pessoa
router.get('/:id', auth(), async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await db.execute('SELECT * FROM pessoa WHERE id = ?', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Pessoa nao encontrada' });
      }
      
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar pessoa' });
    }
});

// Deletar pessoa
router.delete('/:id', auth(), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM pessoa WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    
    res.json({ message: 'Pessoa deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar pessoa' });
  }
});

module.exports = router;