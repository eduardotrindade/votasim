const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middlewares/auth');

// Listar todos os agrupamentos
router.get('/', auth(), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.*, r.nome as regiao_nome, p.nome as pessoa_referencia_nome
      FROM agrupamento a
      LEFT JOIN regiao r ON a.regiao_id = r.id
      LEFT JOIN pessoa p ON a.pessoa_referencia_id = p.id
      ORDER BY a.nome ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar agrupamentos' });
  }
});

// Criar novo agrupamento
router.post('/', auth(), async (req, res) => {
  try {
    const { nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao } = req.body;
    
    if (!nome || !regiao_id) {
      return res.status(400).json({ error: 'Nome e Regiao sao obrigatorios' });
    }

    const [result] = await db.execute(
      `INSERT INTO agrupamento (
        nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao]
    );

    res.status(201).json({ id: result.insertId, message: 'Agrupamento criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar agrupamento' });
  }
});

// Detalhar agrupamento
router.get('/:id', auth(), async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM agrupamento WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Agrupamento nao encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar agrupamento' });
  }
});

// Atualizar agrupamento
router.put('/:id', auth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao } = req.body;

    await db.execute(
      `UPDATE agrupamento 
       SET nome = ?, pessoa_referencia_id = ?, regiao_id = ?, endereco = ?, cep = ?, observacao = ?
       WHERE id = ?`,
      [nome, pessoa_referencia_id, regiao_id, endereco, cep, observacao, id]
    );

    res.json({ message: 'Agrupamento atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar agrupamento' });
  }
});

module.exports = router;