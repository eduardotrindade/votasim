const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function fixTestUser() {
  const hashedPassword = await bcrypt.hash('teste123', 10);
  await db.execute(
    'UPDATE usuario SET senha_hash = ? WHERE email = ?',
    [hashedPassword, 'teste@teste.com']
  );
  console.log('Senha atualizada');
}

fixTestUser();