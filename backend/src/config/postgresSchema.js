export const schema = `
-- Tabela Papeis
CREATE TABLE IF NOT EXISTS papel (
  id SERIAL PRIMARY KEY,
  papel TEXT NOT NULL UNIQUE
);

-- Tabela Usuarios (auth_users)
CREATE TABLE IF NOT EXISTS auth_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nome TEXT NOT NULL,
  papel_id INTEGER REFERENCES papel(id),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela UFs
CREATE TABLE IF NOT EXISTS uf (
  id SERIAL PRIMARY KEY,
  sigla TEXT NOT NULL,
  nome TEXT NOT NULL
);

-- Tabela Cidades
CREATE TABLE IF NOT EXISTS cidade (
  id SERIAL PRIMARY KEY,
  uf_id INTEGER REFERENCES uf(id),
  nome TEXT NOT NULL
);

-- Tabela Regioes
CREATE TABLE IF NOT EXISTS regiao (
  id SERIAL PRIMARY KEY,
  cidade_id INTEGER REFERENCES cidade(id),
  nome TEXT NOT NULL
);

-- Tabela Agrupamentos
CREATE TABLE IF NOT EXISTS agrupamento (
  id SERIAL PRIMARY KEY,
  pessoa_referencia_id INTEGER REFERENCES auth_users(id),
  nome TEXT NOT NULL,
  regiao_id INTEGER REFERENCES regiao(id),
  endereco TEXT,
  cep TEXT,
  observacao TEXT
);

-- Tabela Pessoas
CREATE TABLE IF NOT EXISTS pessoa (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  data_nascimento TEXT,
  papel_id INTEGER REFERENCES papel(id),
  foto TEXT,
  observacao TEXT,
  anexos TEXT,
  agrupamento_id INTEGER REFERENCES agrupamento(id),
  cadastrado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cadastrado_por_usuario_id INTEGER REFERENCES auth_users(id),
  usuario_id INTEGER REFERENCES auth_users(id),
  telefone TEXT,
  email TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- Tabela Eventos
CREATE TABLE IF NOT EXISTS evento (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  data TEXT,
  regiao_id INTEGER REFERENCES regiao(id),
  descricao TEXT,
  latitude REAL,
  longitude REAL,
  criado_por INTEGER REFERENCES auth_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Evento Pessoas (convites)
CREATE TABLE IF NOT EXISTS evento_pessoas (
  evento_id INTEGER REFERENCES evento(id),
  pessoa_id INTEGER REFERENCES pessoa(id),
  convidada BOOLEAN DEFAULT false,
  presente BOOLEAN DEFAULT false,
  data_checkin TIMESTAMP,
  latitude REAL,
  longitude REAL,
  foto_checkin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (evento_id, pessoa_id)
);

-- Tabela Evento Fotos
CREATE TABLE IF NOT EXISTS evento_fotos (
  id SERIAL PRIMARY KEY,
  evento_id INTEGER REFERENCES evento(id),
  url TEXT,
  latitude REAL,
  longitude REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Vinculos
CREATE TABLE IF NOT EXISTS vinculo (
  id SERIAL PRIMARY KEY,
  pessoa_id INTEGER REFERENCES pessoa(id),
  pessoa_relacionada_id INTEGER REFERENCES pessoa(id),
  tipo TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Registro Espontaneo
CREATE TABLE IF NOT EXISTS registro_espontaneo (
  id SERIAL PRIMARY KEY,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  latitude REAL,
  longitude REAL,
  foto TEXT,
  usuario_id INTEGER REFERENCES auth_users(id),
  observacao TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pessoa_ativo ON pessoa(ativo);
CREATE INDEX IF NOT EXISTS idx_pessoa_agrupamento ON pessoa(agrupamento_id);
CREATE INDEX IF NOT EXISTS idx_pessoa_cadastrado_por ON pessoa(cadastrado_por_usuario_id);
CREATE INDEX IF NOT EXISTS idx_evento_regiao ON evento(regiao_id);
CREATE INDEX IF NOT EXISTS idx_evento_data ON evento(data);
`;

export default schema;