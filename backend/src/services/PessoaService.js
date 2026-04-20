import db from '../db.js';

export class PessoaService {
  getAll({ search, usuario_id } = {}) {
    let query = `
      SELECT p.*, 
             papel.papel as papel,
             agrupamento.nome as agrupamento_nome
      FROM pessoa p
      LEFT JOIN papel ON p.papel_id = papel.id
      LEFT JOIN agrupamento ON p.agrupamento_id = agrupamento.id
      WHERE p.ativo = 1
    `;
    const params = [];

    if (search) {
      query += ' AND (p.nome LIKE ? OR p.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (usuario_id) {
      query += ' AND p.cadastrado_por_usuario_id = ?';
      params.push(usuario_id);
    }

    query += ' ORDER BY p.id DESC';
    return db.prepare(query).all(...params);
  }

  getById(id) {
    return db.prepare(`
      SELECT p.*, papel.papel as papel, agrupamento.nome as agrupamento_nome
      FROM pessoa p
      LEFT JOIN papel ON p.papel_id = papel.id
      LEFT JOIN agrupamento ON p.agrupamento_id = agrupamento.id
      WHERE p.id = ?
    `).get(id);
  }

  create(data) {
    const result = db.prepare(`
      INSERT INTO pessoa (nome, data_nascimento, papel_id, foto, observacao, anexos, agrupamento_id, cadastrado_por_usuario_id, telefone, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.nome, data.data_nascimento, data.papel_id || 4, data.foto, 
      data.observacao, data.anexos, data.agrupamento_id, 
      data.cadastrado_por_usuario_id, data.telefone, data.email
    );
    return result.lastInsertRowid;
  }

  update(id, data) {
    db.prepare(`
      UPDATE pessoa 
      SET nome = ?, data_nascimento = ?, papel_id = ?, foto = ?, observacao = ?, 
          telefone = ?, email = ?, ativo = ?, agrupamento_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.nome, data.data_nascimento, data.papel_id, data.foto, 
      data.observacao, data.telefone, data.email, 
      data.ativo ?? 1, data.agrupamento_id, id
    );
    return true;
  }

  delete(id) {
    db.prepare('UPDATE pessoa SET ativo = 0 WHERE id = ?').run(id);
    return true;
  }
}

export default new PessoaService();