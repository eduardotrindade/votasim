const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middlewares/auth');

// Rota principal do Dashboard (stats geral)
router.get('/', auth(), async (req, res) => {
  try {
    // Total de Pessoas Cadastradas
    const [peopleCount] = await db.execute('SELECT COUNT(*) as total FROM pessoa WHERE ativo = 1');
    
    // Total de Eventos
    const [eventosCount] = await db.execute('SELECT COUNT(*) as total FROM evento');
    
    // Total de Presenças em eventos
    const [presencasCount] = await db.execute(
      'SELECT COUNT(*) as total FROM evento_pessoas WHERE presente = 1'
    );

    res.json({
      totalPessoas: peopleCount[0].total,
      totalEventos: eventosCount[0].total,
      totalPresencas: presencasCount[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

// Rota de Estatísticas Gerais para o Dashboard
router.get('/stats', auth(), async (req, res) => {
  try {
    // 1. Total de Pessoas Cadastradas
    const [peopleCount] = await db.execute('SELECT COUNT(*) as total FROM pessoa');
    
    // 2. Eventos no mês atual (SQLite)
    const [monthEvents] = await db.execute(`
      SELECT COUNT(*) as total FROM evento 
      WHERE strftime('%Y-%m', data) = strftime('%Y-%m', 'now')
    `);
    
    // 3. Total de Check-ins realizados
    const [checkins] = await db.execute('SELECT COUNT(*) as total FROM evento WHERE check_in = 1');

    // 4. Dados para o Gráfico (Crescimento de Cadastros nos últimos 6 meses)
    // Agrupando por mês
    const [graphData] = await db.execute(`
      SELECT 
        strftime('%m/%Y', created_at) as name, 
        COUNT(*) as cadastros 
      FROM pessoa 
      GROUP BY strftime('%m/%Y', created_at)
      ORDER BY created_at ASC 
      LIMIT 6
    `);

    res.json({
      totalPessoas: peopleCount[0].total,
      eventosMes: monthEvents[0].total,
      totalCheckins: checkins[0].total,
      engajamento: "72%", // Placeholder para lógica futura de %
      graph: graphData.length > 0 ? graphData : [
        { name: 'Jan', cadastros: 10 },
        { name: 'Fev', cadastros: 25 },
        { name: 'Mar', cadastros: 45 }
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar estatisticas' });
  }
});

// Rota de Ranking de Cadastros (Top usuários que mais cadastraram)
router.get('/ranking', auth(), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.nome, COUNT(p.id) as total_cadastros
      FROM usuario u
      JOIN pessoa p ON u.id = p.cadastrado_por_usuario_id
      GROUP BY u.id
      ORDER BY total_cadastros DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

// Rota de Heatmap (coordenadas dos eventos)
router.get('/heatmap', auth(), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT latitude, longitude, COUNT(*) as peso
      FROM evento
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      GROUP BY latitude, longitude
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar heatmap' });
  }
});

module.exports = router;