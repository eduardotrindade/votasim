const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const app = express();
app.use(cors({
  origin: [frontendUrl, 'https://*.vercel.app']
}));

const authRoutes = require('./routes/auth');
const pessoaRoutes = require('./routes/pessoa');
const eventoRoutes = require('./routes/evento');
const dashboardRoutes = require('./routes/dashboard');
const regiaoRoutes = require('./routes/regiao');
const usuarioRoutes = require('./routes/usuario');
const agrupamentoRoutes = require('./routes/agrupamento');
const importRoutes = require('./routes/import');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middlewares e Rotas
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/auth', authRoutes);
app.use('/pessoas', pessoaRoutes);
app.use('/eventos', eventoRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/regioes', regiaoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/agrupamentos', agrupamentoRoutes);
app.use('/import', importRoutes);

// Exportar para que possamos iniciar o servidor via um server.js (opcional) ou diretamente aqui
// Garantir pasta de uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});