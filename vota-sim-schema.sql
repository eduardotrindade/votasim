-- =====================================================
-- VOTA SIM MARCIO - Schema do Banco de Dados
-- Restaurado do backup: db_cluster-05-09-2025
-- Stack: Supabase (PostgreSQL 15)
-- =====================================================

-- =====================================================
-- EXTENSÕES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- DADOS BASE (UF - Estados)
-- =====================================================
INSERT INTO public.uf (id, sigla, nome) VALUES
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
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DADOS BASE (Cidade - Capitais)
-- =====================================================
INSERT INTO public.cidade (id, uf_id, nome) VALUES
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
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DADOS BASE (Região - DF)
-- =====================================================
INSERT INTO public.regiao (id, cidade_id, nome) VALUES
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
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DADOS BASE (Papel)
-- =====================================================
INSERT INTO public.papel (id, papel) VALUES
(0, 'pendente'),
(1, 'sysadmin'),
(2, 'candidato'),
(3, 'assessor'),
(4, 'lider'),
(5, 'pessoa'),
(6, 'inativo')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- TABELAS DO SISTEMA
-- =====================================================

-- UF (Estados)
CREATE TABLE public.uf (
    id integer NOT NULL,
    sigla character(2),
    nome character varying
);

ALTER TABLE public.uf OWNER TO postgres;

-- Cidade
CREATE TABLE public.cidade (
    id integer NOT NULL,
    uf_id integer NOT NULL,
    nome character varying
);

ALTER TABLE public.cidade OWNER TO postgres;

-- Regiao
CREATE TABLE public.regiao (
    id integer NOT NULL,
    cidade_id integer,
    nome character varying
);

ALTER TABLE public.regiao OWNER TO postgres;

-- Agrupamento (Grupos de Pessoas)
CREATE TABLE public.agrupamento (
    id integer NOT NULL,
    pessoa_referencia_id integer,
    nome character varying,
    regiao_id integer,
    endereco character varying,
    cep text,
    observacao text
);

ALTER TABLE public.agrupamento OWNER TO postgres;

-- Papel (Tipos de pessoa: candidato, líder, assessor, etc)
CREATE TABLE public.papel (
    id integer NOT NULL,
    papel character varying
);

ALTER TABLE public.papel OWNER TO postgres;

-- Pessoa (Eleitores/Cadastros)
CREATE TABLE public.pessoa (
    id integer NOT NULL,
    nome character varying,
    data_nascimento date,
    papel_id integer DEFAULT 0,
    foto text DEFAULT 'https://nvhuhgzbplbkedwaykqn.supabase.co/storage/v1/object/public/bckpolitica/public/istockphoto-1684525085-170667a.jpg',
    observacao character varying,
    anexos bytea,
    agrupamento_id integer,
    cadastrado_em timestamp without time zone DEFAULT now(),
    cadastrado_por_usuario_id uuid,
    usuario_id uuid,
    telefone text,
    email text
);

ALTER TABLE public.pessoa OWNER TO postgres;

-- Evento (Eventos políticos)
CREATE TABLE public.evento (
    id integer NOT NULL,
    regiao_id integer,
    data date,
    observacao character varying,
    anexo bytea,
    usuario_organizador_id uuid,
    titulo text,
    check_in boolean DEFAULT false,
    data_hora_check_in timestamp without time zone,
    localizacao_check_in text,
    latitude double precision,
    longitude double precision
);

ALTER TABLE public.evento OWNER TO postgres;

-- Evento_Fotos (Fotos de eventos com geolocalização)
CREATE TABLE public.evento_fotos (
    evento_id integer NOT NULL,
    cadastrado_em timestamp with time zone DEFAULT now() NOT NULL,
    foto_id integer NOT NULL,
    foto text,
    localizacao_foto public.geography(Point,4326)
);

ALTER TABLE public.evento_fotos OWNER TO postgres;

-- Evento_Pessoas (Presença em eventos)
CREATE TABLE public.evento_pessoas (
    evento_id integer NOT NULL,
    pessoa_id integer NOT NULL,
    convidada boolean DEFAULT false,
    presente boolean DEFAULT false
);

ALTER TABLE public.evento_pessoas OWNER TO postgres;

