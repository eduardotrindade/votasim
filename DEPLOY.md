# Deploy VotaSim - Vercel + Render

## Backend → Render

1. Criar conta em https://render.com
2. New Web Service
3. Conectar repositório Git
4. Configurações:
   - Name: votasim-backend
   - Root Directory: backend
   - Build Command: (vazio)
   - Start Command: node src/app.js
5. Environment Variables:
   - PORT: 3001
   - FRONTEND_URL: https://votasim-frontend.vercel.app
   - JWT_SECRET: gerar_uma_chave_segura_aqui

## Frontend → Vercel

1. Criar conta em https://vercel.com
2. New Project
3. Conectar repositório Git
4. Configurações:
   - Framework Preset: Vite
   - Root Directory: frontend
5. Environment Variables:
   - VITE_API_URL: https://votasim-backend.onrender.com

## OBS: O banco SQLite não persiste no Render (free tier)
## Para produção, migrar para PostgreSQL no Render (grátis)