# VOTA SIM MARCIO - Guia de Extração do APK

## Arquivo Original
- **APK:** `VotaSimTheique-release (8).apk`
- **Local:** `F:\Downloads\SISTEMAS\VOTA SIM MARCIO\`

## Ferramentas Necessárias

### 1. JADX (Decompilador Java)
```bash
# Via Chocolatey (Windows)
choco install jadx

# Via GitHub
git clone https://github.com/skylot/jadx.git
cd jadx
./gradlew.bat build
```

### 2. APKTool (Reverse Engineering)
```bash
# Install via Chocolatey
choco install apktool
```

### 3. JD-GUI (Java Decompiler)
- Download: https://github.com/java-decompiler/jd-gui

## Processo de Extração

### Passo 1: Extrair o APK
```bash
# Renomear para .zip e extrair
cp "VotaSimTheique-release (8).apk" votas.apk
unzip votas.apk -d extracted/
```

### Passo 2: Decompilar classes.dex (Código Java)
```bash
# Usando JADX
jadx -d output votas.apk

# Resultado em ./output/
```

### Passo 3: Obter recursos
```bash
# Usando APKTool
aptool d votas.apk -o resources/
```

### Passo 4: Assets e Dados
```bash
# Os assets ficam na pasta extracted/assets/
# O código fonte na pasta extracted/smali/ (se não for compilação em Java)
```

## Estrutura Esperada do App

Baseado no schema do banco, o app utiliza:

### Telas/Funcionalidades:
1. **Login/Auth** - Supabase Auth
2. **Dashboard** - Menu principal
3. **Cadastro Pessoa** - CRUD de eleitores
4. **Eventos** - CRUD eventos com check-in geolocalizado
5. **Grupos/Agrupamentos** - Gestão de grupos
6. **Ranking** - Ranking de cadastros
7. **Registro Espontâneo** - Registro de campo com fotos

### Stack Técnica:
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Frontend:** Flutter ou React Native (baseado no APK)
- **Database:** PostgreSQL com PostGIS

### Endpoints Supabase:
- **URL:** https://nvhuhgzbplbkedwaykqn.supabase.co
- **Storage Bucket:** bckpolitica

## Análise do Código

### Arquivos Importantes a Verificar:
- `AndroidManifest.xml` - Permissões e componentes
- `classes.dex` - Lógica principal
- `resources.arsc` - Recursos
- `assets/` - Arquivos estáticos

### Bibliotecas Comuns:
- Supabase Flutter SDK
- Flutter Reactive
- Google Maps (geolocalização)
- Camera/Image Picker

## Opção Alternativa: Novo Desenvolvimento

Se preferir criar uma nova versão:

### Stack Sugerida:
- **Frontend:** Flutter ou React Native
- **Backend:** Supabase (manter o mesmo banco)
- **Deploy:** Play Store

### Próximos Passos:
1. Decompilar APK para entender a lógica
2. Criar novo projeto Flutter
3. Integrar com o banco existente
4. Atualizar UI/UX
5. Publicar na Play Store

## Arquivos Gerados

- Schema SQL: `vota-sim-schema.sql`
- Código extraído: `./output/` (após decompilação)
- Recursos: `./resources/`

## Suporte

Para recuperar o projeto completo:
1. Extrair código fonte do APK
2. Usar o schema SQL para criar banco
3. Importar dados do backup
4. Configurar Supabase com as API keys妥当