-- Registro_Espontaneo (Registros de campo)
CREATE TABLE public.registro_espontaneo (
    id bigint NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    latitude double precision,
    longitude double precision,
    foto text,
    usuario_id uuid,
    observacao character varying
);

ALTER TABLE public.registro_espontaneo OWNER TO postgres;

-- Vinculo (Relação candidato/assessor/líder)
CREATE TABLE public.vinculo (
    candidato_id integer NOT NULL,
    assessor_id integer NOT NULL,
    lider_id integer NOT NULL,
    pessoa_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    esta_ativo boolean DEFAULT true NOT NULL
);

ALTER TABLE public.vinculo OWNER TO postgres;

-- =====================================================
-- SEQUENCES (Auto-increment)
-- =====================================================
CREATE SEQUENCE public.agrupamento_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.cidade_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.evento_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.evento_fotos_id_foto_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.papel_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.pessoa_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.regiao_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.registro_espontaneo_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.uf_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.vinculo_id_seq START WITH 1 INCREMENT BY 1;

-- =====================================================
-- PRIMARY KEYS
-- =====================================================
ALTER TABLE public.uf ADD CONSTRAINT uf_pkey PRIMARY KEY (id);
ALTER TABLE public.cidade ADD CONSTRAINT cidade_pkey PRIMARY KEY (id);
ALTER TABLE public.regiao ADD CONSTRAINT regiao_pkey PRIMARY KEY (id);
ALTER TABLE public.agrupamento ADD CONSTRAINT agrupamento_pkey PRIMARY KEY (id);
ALTER TABLE public.papel ADD CONSTRAINT papel_pkey PRIMARY KEY (id);
ALTER TABLE public.pessoa ADD CONSTRAINT pessoa_pkey PRIMARY KEY (id);
ALTER TABLE public.evento ADD CONSTRAINT evento_pkey PRIMARY KEY (id);
ALTER TABLE public.evento_fotos ADD CONSTRAINT evento_fotos_pkey PRIMARY KEY (foto_id);
ALTER TABLE public.evento_pessoas ADD CONSTRAINT evento_pessoas_pkey PRIMARY KEY (evento_id, pessoa_id);
ALTER TABLE public.registro_espontaneo ADD CONSTRAINT registro_espontaneo_pkey PRIMARY KEY (id);
ALTER TABLE public.vinculo ADD CONSTRAINT vinculo_pkey PRIMARY KEY (candidato_id, assessor_id, lider_id, pessoa_id);

-- =====================================================
-- FOREIGN KEYS
-- =====================================================
ALTER TABLE public.cidade ADD CONSTRAINT cidade_uf_id_fkey 
    FOREIGN KEY (uf_id) REFERENCES public.uf(id);

ALTER TABLE public.regiao ADD CONSTRAINT regiao_cidade_id_fkey 
    FOREIGN KEY (cidade_id) REFERENCES public.cidade(id);

ALTER TABLE public.agrupamento ADD CONSTRAINT agrupamento_regiao_id_fkey 
    FOREIGN KEY (regiao_id) REFERENCES public.regiao(id);

ALTER TABLE public.agrupamento ADD CONSTRAINT agrupamento_pessoa_referencia_id_fkey 
    FOREIGN KEY (pessoa_referencia_id) REFERENCES public.pessoa(id);

ALTER TABLE public.pessoa ADD CONSTRAINT pessoa_papel_id_fkey 
    FOREIGN KEY (papel_id) REFERENCES public.papel(id);

ALTER TABLE public.pessoa ADD CONSTRAINT pessoa_agrupamento_id_fkey 
    FOREIGN KEY (agrupamento_id) REFERENCES public.agrupamento(id);

ALTER TABLE public.evento ADD CONSTRAINT evento_id_regiao_fkey 
    FOREIGN KEY (regiao_id) REFERENCES public.regiao(id);

ALTER TABLE public.evento_fotos ADD CONSTRAINT evento_id_fkey 
    FOREIGN KEY (evento_id) REFERENCES public.evento(id);

ALTER TABLE public.evento_pessoas ADD CONSTRAINT evento_pessoas_presentes_evento_id_fkey 
    FOREIGN KEY (evento_id) REFERENCES public.evento(id);

ALTER TABLE public.evento_pessoas ADD CONSTRAINT evento_pessoas_presentes_pessoa_id_fkey 
    FOREIGN KEY (pessoa_id) REFERENCES public.pessoa(id);

