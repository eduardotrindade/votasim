# VOTA SIM MARCIO - Documentação do Sistema

## 📋 Resumo da Análise

### Arquivos Encontrados
| Arquivo | Descrição |
|--------|-----------|
| `VotaSimTheique-release (8).apk` | Aplicativo Android |
| `db_cluster-05-09-2025@03-41-23.backup` | Backup PostgreSQL |
| `VotaSim - Storyboard.pdf` | Storyboard do app |
| `WhatsApp Image 2026-04-12 at 06.40.33.jpeg` | Print/Tela do app |
| Pasta `BKP/` | Imagens backup |
| Pasta `DB/` | Dados do banco |

## 🗄️ Estrutura do Banco de Dados

### Stack Técnica
- **Banco:** PostgreSQL 15 + Supabase
- **Extensões:** PostGIS, UUID-OSSP, pgcrypto
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage (bucket: bckpolitica)
- **Realtime:** Supabase Realtime

### Tabelas Principais (11 tabelas)

```
public.uf                  → Estados (27 estados)
public.cidade             → Capitais (27 cidades)
public.regiao            → Regiões/ bairros (DF)
public.agrupamento        → Grupos de pessoas
public.papel             → Tipos (sysadmin, candidato, assessor, líder, pessoa)
public.pessoa            → Eleitores/Cadastros
public.evento            → Eventos políticos
public.evento_fotos      → Fotos de eventos (geolocalizadas)
public.evento_pessoas     → Presença em eventos
public.registro_espontaneo → Registro de campo
public.vinculo          → Vínculos candidatos/assessores/líderes
```

### Dados do Banco (Backup 05/09/2025)
- **27 Estados** do Brasil
- **27 Capitais**
- **12 Regiões** do DF
- **~65 Pessoas** cadastradas
- **~14 Agrupamentos**
- **~13 Eventos**
- **~18 Fotos de eventos**
- **5 Vínculos**

## 📱 Aplicativo

### Funcionalidades
1. **Autenticação** - Login via Supabase Auth
2. **Cadastro de Pessoas** - Eleitores com foto, telefone, email
3. **Agrupamentos** - Grupos por região
4. **Eventos** - Eventos com check-in geolocalizado
5. **Registro Espontâneo** - Registro de campo com fotos
6. **Ranking** - Ranking de cadastros por usuário
7. **Hierarquia** - Candidato → Assessor → Líder → Pessoa

### APIs Utilizadas
- **URL Base:** https://nvhuhgzbplbkedwaykqn.supabase.co
- **Storage:** https://nvhuhgzbplbkedwaykqn.supabase.co/storage/v1/

## 📦 Arquivos Criados

| Arquivo | Descrição |
|--------|-----------|
| `vota-sim-schema.sql` | Schema SQL completo do banco |
| `APK-EXTRACTION-GUIDE.md` | Guia para extrair APK |
| `extract-apk.bat` | Script de extração |

## 🔄 Próximos Passos

### Opção 1: Restaurar Sistema Original
1. Criar novo projeto Supabase
2. Executar `vota-sim-schema.sql`
3. Restaurar dados do backup original
4. Decompilar APK para extrair código
5. Compilar e publicar novamente

### Opção 2: Criar Nova Versão
1. Criar novo projeto Flutter/React Native
2. Integrar com banco existente
3. Melhorar UI/UX
4. Publicar na Play Store

### Opção 3: Apenas Restaurar Banco
1. Criar projeto Supabase
2. Executar `vota-sim-schema.sql`
3. Usar app existente ou criar novo

## 📊 Estatísticas do Sistema

- **UsuáriosAuth:** ~5+ usuários
- **Pessoas cadastradas:** ~65
- **Agrupamentos:** 14
- **Eventos:** 13
- **Fotos:** 18+
- **Vínculos:** 5

## 🛠️ Como Usar

### Restaurar Banco
```bash
# No Supabase SQL Editor
# Execute o conteudo de vota-sim-schema.sql
```

### Extrair APK
```bash
# Execute extract-apk.bat
# Ou use JADX manualmente
jadx -d output "VotaSimTheique-release (8).apk"
```

## 📞 Suporte

Para recuperação completa:
1. Ter acesso ao projeto Supabase (API keys)
2. Extrair código fonte do APK
3. Restaurar banco com schema + dados
4. Compilar novo APK

---
**Data da análise:** 12/04/2026
**Sistema：** VOTA SIM MARCIO
**Stack：** Supabase + PostgreSQL + Android