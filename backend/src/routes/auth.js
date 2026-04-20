import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'votasim_secret_key_2024';

router.post('/login', async (req, res) => {
  const { email, password, senha } = req.body;
  const pwd = password || senha;
  
  if (!email || !pwd) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const result = await query('SELECT * FROM auth_users WHERE email = $1 AND ativo = true', [email]);
    const user = result.rows[0];
    
    if (!user || !bcrypt.compareSync(pwd, user.password)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const papelResult = await query('SELECT papel FROM papel WHERE id = $1', [user.papel_id]);
    const papel = papelResult.rows[0]?.papel || 'usuário';
    
    const token = jwt.sign(
      { id: user.id, email: user.email, papel_id: user.papel_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        papel,
        papel_id: user.papel_id
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await query('SELECT id, email, nome, papel_id, ativo FROM auth_users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const papelResult = await query('SELECT papel FROM papel WHERE id = $1', [user.papel_id]);
    const papel = papelResult.rows[0]?.papel || 'usuário';
    
    res.json({
      id: user.id,
      email: user.email,
      nome: user.nome,
      papel,
      ativo: user.ativo
    });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, senha, nome, papel_id } = req.body;
  const pwd = password || senha;

  if (!email || !pwd || !nome) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    const existente = await query('SELECT id FROM auth_users WHERE email = $1', [email]);
    if (existente.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hash = bcrypt.hashSync(pwd, 10);
    
    const result = await query(
      'INSERT INTO auth_users (email, password, nome, papel_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, hash, nome, papel_id || 4]
    );

    const userId = result.rows[0].id;
    const token = jwt.sign(
      { id: userId, email, papel_id: papel_id || 4 },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: userId, email, nome, papel: 'usuário' } });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/me', async (req, res) => {
  const { nome, telefone } = req.body;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    await query(
      'UPDATE auth_users SET nome = COALESCE($1, nome), telefone = COALESCE($2, telefone) WHERE id = $3',
      [nome, telefone, decoded.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/alterar-senha', async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userResult = await query('SELECT password FROM auth_users WHERE id = $1', [decoded.id]);
    const user = userResult.rows[0];
    
    if (!bcrypt.compareSync(senhaAtual, user.password)) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    const hash = bcrypt.hashSync(novaSenha, 10);
    await query('UPDATE auth_users SET password = $1 WHERE id = $2', [hash, decoded.id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;