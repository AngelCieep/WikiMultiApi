# update-universe-id.ps1
# Edita la variable UNIVERSE_ID en la línea 3 con el ID que quieras

# ════════════════════════════════════════════════════════════════════════════════
# EDITA AQUI: Reemplaza este ID por el que quieras usar
$UNIVERSE_ID = "699c2ace697a9535e225cd45"
# ════════════════════════════════════════════════════════════════════════════════

$file = Join-Path $PSScriptRoot "pokemon-all-bulk-READY.json"

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Actualizador de universeId - Pokemon Bulk" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── Comprobar que el archivo existe ──────────────────────────────────────────
if (-not (Test-Path $file)) {
    Write-Host "❌ ERROR: No se encontró el archivo:" -ForegroundColor Red
    Write-Host "   $file" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Asegúrate de que 'pokemon-all-bulk-READY.json' esté en la carpeta:" -ForegroundColor Yellow
    Write-Host "   $(Split-Path $file)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pulsa Enter para salir"
    exit 1
}

# ── Leer archivo ────────────────────────────────────────────────────────────────
Write-Host "📄 Archivo encontrado" -ForegroundColor Green
Write-Host "   $file" -ForegroundColor Gray

$content = [System.IO.File]::ReadAllText($file)

# Extraer primer universeId actual para mostrar
try {
    $json = $content | ConvertFrom-Json
    $currentId = $json[0].universeId
    Write-Host ""
    Write-Host "Nuevo universeId  : $UNIVERSE_ID" -ForegroundColor Yellow
    Write-Host "universeId actual : $currentId" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Aviso: No se pudo parsear el JSON" -ForegroundColor Yellow
}

Write-Host ""

# ── Reemplazar universeId ───────────────────────────────────────────────────────
Write-Host "🔄 Procesando..." -ForegroundColor Cyan

# Usar regex para reemplazar todos los universeId
$pattern = '(?<="universeId"\s*:\s*")[^"]+'
$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $UNIVERSE_ID)

# Contar cambios (número aproximado de reemplazos)
$matches = [System.Text.RegularExpressions.Regex]::Matches($content, $pattern)
$replacedCount = $matches.Count

# Guardar archivo
[System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)

Write-Host ""
Write-Host "✅ Listo!" -ForegroundColor Green
Write-Host "   Registros actualizados: $replacedCount" -ForegroundColor Green

# Verificar
try {
    $jsonVerify = $newContent | ConvertFrom-Json
    Write-Host "   universeId #1   : $($jsonVerify[0].universeId)" -ForegroundColor Green
    Write-Host "   universeId #1025: $($jsonVerify[1024].universeId)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  No se pudo verificar el JSON" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Pulsa Enter para salir"
