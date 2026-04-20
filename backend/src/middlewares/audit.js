import db from '../db.js';

export function auditLogger(tabela, registroId, acao, dadosAntigos, dadosNovos, usuarioId, ip) {
  try {
    db.prepare(`
      INSERT INTO auditoria (tabela, registro_id, acao, dados_anteriores, dados_novos, usuario_id, ip)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      tabela,
      registroId,
      acao,
      dadosAntigos ? JSON.stringify(dadosAntigos) : null,
      dadosNovos ? JSON.stringify(dadosNovos) : null,
     usuarioId,
      ip
    );
  } catch (err) {
    console.error('Erro ao registrar auditoria:', err.message);
  }
}

export function audit(req, tabela, registroId, acao, dados) {
  const usuarioId = req.user?.id;
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  auditLogger(tabela, registroId, acao, null, dados, usuarioId, ip);
}

export default { auditLogger, audit };