# Deploy VotaSim - Vercel + Render (PostgreSQL/Supabase)

## Configurações do Banco (PostgreSQL/Supabase)

- **URL**: https://ichogtsktsvmeyiyyoem.supabase.co
- **DB**: postgresql://postgres:Vot@sim@2026@db.ichogtsktsvmeyiyyoem.supabase.co:5432/postgres
- **JWT_SECRET**: keXNwLSmrkbLQ74xF7O2VYr0ezKWvU2QXZ5DZyB682uJaj8Hz5N5zqA2Ge3y4Day564LPWRhlKbWd0c40aCFAQ==

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
   - JWT_SECRET: keXNwLSmrkbLQ74xF7O2VYr0ezKWvU2QXZ5DZyB682uJaj8Hz5N5zqA2Ge3y4Day564LPWRhlKbWd0c40aCFAQ==
   - SUPABASE_URL: https://ichogtsktsvmeyiyyoem.supabase.co
   - SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - DATABASE_URL: postgresql://postgres:Vot@sim@2026@db.ichogtsktsvmeyiyyoem.supabase.co:5432/postgres
   - CLOUDINARY_CLOUD_NAME: (sua config)
   - CLOUDINARY_API_KEY: (sua config)
   - CLOUDINARY_API_SECRET: (sua config)

## Frontend → Vercel

1. Criar conta em https://vercel.com
2. New Project
3. Conectar repositório Git
4. Configurações:
   - Framework Preset: Vite
   - Root Directory: frontend
5. Environment Variables:
   - VITE_API_URL: https://votasim.onrender.com

## Criar tabelas (apenas 1ª vez)

Após deploy, execute:
```bash
node setup.js
```

Ou rode o SQL schema no Supabase Dashboard:
- Tables → New table
- Use o schema em config/postgresSchema.js