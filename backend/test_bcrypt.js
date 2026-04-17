const bcrypt = require('bcryptjs');

async function test() {
  const hash1 = await bcrypt.hash('teste123', 10);
  console.log('Hash gerado:', hash1);
  
  const compare = await bcrypt.compare('teste123', hash1);
  console.log('Compare result:', compare);
}

test();