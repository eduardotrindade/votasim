const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function testRegister() {
  try {
    const hashedPassword = await bcrypt.hash('teste123', 10);
    const result = await db.execute(
      'INSERT INTO usuario (nome, email, senha_hash, telefone, papel_id, ativo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Usuario Teste', 'teste@teste.com', hashedPassword, '11999999999', 0, 1]
    );
    console.log('Usuario criado:', result);
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

testRegister();