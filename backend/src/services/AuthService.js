import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'votasim_secret_key_2024';

export class AuthService {
  login(email, senha) {
    const user = db.prepare('SELECT * FROM auth_users WHERE email = ? AND ativo = 1').get(email);
    if (!user || !bcrypt.compareSync(senha, user.password)) {
      throw new Error('Credenciais inválidas');
    }

    const papel = db.prepare('SELECT papel FROM papel WHERE id = ?').get(user.papel_id);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, papel_id: user.papel_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        papel: papel?.papel || 'usuário'
      }
    };
  }

  register(data) {
    const existente = db.prepare('SELECT id FROM auth_users WHERE email = ?').get(data.email);
    if (existente) throw new Error('Email já cadastrado');

    const hash = bcrypt.hashSync(data.senha, 10);
    const result = db.prepare(`
      INSERT INTO auth_users (email, password, nome, papel_id)
      VALUES (?, ?, ?, ?)
    `).run(data.email, hash, data.nome, data.papel_id || 4);
    
    return result.lastInsertRowid;
  }

  getUsers() {
    return db.prepare(`
      SELECT au.id, au.email, au.nome, au.papel_id, au.ativo, papel.papel
      FROM auth_users au
      LEFT JOIN papel ON au.papel_id = papel.id
      ORDER BY au.nome
    `).all();
  }

  updateUser(id, data) {
    if (data.papel_id !== undefined) {
      db.prepare('UPDATE auth_users SET papel_id = ? WHERE id = ?').run(data.papel_id, id);
    }
    if (data.ativo !== undefined) {
      db.prepare('UPDATE auth_users SET ativo = ? WHERE id = ?').run(data.ativo, id);
    }
    return true;
  }
}

export default new AuthService();