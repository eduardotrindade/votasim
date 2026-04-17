const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middlewares/auth');

// Listar regioes
router.get('/', auth(), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM regiao ORDER BY nome ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar regioes' });
  }
});

// Criar regiao
router.post('/', auth(), async (req, res) => {
  try {
    const { nome, cidade_id } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO regiao (nome, cidade_id) VALUES (?, ?)',
      [nome, cidade_id]
    );

    res.status(201).json({ id: result.insertId, message: 'Regiao criada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar regiao' });
  }
});

module.exports = router;