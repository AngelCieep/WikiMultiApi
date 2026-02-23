@echo off
chcp 65001 >nul
setlocal

set FILE=%~dp0pokemon-all-bulk-READY.json

echo ============================================
echo  Actualizador de universeId - Pokemon Bulk
echo ============================================
echo.
echo Archivo: %FILE%
echo.

:: Comprobar que el archivo existe
if not exist "%FILE%" (
    echo ERROR: No se encontro el archivo:
    echo   %FILE%
    echo.
    echo Asegurate de que pokemon-all-bulk-READY.json esta en la misma carpeta que este .bat
    echo.
    pause
    exit /b 1
)

:: Mostrar el universeId actual
echo Leyendo universeId actual...
powershell -NoProfile -Command "$j = [System.IO.File]::ReadAllText('%FILE%') | ConvertFrom-Json; Write-Host ('  universeId actual: ' + $j[0].universeId)"
echo.

:: Pedir el nuevo ID
set /p NEW_ID=Introduce el nuevo universeId: 

if "%NEW_ID%"=="" (
    echo ERROR: No has introducido ningun ID. Operacion cancelada.
    pause
    exit /b 1
)

echo.
echo Sustituyendo universeId por: %NEW_ID%

powershell -NoProfile -Command ^
    "$path = '%FILE%';" ^
    "$content = [System.IO.File]::ReadAllText($path);" ^
    "$pattern = '(?<=\"universeId\"\s*:\s*\")[^\"]+(?=\")';" ^
    "$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, '%NEW_ID%');" ^
    "[System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8);" ^
    "$json = $newContent | ConvertFrom-Json;" ^
    "Write-Host ('  Lineas modificadas comprobadas: ' + ($json | Where-Object { $_.universeId -eq '%NEW_ID%' }).Count + ' / ' + $json.Count);" ^
    "Write-Host ('  universeId #1   : ' + $json[0].universeId);" ^
    "Write-Host ('  universeId #1025: ' + $json[1024].universeId);"

echo.
echo Listo! El archivo ha sido actualizado.
echo.
pause
endlocal
