import db from '../db.js';

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export class EventoService {
  getAll({ search, usuario_id } = {}) {
    let query = `
      SELECT e.*, regiao.nome as regiao_nome, auth_users.nome as organizador_nome
      FROM evento e
      LEFT JOIN regiao ON e.regiao_id = regiao.id
      LEFT JOIN auth_users ON e.criado_por = auth_users.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (e.titulo LIKE ? OR regiao.nome LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY e.data DESC, e.id DESC';
    return db.prepare(query).all(...params);
  }

  getById(id) {
    return db.prepare(`
      SELECT e.*, regiao.nome as regiao_nome
      FROM evento e
      LEFT JOIN regiao ON e.regiao_id = regiao.id
      WHERE e.id = ?
    `).get(id);
  }

  create(data) {
    const result = db.prepare(`
      INSERT INTO evento (titulo, regiao_id, data, descricao, latitude, longitude, criado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(data.titulo, data.regiao_id, data.data, data.descricao, data.latitude, data.longitude, data.criado_por);
    return result.lastInsertRowid;
  }

  update(id, data) {
    db.prepare(`
      UPDATE evento 
      SET titulo = ?, regiao_id = ?, data = ?, descricao = ?, latitude = ?, longitude = ?
      WHERE id = ?
    `).run(data.titulo, data.regiao_id, data.data, data.descricao, data.latitude, data.longitude, id);
    return true;
  }

  delete(id) {
    db.prepare('DELETE FROM evento WHERE id = ?').run(id);
    return true;
  }

  checkin(eventoId, pessoaId, latitude, longitude, foto) {
    const evento = db.prepare('SELECT latitude, longitude FROM evento WHERE id = ?').get(eventoId);
    if (!evento) throw new Error('Evento não encontrado');

    const distanciaMaximaKm = 0.5;
    if (evento.latitude && evento.longitude && latitude && longitude) {
      const distancia = calcularDistancia(latitude, longitude, evento.latitude, evento.longitude);
      if (distancia > distanciaMaximaKm) {
        throw new Error(`Distância máxima excedida (${distancia.toFixed(2)} km)`);
      }
    }

    db.prepare(`
      UPDATE evento_pessoas 
      SET presente = 1, data_checkin = datetime('now'), latitude = ?, longitude = ?, foto_checkin = ?, updated_at = datetime('now')
      WHERE evento_id = ? AND pessoa_id = ?
    `).run(latitude, longitude, foto, eventoId, pessoaId);
    return true;
  }

  convidar(eventoId, pessoaIds) {
    for (const pessoa_id of pessoaIds) {
      db.prepare(`
        INSERT OR REPLACE INTO evento_pessoas (evento_id, pessoa_id, convidada) VALUES (?, ?, 1)
      `).run(eventoId, pessoa_id);
    }
    return true;
  }

  getConvidados(eventoId) {
    return db.prepare(`
      SELECT p.id as pessoa_id, p.nome, p.email, p.telefone, ep.convidada, ep.presente, ep.data_checkin
      FROM pessoa p
      INNER JOIN evento_pessoas ep ON p.id = ep.pessoa_id AND ep.evento_id = ?
      ORDER BY p.nome
    `).all(eventoId);
  }
}

export default new EventoService();