# Manual de Uso desde Terminal - File System API

## Descripción

Profesor en este manual te muestra cómo usar la API de gestión de archivos directamente desde la terminal usando diferentes herramientas como `curl`, PowerShell y otros comandos, como lo visto en clase y los videotutoriales de youtube que nos ha compartido en el classroom.

## Requisitos Previos

- Servidor ejecutándose en `http://localhost:3000`
- Herramientas de terminal disponibles:
  - **Windows**: PowerShell, cmd, o Git Bash
  - **Linux/Mac**: curl, wget

## 1. Verificar que el Servidor Esté Funcionando

### PowerShell (Windows)
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
```

### curl (Linux/Mac/Windows con Git Bash)
```bash
curl http://localhost:3000
```

**Respuesta esperada**: Código 200 con contenido HTML

## 2. Operaciones de Archivos

### A) Escribir Archivo (writeFile)

#### PowerShell
```powershell
# Crear un archivo nuevo
Invoke-WebRequest -Uri "http://localhost:3000/archivos/escribir" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"nombre": "ejemplo.txt", "contenido": "Hola mundo desde PowerShell!"}'

# Crear archivo con contenido más largo
$body = @{
    nombre = "mi-documento.txt"
    contenido = "Este es un documento de prueba.`nSegunda línea.`nTercera línea."
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/archivos/escribir" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

#### curl
```bash
# Crear archivo básico
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d '{"nombre": "ejemplo.txt", "contenido": "Hola mundo desde curl!"}'

# Crear archivo con múltiples líneas
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "config.json", 
    "contenido": "{\n  \"servidor\": \"localhost\",\n  \"puerto\": 3000,\n  \"activo\": true\n}"
  }'
```

**Respuesta esperada**:
```json
{
  "mensaje": "Archivo escrito",
  "archivo": "ejemplo.txt"
}
```

### B) Leer Archivo (readFile)

#### PowerShell
```powershell
# Leer archivo existente
Invoke-WebRequest -Uri "http://localhost:3000/archivos/leer?nombre=ejemplo.txt" -Method GET

# Leer archivo con caracteres especiales
Invoke-WebRequest -Uri "http://localhost:3000/archivos/leer?nombre=mi-documento.txt" -Method GET
```

#### curl
```bash
# Leer archivo básico
curl "http://localhost:3000/archivos/leer?nombre=ejemplo.txt"

# Leer archivo con espacios en el nombre (usar URL encoding)
curl "http://localhost:3000/archivos/leer?nombre=mi%20documento.txt"
```

**Respuesta esperada**:
```json
{
  "archivo": "ejemplo.txt",
  "contenido": "Hola mundo desde PowerShell!"
}
```

### C) Anexar Contenido (appendFile)

#### PowerShell
```powershell
# Añadir contenido al final
Invoke-WebRequest -Uri "http://localhost:3000/archivos/anexar" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"nombre": "ejemplo.txt", "contenido": "\nNueva línea añadida!"}'

# Añadir múltiples líneas
$appendBody = @{
    nombre = "mi-documento.txt"
    contenido = "`n`n--- Actualización ---`nFecha: $(Get-Date)`nUsuario: Estudiante"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/archivos/anexar" -Method POST -Headers @{"Content-Type"="application/json"} -Body $appendBody
```

#### curl
```bash
# Añadir una línea
curl -X POST http://localhost:3000/archivos/anexar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "ejemplo.txt", "contenido": "\nNueva línea añadida!"}'

# Añadir contenido con formato
curl -X POST http://localhost:3000/archivos/anexar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "log.txt", 
    "contenido": "\n\n--- Log Entry ---\nTimestamp: 2025-09-26\nAction: File modified\nStatus: Success"
  }'
```

**Respuesta esperada**:
```json
{
  "mensaje": "Contenido anexado",
  "archivo": "ejemplo.txt"
}
```

### D) Eliminar Archivo (unlink)

#### PowerShell
```powershell
# Eliminar archivo
Invoke-WebRequest -Uri "http://localhost:3000/archivos/eliminar?nombre=ejemplo.txt" -Method DELETE

# Eliminar archivo con confirmación
$fileName = "archivo-temp.txt"
Write-Host "Eliminando archivo: $fileName"
Invoke-WebRequest -Uri "http://localhost:3000/archivos/eliminar?nombre=$fileName" -Method DELETE
```

#### curl
```bash
# Eliminar archivo básico
curl -X DELETE "http://localhost:3000/archivos/eliminar?nombre=ejemplo.txt"

# Eliminar archivo con espacios
curl -X DELETE "http://localhost:3000/archivos/eliminar?nombre=mi%20documento.txt"
```

**Respuesta esperada**:
```json
{
  "mensaje": "Archivo eliminado",
  "archivo": "ejemplo.txt"
}
```

### E) Listar Archivos

#### PowerShell
```powershell
# Obtener lista de archivos
Invoke-WebRequest -Uri "http://localhost:3000/archivos/listar" -Method GET

# Guardar resultado en variable
$response = Invoke-WebRequest -Uri "http://localhost:3000/archivos/listar" -Method GET
$files = ($response.Content | ConvertFrom-Json).archivos
Write-Host "Archivos encontrados: $($files.Count)"
$files | ForEach-Object { Write-Host "- $_" }
```

#### curl
```bash
# Listar archivos
curl "http://localhost:3000/archivos/listar"

# Listar y formatear salida
curl -s "http://localhost:3000/archivos/listar" | jq '.archivos[]'
```

**Respuesta esperada**:
```json
{
  "carpeta": "C:\\ruta\\completa\\a\\data",
  "archivos": ["ejemplo.txt", "mi-documento.txt", "config.json"]
}
```

## 3. Ejemplos Prácticos Completos

### Ejemplo 1: Flujo Completo de Gestión de Archivos

#### PowerShell
```powershell
# 1. Crear archivo
Write-Host "1. Creando archivo..."
Invoke-WebRequest -Uri "http://localhost:3000/archivos/escribir" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"nombre": "flujo-completo.txt", "contenido": "Inicio del flujo de trabajo"}'

# 2. Leer archivo
Write-Host "2. Leyendo archivo..."
$readResponse = Invoke-WebRequest -Uri "http://localhost:3000/archivos/leer?nombre=flujo-completo.txt" -Method GET
$content = ($readResponse.Content | ConvertFrom-Json).contenido
Write-Host "Contenido: $content"

# 3. Anexar contenido
Write-Host "3. Añadiendo contenido..."
Invoke-WebRequest -Uri "http://localhost:3000/archivos/anexar" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"nombre": "flujo-completo.txt", "contenido": "\nPaso 2: Contenido añadido"}'

# 4. Leer archivo actualizado
Write-Host "4. Leyendo archivo actualizado..."
$readResponse2 = Invoke-WebRequest -Uri "http://localhost:3000/archivos/leer?nombre=flujo-completo.txt" -Method GET
$content2 = ($readResponse2.Content | ConvertFrom-Json).contenido
Write-Host "Contenido actualizado: $content2"

# 5. Eliminar archivo
Write-Host "5. Eliminando archivo..."
Invoke-WebRequest -Uri "http://localhost:3000/archivos/eliminar?nombre=flujo-completo.txt" -Method DELETE
```

#### Bash/curl
```bash
#!/bin/bash
echo "=== Flujo Completo de Gestión de Archivos ==="

# 1. Crear archivo
echo "1. Creando archivo..."
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d '{"nombre": "flujo-completo.txt", "contenido": "Inicio del flujo de trabajo"}'

# 2. Leer archivo
echo "2. Leyendo archivo..."
curl "http://localhost:3000/archivos/leer?nombre=flujo-completo.txt"

# 3. Anexar contenido
echo "3. Añadiendo contenido..."
curl -X POST http://localhost:3000/archivos/anexar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "flujo-completo.txt", "contenido": "\nPaso 2: Contenido añadido"}'

# 4. Leer archivo actualizado
echo "4. Leyendo archivo actualizado..."
curl "http://localhost:3000/archivos/leer?nombre=flujo-completo.txt"

# 5. Eliminar archivo
echo "5. Eliminando archivo..."
curl -X DELETE "http://localhost:3000/archivos/eliminar?nombre=flujo-completo.txt"
```

### Ejemplo 2: Crear Archivo de Configuración

#### PowerShell
```powershell
# Crear archivo de configuración JSON
$config = @{
    servidor = "localhost"
    puerto = 3000
    baseDatos = @{
        host = "localhost"
        nombre = "mi_base_datos"
        usuario = "admin"
    }
    configuracion = @{
        debug = $true
        version = "1.0.0"
    }
} | ConvertTo-Json -Depth 3

$body = @{
    nombre = "config.json"
    contenido = $config
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/archivos/escribir" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

#### curl
```bash
# Crear archivo de configuración
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "config.json",
    "contenido": "{\n  \"servidor\": \"localhost\",\n  \"puerto\": 3000,\n  \"baseDatos\": {\n    \"host\": \"localhost\",\n    \"nombre\": \"mi_base_datos\"\n  }\n}"
  }'
