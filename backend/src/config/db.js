import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.DB_URI || 'postgresql://postgres:Vot@sim@2026@db.ichogtsktsvmeyiyyoem.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Erro inesperado no PostgreSQL', err);
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executou query', { text: text.substring(0, 50), duration, rows: res.rowCount });
  return res;
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

export default { query, getClient, pool };