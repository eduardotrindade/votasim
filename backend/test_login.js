const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function test() {
  const email = 'teste@teste.com';
  const senha = 'teste123';
  
  const [users] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);
  if (users.length === 0) {
    console.log('Usuario nao encontrado');
    return;
  }
  
  const user = users[0];
  console.log('User:', user.email);
  console.log('Hash no DB:', user.senha_hash);
  
  const isValid = await bcrypt.compare(senha, user.senha_hash);
  console.log('Password valid:', isValid);
}

test();