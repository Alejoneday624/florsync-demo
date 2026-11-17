# start-dev.ps1 — levanta backend (Django) y frontend (Vite) de la demo
# Uso:  powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
# Para detener: cierra las ventanas o presiona Ctrl+C en cada una.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# --- Backend Django (puerto 8000) ---
$backend = Join-Path $root "backend"
Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$backend'; & '.\.venv\Scripts\python.exe' manage.py runserver 127.0.0.1:8000"
) -WorkingDirectory $backend

# --- Frontend Vite (puerto 5173) ---
$frontend = Join-Path $root "frontend"
Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$frontend'; npm run dev"
) -WorkingDirectory $frontend

Start-Sleep -Seconds 3
Write-Host ""
Write-Host "FlorSync Demo iniciando..." -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173  (pantalla de inicio)"
Write-Host "  Backend:  http://127.0.0.1:8000   (API)"
Write-Host ""
Write-Host "Se abrieron dos ventanas de PowerShell (una por servidor)." -ForegroundColor Yellow
Write-Host "Cierra esas ventanas para detener la demo."