```

### Ejemplo 3: Sistema de Logs

#### PowerShell
```powershell
# Función para añadir log
function Add-Log {
    param($mensaje)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "`n[$timestamp] $mensaje"
    
    $body = @{
        nombre = "sistema.log"
        contenido = $logEntry
    } | ConvertTo-Json
    
    Invoke-WebRequest -Uri "http://localhost:3000/archivos/anexar" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
}

# Usar la función
Add-Log "Sistema iniciado"
Add-Log "Usuario conectado"
Add-Log "Operación completada"

# Leer logs
Invoke-WebRequest -Uri "http://localhost:3000/archivos/leer?nombre=sistema.log" -Method GET
```

## 4. Manejo de Errores

### Errores Comunes y Soluciones

#### Archivo no encontrado (404)
```bash
# Intentar leer archivo que no existe
curl "http://localhost:3000/archivos/leer?nombre=archivo-inexistente.txt"

# Respuesta:
# {"error":"Archivo no encontrado"}
```

#### Nombre de archivo inválido (400)
```bash
# Intentar usar nombre inválido
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d '{"nombre": "", "contenido": "test"}'

# Respuesta:
# {"error":"El campo nombre es requerido"}
```

#### Ruta no permitida (400)
```bash
# Intentar acceder fuera del directorio permitido
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d '{"nombre": "../../archivo-secreto.txt", "contenido": "hack"}'