-- Foreign Keys para auth.users (Supabase)
ALTER TABLE public.evento ADD CONSTRAINT evento_id_usuario_organizador_fkey 
    FOREIGN KEY (usuario_organizador_id) REFERENCES auth.users(id) ON UPDATE CASCADE;

ALTER TABLE public.pessoa ADD CONSTRAINT pessoa_cadastrado_por_usuario_id_fkey 
    FOREIGN KEY (cadastrado_por_usuario_id) REFERENCES auth.users(id) ON UPDATE CASCADE;

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX idx_pessoa_papel ON public.pessoa(papel_id);
CREATE INDEX idx_pessoa_agrupamento ON public.pessoa(agrupamento_id);
CREATE INDEX idx_pessoa_usuario ON public.pessoa(usuario_id);
CREATE INDEX idx_evento_regiao ON public.evento(regiao_id);
CREATE INDEX idx_evento_data ON public.evento(data);
CREATE INDEX idx_regiao_cidade ON public.regiao(cidade_id);
CREATE INDEX idx_cidade_uf ON public.cidade(uf_id);
CREATE INDEX idx_agrupamento_regiao ON public.agrupamento(regiao_id);
CREATE INDEX idx_vinculo_candidato ON public.vinculo(candidato_id);
CREATE INDEX idx_vinculo_lider ON public.vinculo(lider_id);
CREATE INDEX idx_vinculo_pessoa ON public.vinculo(pessoa_id);
CREATE INDEX idx_evento_pessoas_evento ON public.evento_pessoas(evento_id);
CREATE INDEX idx_evento_pessoas_pessoa ON public.evento_pessoas(pessoa_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.uf ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regiao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agrupamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pessoa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evento_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evento_pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registro_espontaneo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vinculo ENABLE ROW LEVEL SECURITY;

-- Policies (Liberar acesso público total)
CREATE POLICY "liberado_uf" ON public.uf FOR ALL USING (true);
CREATE POLICY "liberado_cidade" ON public.cidade FOR ALL USING (true);
CREATE POLICY "liberado_regiao" ON public.regiao FOR ALL USING (true);
CREATE POLICY "liberado_agrupamento" ON public.agrupamento FOR ALL USING (true);
CREATE POLICY "liberado_papel" ON public.papel FOR ALL USING (true);
CREATE POLICY "liberado_pessoa" ON public.pessoa FOR ALL USING (true);
CREATE POLICY "liberado_evento" ON public.evento FOR ALL USING (true);
CREATE POLICY "liberado_evento_fotos" ON public.evento_fotos FOR ALL USING (true);
CREATE POLICY "liberado_evento_pessoas" ON public.evento_pessoas FOR ALL USING (true);
CREATE POLICY "liberado_registro_espontaneo" ON public.registro_espontaneo FOR ALL USING (true);
CREATE POLICY "liberado_vinculo" ON public.vinculo FOR ALL USING (true);

-- =====================================================
-- STORAGE (Supabase Storage)
-- =====================================================
-- Buckets para storage de imagens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bckpolitica', 'bckpolitica', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- INSERT INICIAL (Papeis)
-- =====================================================
INSERT INTO public.papel (id, papel) VALUES 
(0, 'Pendente'),
(1, 'Eleitor'),
(2, 'Líder'),
(3, 'Assessor'),
(4, 'Candidato')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para ranking de cadastros
CREATE OR REPLACE FUNCTION public.exec_sql_ranking()
RETURNS TABLE(ordem integer, id integer, usuario_id uuid, nome text, total_cadastrados integer)
LANGUAGE sql
AS $$
    SELECT 
        ROW_NUMBER() OVER (ORDER BY COUNT(cadastrados.id) DESC) AS ordem,
        p.id,
        p.usuario_id,
        p.nome,
        COUNT(cadastrados.id) AS total_cadastrados
    FROM public.pessoa p
    LEFT JOIN public.pessoa cadastrados 
        ON cadastrados.cadastrado_por_usuario_id = p.usuario_id
    WHERE p.usuario_id IS NOT NULL
    GROUP BY p.id, p.usuario_id, p.nome
    ORDER BY total_cadastrados DESC;
$$;

ALTER FUNCTION public.exec_sql_ranking() OWNER TO postgres;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================