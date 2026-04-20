import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const pessoasResult = await query('SELECT COUNT(*) as total FROM pessoa WHERE ativo = true');
    const totalPessoas = parseInt(pessoasResult.rows[0].total);
    
    const eventosResult = await query('SELECT COUNT(*) as total FROM evento');
    const totalEventos = parseInt(eventosResult.rows[0].total);
    
    const presencasResult = await query('SELECT COUNT(*) as total FROM evento_pessoas WHERE presente = true');
    const totalPresencas = parseInt(presencasResult.rows[0].total);
    
    const convidadosResult = await query('SELECT COUNT(*) as total FROM evento_pessoas');
    const totalConvidados = parseInt(convidadosResult.rows[0].total);
    
    const taxa = totalConvidados > 0 ? Math.round((totalPresencas / totalConvidados) * 100) : 0;
    
    res.json({
      totalPessoas,
      totalEventos,
      totalPresencas,
      taxaConversao: taxa
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const pessoasResult = await query('SELECT COUNT(*) as total FROM pessoa WHERE ativo = true');
    const totalPessoas = parseInt(pessoasResult.rows[0].total);
    
    const eventosMesResult = await query(`
      SELECT COUNT(*) as total FROM evento 
      WHERE TO_CHAR(TO_TIMESTAMP(data, 'YYYY-MM-DD'), 'YYYY-MM') = TO_CHAR(NOW(), 'YYYY-MM')
    `);
    const eventosMes = parseInt(eventosMesResult.rows[0].total);
    
    const checkinsResult = await query('SELECT COUNT(*) as total FROM evento_pessoas WHERE presente = true');
    const totalCheckins = parseInt(checkinsResult.rows[0].total);
    
    const presencasResult = await query('SELECT COUNT(*) as total FROM evento_pessoas WHERE presente = true');
    const presencas = parseInt(presencasResult.rows[0].total);
    
    const convidadosResult = await query('SELECT COUNT(*) as total FROM evento_pessoas');
    const convidados = parseInt(convidadosResult.rows[0].total);
    
    const engajamento = convidados > 0 ? Math.round((presencas / convidados) * 100) : 0;

    const graphResult = await query(`
      SELECT 
        TO_CHAR(p.cadastrado_em, 'MM/YYYY') as name,
        COUNT(*) as cadastros
      FROM pessoa p
      WHERE p.cadastrado_em IS NOT NULL
      GROUP BY TO_CHAR(p.cadastrado_em, 'MM/YYYY')
      ORDER BY TO_CHAR(p.cadastrado_em, 'YYYY-MM') DESC
      LIMIT 12
    `);

    res.json({
      totalPessoas,
      eventosMes: eventosMes || 0,
      totalCheckins,
      engajamento: engajamento + '%',
      graph: graphResult.rows
    });
  } catch (err) {
    console.error('Erro no stats:', err);
    res.json({
      totalPessoas: 0,
      eventosMes: 0,
      totalCheckins: 0,
      engajamento: '0%',
      graph: []
    });
  }
});

export default router;