# Respuesta:
# {"error":"Nombre de archivo contiene caracteres no permitidos"}
```

#### Contenido demasiado grande (400)
```bash
# Intentar crear archivo muy grande
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d '{"nombre": "grande.txt", "contenido": "x".repeat(1000001)}'

# Respuesta:
# {"error":"El contenido es demasiado grande (máximo 1MB)"}
```

#### Sin permisos (403)
```bash
# Si no hay permisos para escribir
# Respuesta:
# {"error":"Sin permisos para escribir el archivo"}
```

#### Espacio en disco insuficiente (507)
```bash
# Si no hay espacio en disco
# Respuesta:
# {"error":"Espacio en disco insuficiente"}
```

#### Ruta no encontrada (404)
```bash
# Intentar acceder a ruta inexistente
curl "http://localhost:3000/ruta-inexistente"

# Respuesta:
# {
#   "error": "Ruta no encontrada",
#   "mensaje": "La ruta solicitada no existe",
#   "ruta": "/ruta-inexistente",
#   "metodo": "GET"
# }
```

## 5. Scripts de Automatización

### Script PowerShell para Backup
```powershell
# backup-files.ps1
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = "backup-$timestamp.txt"

# Obtener lista de archivos
$response = Invoke-WebRequest -Uri "http://localhost:3000/archivos/listar" -Method GET
$files = ($response.Content | ConvertFrom-Json).archivos

# Crear archivo de backup
$backupContent = "Backup realizado el $(Get-Date)`n`nArchivos encontrados:`n"
foreach ($file in $files) {
    $backupContent += "- $file`n"
}

$body = @{
    nombre = $backupFile
    contenido = $backupContent
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/archivos/escribir" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body

Write-Host "Backup creado: $backupFile"
```

### Script Bash para Monitoreo
```bash
#!/bin/bash
# monitor-files.sh

echo "=== Monitoreo de Archivos ==="

# Obtener lista de archivos
echo "Archivos actuales:"
curl -s "http://localhost:3000/archivos/listar" | jq '.archivos[]'

# Crear archivo de monitoreo
curl -X POST http://localhost:3000/archivos/escribir \
  -H "Content-Type: application/json" \
  -d "{
    \"nombre\": \"monitor-$(date +%Y%m%d-%H%M%S).txt\",
    \"contenido\": \"Monitoreo realizado el $(date)\nEstado: OK\nArchivos: $(curl -s 'http://localhost:3000/archivos/listar' | jq '.archivos | length')\"
  }"
```

## 6. Solución de Problemas

### El servidor no responde
```bash
# Verificar si el servidor está ejecutándose
curl http://localhost:3000
# Si no responde, ejecutar: node app.js
```

### Error de conexión
```bash
# Verificar que el puerto 3000 esté libre
netstat -an | grep 3000
```

### Archivos no se crean
```bash
# Verificar permisos de la carpeta data
ls -la data/
```

---

**Manual creado por Alejandro Taborda Sepúlveda**  
**Fecha**: Septiembre 2025
