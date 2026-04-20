import { query } from './config/db.js';
import { schema } from './config/postgresSchema.js';

export async function inicializarTabelas() {
  try {
    await query(schema);
    console.log('✅ Tabelas PostgreSQL inicializadas!');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar tabelas:', error);
    throw error;
  }
}

export default { inicializarTabelas };