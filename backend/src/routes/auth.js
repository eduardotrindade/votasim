const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Rota de Registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;
    
    // Validacao basica
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatorios' });
    }

    // Verificar se usuario existe
    const [existingUsers] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email ja cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir usuario (papel padrao: 0 - pendente)
    const [result] = await db.execute(
      'INSERT INTO usuario (nome, email, senha_hash, telefone, papel_id, ativo) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, email, hashedPassword, telefone || null, 0, false]
    );

    res.status(201).json({ message: 'Usuario registrado com sucesso', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [users] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const user = users[0];

    // Verificar senha
    const isValid = await bcrypt.compare(senha, user.senha_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    if (!user.ativo && user.papel_id !== 1) { // Só admin pode logar sem estar "ativo" ou ajustar isso conforme necessidade
        // Permitir login para vermos o staging page
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, papel_id: user.papel_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        papel_id: user.papel_id,
        ativo: user.ativo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota Google Login (Mock/Placeholder)
router.post('/google', async (req, res) => {
  try {
    const { token: googleToken, googleData } = req.body;
    // Aqui entraria a verificacao do token com o Google
    
    const email = googleData.email;
    const nome = googleData.nome;
    const googleId = googleData.id;

    let [users] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);
    let user;

    if (users.length === 0) {
      // Registrar usuario automaticamente se nao existir
      const [result] = await db.execute(
        'INSERT INTO usuario (nome, email, google_id, papel_id, ativo) VALUES (?, ?, ?, ?, ?)',
        [nome, email, googleId, 0, false]
      );
      const [newUsers] = await db.execute('SELECT * FROM usuario WHERE id = ?', [result.insertId]);
      user = newUsers[0];
    } else {
      user = users[0];
      // Atualizar Google ID se necessario
      if (!user.google_id) {
        await db.execute('UPDATE usuario SET google_id = ? WHERE id = ?', [googleId, user.id]);
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, papel_id: user.papel_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login Google' });
  }
});

module.exports = router;