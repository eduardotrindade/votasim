const sqliteSchema = `
-- =====================================================
-- VOTA SIM MARCIO - Schema SQLite
-- Baseado no schema do Supabase/PostgreSQL
-- =====================================================

-- UF (Estados - 27 estados)
CREATE TABLE IF NOT EXISTS uf (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sigla TEXT,
    nome TEXT
);

-- Cidade (Capitais - 27 cidades)
CREATE TABLE IF NOT EXISTS cidade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uf_id INTEGER,
    nome TEXT,
    FOREIGN KEY (uf_id) REFERENCES uf(id)
);

-- Regiao (Regiões do DF - 12 regiões)
CREATE TABLE IF NOT EXISTS regiao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cidade_id INTEGER,
    nome TEXT,
    FOREIGN KEY (cidade_id) REFERENCES cidade(id)
);

-- Papel (Tipos de usuário)
CREATE TABLE IF NOT EXISTS papel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    papel TEXT
);

-- Usuario (usuários do sistema -代替 Supabase auth.users)
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha_hash TEXT,
    telefone TEXT,
    google_id TEXT,
    papel_id INTEGER,
    ativo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (papel_id) REFERENCES papel(id)
);

-- Agrupamento (Grupos de Pessoas)
CREATE TABLE IF NOT EXISTS agrupamento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pessoa_referencia_id INTEGER,
    nome TEXT,
    regiao_id INTEGER,
    endereco TEXT,
    cep TEXT,
    observacao TEXT,
    FOREIGN KEY (regiao_id) REFERENCES regiao(id),
    FOREIGN KEY (pessoa_referencia_id) REFERENCES pessoa(id)
);

-- Pessoa (Eleitores/Cadastros)
CREATE TABLE IF NOT EXISTS pessoa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    data_nascimento DATE,
    papel_id INTEGER DEFAULT 0,
    foto TEXT DEFAULT 'https://nvhuhgzbplbkedwaykqn.supabase.co/storage/v1/object/public/bckpolitica/public/istockphoto-1684525085-170667a.jpg',
    observacao TEXT,
    anexs BLOB,
    agrupamento_id INTEGER,
    usuario_id INTEGER,
    telefone TEXT,
    email TEXT,
    ativo BOOLEAN DEFAULT 1,
    cadastrado_por_usuario_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (papel_id) REFERENCES papel(id),
    FOREIGN KEY (agrupamento_id) REFERENCES agrupamento(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (cadastrado_por_usuario_id) REFERENCES usuario(id)
);

-- Evento (Eventos políticos)
CREATE TABLE IF NOT EXISTS evento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regiao_id INTEGER,
    data DATE,
    observacao TEXT,
    anexo BLOB,
    usuario_organizador_id INTEGER,
    titulo TEXT,
    check_in BOOLEAN DEFAULT 0,
    data_hora_check_in DATETIME,
    localizacao_check_in TEXT,
    latitude REAL,
    longitude REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (regiao_id) REFERENCES regiao(id),
    FOREIGN KEY (usuario_organizador_id) REFERENCES usuario(id)
);

-- Evento_Pessoas (Presença em eventos)
CREATE TABLE IF NOT EXISTS evento_pessoas (
    evento_id INTEGER,
    pessoa_id INTEGER,
    convidada BOOLEAN DEFAULT 0,
    presente BOOLEAN DEFAULT 0,
    PRIMARY KEY (evento_id, pessoa_id),
    FOREIGN KEY (evento_id) REFERENCES evento(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);

-- Evento_Fotos (Fotos de eventos com geolocalização)
CREATE TABLE IF NOT EXISTS evento_fotos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER,
    foto TEXT,
    cadastrado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    localizacao_foto TEXT,
    FOREIGN KEY (evento_id) REFERENCES evento(id)
);

-- Vinculo (Relação candidato/assessor/líder/pessoa)
CREATE TABLE IF NOT EXISTS vinculo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidato_id INTEGER,
    assistente_id INTEGER,
    lider_id INTEGER,
    pessoa_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    esta_ativo BOOLEAN DEFAULT 1,
    FOREIGN KEY (candidato_id) REFERENCES pessoa(id),
    FOREIGN KEY (assistente_id) REFERENCES pessoa(id),
    FOREIGN KEY (lider_id) REFERENCES pessoa(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);

-- Registro_Espontaneo (Registros de campo)
CREATE TABLE IF NOT EXISTS registro_espontaneo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitude REAL,
    longitude REAL,
    foto TEXT,
    usuario_id INTEGER,
    observacao TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_pessoa_papel ON pessoa(papel_id);
CREATE INDEX IF NOT EXISTS idx_pessoa_agrupamento ON pessoa(agrupamento_id);
CREATE INDEX IF NOT EXISTS idx_pessoa_usuario ON pessoa(usuario_id);
CREATE INDEX IF NOT EXISTS idx_evento_regiao ON evento(regiao_id);
CREATE INDEX IF NOT EXISTS idx_evento_data ON evento(data);
CREATE INDEX IF NOT EXISTS idx_regiao_cidade ON regiao(cidade_id);
CREATE INDEX IF NOT EXISTS idx_cidade_uf ON cidade(uf_id);
CREATE INDEX IF NOT EXISTS idx_agrupamento_regiao ON agrupamento(regiao_id);
CREATE INDEX IF NOT EXISTS idx_vinculo_candidato ON vinculo(candidato_id);
CREATE INDEX IF NOT EXISTS idx_vinculo_lider ON vinculo(lider_id);
CREATE INDEX IF NOT EXISTS idx_vinculo_pessoa ON vinculo(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_evento_pessoas_evento ON evento_pessoas(evento_id);
CREATE INDEX IF NOT EXISTS idx_evento_pessoas_pessoa ON evento_pessoas(pessoa_id);
`;

module.exports = sqliteSchema;