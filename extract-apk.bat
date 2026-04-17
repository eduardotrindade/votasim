@echo off
REM =====================================================
REM VOTA SIM MARCIO - Script de Extração do APK
REM =====================================================

echo.
echo ====================================================
echo   VOTA SIM MARCIO - Extracao do APK
echo ====================================================
echo.

set APK_NAME=VotaSimTheique-release (8).apk
set OUTPUT_DIR=extracted_code

echo Verificando APK original...
if not exist "%APK_NAME%" (
    echo ERRO: APK nao encontrado!
    pause
    exit /b 1
)

echo Instalando dependencias necessarias...
echo.

REM Verificar Java
java -version >nul 2>&1
if errorlevel 1 (
    echo Java nao encontrado. Instale o JDK primeiro.
    pause
    exit /b 1
)

REM Instalar jadx se nao existir
where jadx >nul 2>&1
if errorlevel 1 (
    echo.
    echo JADX nao encontrado. Instale via:
    echo   choco install jadx
    echo.
    echo Ou baixe de: https://github.com/skylot/jadx
    echo.
    echo Pressione enter para continuar mesmo assim...
    pause >nul
)

echo.
echo ====================================================
echo   Executando Extracao
echo ====================================================
echo.

REM Criar pasta de saida
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

REM Extrair APK (renomear como zip e extrair)
echo 1. Extraindo APK como ZIP...
powershell -command "Expand-Archive -Path '%APK_NAME%' -DestinationPath '%OUTPUT_DIR%\apk_raw' -Force"

REM Decompilar com jadx (se instalado)
where jadx >nul 2>&1
if not errorlevel 1 (
    echo 2. Decompilando classes.dex com JADX...
    jadx -d "%OUTPUT_DIR%\java_source" "%APK_NAME%"
    echo    OK - Codigo Java em: %OUTPUT_DIR%\java_source\
) else (
    echo. 
    echo AVISO: JADX nao instalado. Codigo Java nao extraido.
    echo Para ter o codigo fonte, instale JADX:
    echo   choco install jadx
)

REM Listar estrutura
echo.
echo ====================================================
echo   Estrutura Extraida
echo ====================================================
echo.

dir /b "%OUTPUT_DIR%\apk_raw\" 2>nul
echo.

echo ====================================================
echo   Concluido!
echo ====================================================
echo.
echo Arquivos em: %OUTPUT_DIR%\
echo.
echo Para ver o codigo fonte Java:
echo   code %OUTPUT_DIR%\java_source\
echo.
pause