const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middlewares/auth');

// Listar usuarios (apenas admin)
router.get('/', auth([1]), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.id, u.nome, u.email, u.telefone, u.papel_id, u.ativo, p.papel as papel_nome
      FROM usuario u
      LEFT JOIN papel p ON u.papel_id = p.id
      ORDER BY u.nome ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuarios' });
  }
});

// Atualizar papel de usuario
router.put('/:id/papel', auth([1]), async (req, res) => {
  try {
    const { id } = req.params;
    const { papel_id, ativo } = req.body;
    
    await db.execute(
      'UPDATE usuario SET papel_id = ?, ativo = ? WHERE id = ?',
      [papel_id, ativo, id]
    );

    res.json({ message: 'Usuario atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuario' });
  }
});

module.exports = router;