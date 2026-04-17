const db = require('./src/config/db');

async function check() {
  const [users] = await db.execute('SELECT * FROM usuario WHERE email = ?', ['teste@teste.com']);
  console.log('User from db.execute:', users[0]);
}

check();