const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('🌱 Iniciando seed completo do VotaSim...');

    // 1. Limpar tabelas existentes
    await db.execute('DELETE FROM evento_pessoas');
    await db.execute('DELETE FROM evento_fotos');
    await db.execute('DELETE FROM evento');
    await db.execute('DELETE FROM vinculo');
    await db.execute('DELETE FROM registro_espontaneo');
    await db.execute('DELETE FROM pessoa');
    await db.execute('DELETE FROM agrupamento');
    await db.execute('DELETE FROM usuario');
    await db.execute('DELETE FROM regiao');
    await db.execute('DELETE FROM cidade');
    await db.execute('DELETE FROM uf');
    await db.execute('DELETE FROM papel');

    // 2. Inserir Papéis (como no original)
    await db.execute(`
      INSERT INTO papel (id, papel) VALUES 
      (0, 'Pendente'),
      (1, 'Eleitor'),
      (2, 'Líder'),
      (3, 'Assessor'),
      (4, 'Candidato'),
      (5, 'Sysadmin'),
      (6, 'Inativo')
    `);
    console.log('✅ Papéis inseridos');

    // 3. Inserir 27 Estados (UF)
    await db.execute(`
      INSERT INTO uf (id, sigla, nome) VALUES
      (1, 'AC', 'Acre'),
      (2, 'AL', 'Alagoas'),
      (3, 'AP', 'Amapá'),
      (4, 'AM', 'Amazonas'),
      (5, 'BA', 'Bahia'),
      (6, 'CE', 'Ceará'),
      (7, 'DF', 'Distrito Federal'),
      (8, 'ES', 'Espírito Santo'),
      (9, 'GO', 'Goiás'),
      (10, 'MA', 'Maranhão'),
      (11, 'MT', 'Mato Grosso'),
      (12, 'MS', 'Mato Grosso do Sul'),
      (13, 'MG', 'Minas Gerais'),
      (14, 'PA', 'Pará'),
      (15, 'PB', 'Paraíba'),
      (16, 'PR', 'Paraná'),
      (17, 'PE', 'Pernambuco'),
      (18, 'PI', 'Piauí'),
      (19, 'RJ', 'Rio de Janeiro'),
      (20, 'RN', 'Rio Grande do Norte'),
      (21, 'RS', 'Rio Grande do Sul'),
      (22, 'RO', 'Rondônia'),
      (23, 'RR', 'Roraima'),
      (24, 'SC', 'Santa Catarina'),
      (25, 'SP', 'São Paulo'),
      (26, 'SE', 'Sergipe'),
      (27, 'TO', 'Tocantins')
    `);
    console.log('✅ 27 Estados inseridos');

    // 4. Inserir 27 Capitais (Cidades)
    await db.execute(`
      INSERT INTO cidade (id, uf_id, nome) VALUES
      (1, 1, 'Rio Branco'),
      (2, 2, 'Maceió'),
      (3, 3, 'Macapá'),
      (4, 4, 'Manaus'),
      (5, 5, 'Salvador'),
      (6, 6, 'Fortaleza'),
      (7, 7, 'Brasília'),
      (8, 8, 'Vitória'),
      (9, 9, 'Goiânia'),
      (10, 10, 'São Luís'),
      (11, 11, 'Cuiabá'),
      (12, 12, 'Campo Grande'),
      (13, 13, 'Belo Horizonte'),
      (14, 14, 'Belém'),
      (15, 15, 'João Pessoa'),
      (16, 16, 'Curitiba'),
      (17, 17, 'Recife'),
      (18, 18, 'Teresina'),
      (19, 19, 'Rio de Janeiro'),
      (20, 20, 'Natal'),
      (21, 21, 'Porto Alegre'),
      (22, 22, 'Porto Velho'),
      (23, 23, 'Boa Vista'),
      (24, 24, 'Florianópolis'),
      (25, 25, 'São Paulo'),
      (26, 26, 'Aracaju'),
      (27, 27, 'Palmas')
    `);
    console.log('✅ 27 Capitais inseridas');

    // 5. Inserir 12 Regiões do DF
    await db.execute(`
      INSERT INTO regiao (id, cidade_id, nome) VALUES
      (1, 7, 'Plano Piloto'),
      (2, 7, 'Águas Claras'),
      (3, 7, 'Taguatinga'),
      (4, 7, 'Ceilândia'),
      (5, 7, 'Gama'),
      (6, 7, 'Guará'),
      (7, 7, 'Samambaia'),
      (8, 7, 'Sobradinho'),
      (9, 7, 'Recanto das Emas'),
      (10, 7, 'Santa Maria'),
      (11, 7, 'Riacho Fundo'),
      (12, 7, 'Paranoá')
    `);
    console.log('✅ 12 Regiões do DF inseridas');

    // 6. Inserir Usuário Administrador
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('Vot@sim@2026', salt);
    await db.execute(
      "INSERT INTO usuario (id, nome, email, senha_hash, papel_id, ativo) VALUES (1, 'Administrador Mestre', 'admin@votasim.com', ?, 5, 1)",
      [adminPass]
    );
    console.log('✅ Usuário admin criado');

    // 7. Inserir Pessoas de Exemplo
    await db.execute(`
      INSERT INTO pessoa (nome, email, telefone, papel_id, ativo) VALUES 
      ('João da Silva', 'joao@email.com', '(61) 98888-7777', 2, 1),
      ('Maria Oliveira', 'maria@email.com', '(61) 97777-6666', 2, 1),
      ('Carlos Souza', 'carlos@email.com', '(61) 96666-5555', 2, 1),
      ('Pedro Santos', 'pedro@email.com', '(61) 95555-4444', 3, 1),
      ('Ana Costa', 'ana@email.com', '(61) 94444-3333', 3, 1)
    `);
    console.log('✅ Pessoas de exemplo inseridas');

    // 8. Inserir Eventos de Exemplo
    await db.execute(`
      INSERT INTO evento (titulo, data, regiao_id, usuario_organizador_id, check_in) VALUES 
      ('Reunião de Lideranças - Plano Piloto', '2026-05-10', 1, 1, 0),
      ('Evento Comunitário - Taguatinga', '2026-05-15', 3, 1, 0),
      ('Encontro no Gama', '2026-05-20', 5, 1, 0),
      ('Reunião na Águas Claras', '2026-06-01', 2, 1, 0)
    `);
    console.log('✅ Eventos de exemplo inseridos');

    // 9. Inserir agrupamentos de exemplo
    await db.execute(`
      INSERT INTO agrupamento (nome, regiao_id, endereco) VALUES
      ('Grupo Liderança Plano Piloto', 1, 'SHN Quadra 1'),
      ('Grupo Comunidade Taguatinga', 3, 'QNL 4'),
      ('Grupo Amigos do Gama', 5, 'Area Especial 3')
    `);
    console.log('✅ Agrupamentos inseridos');

    console.log('');
    console.log('=================================');
    console.log('🎉 SEED CONCLUÍDO COM SUCESSO!');
    console.log('=================================');
    console.log('');
    console.log('📋 Resumo:');
    console.log('   - 27 Estados');
    console.log('   - 27 Capitais');
    console.log('   - 12 Regiões do DF');
    console.log('   - 7 Papéis');
    console.log('   - 1 Usuário admin');
    console.log('   - 5 Pessoas de exemplo');
    console.log('   - 4 Eventos de exemplo');
    console.log('   - 3 Agrupamentos');
    console.log('');
    console.log('🔑 Login: admin@votasim.com');
    console.log('🔑 Senha: Vot@sim@2026');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
  }
}

seed();