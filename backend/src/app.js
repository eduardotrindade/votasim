import express from 'express';
import cors from 'cors';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { query } from './config/db.js';
import { inicializarTabelas } from './setup.js';
import authRoutes from './routes/auth.js';
import pessoasRoutes from './routes/pessoas.js';
import eventosRoutes from './routes/eventos.js';
import agrupamentosRoutes from './routes/agrupamentos.js';
import regioesRoutes from './routes/regioes.js';
import dashboardRoutes from './routes/dashboard.js';
import uploadRoutes from './routes/upload.js';
import PapeisRoutes from './routes/papeis.js';
import vinculosRoutes from './routes/vinculos.js';

const app = express();
const PORT = process.env.PORT || 3001;

const uploadDir = join(dirname(fileURLToPath(import.meta.url)), '../uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

await inicializarTabelas();

app.use('/auth', authRoutes);
app.use('/pessoas', pessoasRoutes);
app.use('/eventos', eventosRoutes);
app.use('/agrupamentos', agrupamentosRoutes);
app.use('/regioes', regioesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api', uploadRoutes);
app.use('/papeis', PapeisRoutes);
app.use('/vinculos', vinculosRoutes);

app.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'OK', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.json({ status: 'OK', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor VotaSim rodando em http://localhost:${PORT}`);
  console.log(`📋 Acesse: http://localhost:5173 para o Frontend`);
});