# Script para probar el login del frontend
# Requiere: Docker Desktop, Node.js, npm

Write-Host "=== WePet Login Test Setup ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Iniciar Docker Compose
Write-Host "1. Iniciando servicios backend con Docker Compose..." -ForegroundColor Yellow
Write-Host "   Esto puede tomar 1-2 minutos la primera vez." -ForegroundColor Gray
Write-Host ""

Push-Location (Get-Item $PSScriptRoot).FullName

# Verificar si Docker está corriendo
$dockerRunning = docker ps 2>$null
if (!$dockerRunning) {
    Write-Host "ERROR: Docker no está corriendo. Por favor, inicia Docker Desktop primero." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker está activo" -ForegroundColor Green

# Iniciar docker-compose en background
Write-Host "Iniciando contenedores..." -ForegroundColor Gray
docker-compose up -d 2>&1 | Out-Null

# Esperar a que los servicios estén listos
Write-Host "Esperando a que los servicios se inicien..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Verificar conexión a user-managment
$maxRetries = 30
$retryCount = 0
$userServiceReady = $false

while ($retryCount -lt $maxRetries -and -not $userServiceReady) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/user/auth/login" -Method Options -ErrorAction Stop -TimeoutSec 2
        $userServiceReady = $true
        Write-Host "✓ Servicio de usuario está listo" -ForegroundColor Green
    } catch {
        $retryCount++
        if ($retryCount % 5 -eq 0) {
            Write-Host "Intento $retryCount/$maxRetries..." -ForegroundColor Gray
        }
        Start-Sleep -Seconds 1
    }
}

if (-not $userServiceReady) {
    Write-Host "ERROR: El servicio de usuario no está respondiendo." -ForegroundColor Red
    Write-Host "Verifica los logs: docker logs user-managment" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== Creando usuario de prueba ===" -ForegroundColor Cyan
Write-Host ""

# Datos del usuario de prueba
$testUsername = "testuser"
$testEmail = "test@example.com"
$testPassword = "Test123!@#"
$testBirthDate = "1990-01-01"

# Crear usuario de prueba
$registerPayload = @{
    username = $testUsername
    email = $testEmail
    password = $testPassword
    birth_date = $testBirthDate
} | ConvertTo-Json

Write-Host "Registrando usuario de prueba..." -ForegroundColor Gray
try {
    $registerResponse = Invoke-WebRequest `
        -Uri "http://localhost/user/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerPayload `
        -ErrorAction Stop

    Write-Host "✓ Usuario registrado exitosamente" -ForegroundColor Green
    Write-Host ""
} catch {
    # Ignorar error si el usuario ya existe
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "ℹ El usuario ya existe (esto es normal en segundas ejecuciones)" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "ERROR al registrar usuario: $_" -ForegroundColor Red
        exit 1
    }
}

# Paso 2: Probar login
Write-Host "=== Probando credenciales de login ===" -ForegroundColor Cyan
Write-Host ""

$loginPayload = @{
    username = $testUsername
    password = $testPassword
} | ConvertTo-Json

Write-Host "Iniciando sesión con:" -ForegroundColor Gray
Write-Host "  Usuario: $testUsername" -ForegroundColor Gray
Write-Host "  Contraseña: $testPassword" -ForegroundColor Gray
Write-Host ""

try {
    $loginResponse = Invoke-WebRequest `
        -Uri "http://localhost/user/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginPayload `
        -ErrorAction Stop

    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "✓ Login exitoso!" -ForegroundColor Green
    Write-Host "  Token: $($loginData.access_token.Substring(0, 20))..." -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "ERROR en el login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Paso 3: Iniciar frontend
Write-Host "=== Iniciando Frontend ===" -ForegroundColor Cyan
Write-Host ""

Set-Location "Frontend"

if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependencias de npm (primera ejecución)..." -ForegroundColor Gray
    npm install
}

Write-Host ""
Write-Host "CREDENCIALES PARA PROBAR:" -ForegroundColor Yellow
Write-Host "  Usuario: $testUsername" -ForegroundColor Cyan
Write-Host "  Contraseña: $testPassword" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando Expo dev server..." -ForegroundColor Gray
Write-Host "Presiona 'w' para abrir en navegador web o 'i' para iOS/Android" -ForegroundColor Yellow
Write-Host ""

npm start

Pop-Location
