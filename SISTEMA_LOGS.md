# Sistema de Logs - File System API

## Descripción del Sistema

Este documento describe la implementación del sistema de logs para el proyecto de File System API, desarrollado como parte de la entrega del Corte 1.

## Características Implementadas

### 1. Función Asincrónica para Registro de Logs

**Archivo**: `sistema-logs.js`

```javascript
class SistemaLogs extends EventEmitter {
    async registrarLog(metodo, url, informacionAdicional = '') {
        const fecha = new Date().toISOString();
        const logEntry = `[${fecha}] ${metodo} ${url} ${informacionAdicional}\n`;
        await fs.appendFile(this.archivoLog, logEntry, 'utf8');
    }
}
```

**Características**:
- ✅ Función asincrónica usando `async/await`
- ✅ Registro automático en cada petición HTTP
- ✅ Uso del módulo `fs` nativo de Node.js
- ✅ Integración con `EventEmitter` para eventos

### 2. Información Registrada en Logs

Cada entrada de log contiene:

- **Fecha y Hora**: Formato ISO 8601 (`2025-09-26T10:30:45.123Z`)
- **Método HTTP**: GET, POST, DELETE, etc.
- **URL Accedida**: Ruta completa de la petición
- **Información Adicional**: IP del cliente, datos extra

**Ejemplo de entrada de log**:
```
[2025-09-26T10:30:45.123Z] GET /archivos/leer?nombre=test.txt IP: ::1
[2025-09-26T10:31:02.456Z] POST /archivos/escribir IP: ::1
[2025-09-26T10:31:15.789Z] DELETE /archivos/eliminar?nombre=test.txt IP: ::1
```

### 3. Nueva URL `/leer-log`

**Endpoint**: `GET /leer-log`

**Funcionalidad**:
- Lee el archivo completo de logs (`data/log.txt`)
- Utiliza `fs.readFile()` nativo
- Accesible desde el navegador
- Respuesta en formato JSON

**Respuesta**:
```json
{
    "mensaje": "Logs leídos exitosamente",
    "archivo": "log.txt",
    "contenido": "[2025-09-26T10:30:45.123Z] GET /archivos/leer...",
    "fechaLectura": "2025-09-26T10:35:00.000Z"
}
```

### 4. Módulos Nativos Utilizados

#### File System (`fs`)
```javascript
const fs = require('fs').promises;
// Para operaciones asíncronas con archivos
await fs.appendFile(archivo, contenido, 'utf8');
await fs.readFile(archivo, 'utf8');
```

#### HTTP (`http`)
```javascript
const http = require('http');
// Crear servidor HTTP nativo
const servidor = http.createServer(app);
servidor.listen(PUERTO, callback);
```

#### Path (`path`)
```javascript
const path = require('path');
// Resolver rutas de archivos
const archivoLog = path.join(__dirname, 'data', 'log.txt');
```

#### EventEmitter (`events`)
```javascript
const { EventEmitter } = require('events');
// Para manejo de eventos del sistema
class SistemaLogs extends EventEmitter {
    emit('logRegistrado', data);
    on('errorLog', callback);
}
```

## Implementación Técnica

### 1. Estructura del Sistema

```
proyecto-fs-servicios/
├── app.js                    # Servidor principal con logs
├── sistema-logs.js          # Clase SistemaLogs
├── routes/archivo.js         # Rutas de archivos
├── data/
│   └── log.txt              # Archivo de logs generado
└── public/                  # Frontend con interfaz de logs
```

### 2. Integración en el Servidor

**Middleware de Logs**:
```javascript
// Middleware para registrar logs de cada petición
app.use(async (req, res, next) => {
    await sistemaLogs.registrarLog(req.method, req.originalUrl, `IP: ${req.ip || 'unknown'}`);
    next();
});
```

**Servidor HTTP Nativo**:
```javascript
const servidor = http.createServer(app);
servidor.on('request', (req, res) => {
    console.log(`📡 Petición recibida: ${req.method} ${req.url}`);
});
```

### 3. Rutas de Logs Implementadas

| Método | URL | Descripción |
|--------|-----|-------------|
| `GET` | `/leer-log` | Leer archivo de logs completo |
| `GET` | `/estadisticas-logs` | Obtener estadísticas de logs |

### 4. Interfaz Web

**Nuevo Componente React**: `SistemaLogs`
- Botón para leer logs completos
- Botón para ver estadísticas
- Información sobre URLs disponibles
- Lista de datos registrados en logs

## Ejemplos de Uso

### 1. Acceso desde Navegador

**URLs Disponibles**:
- `http://localhost:3000/` - Interfaz principal
- `http://localhost:3000/leer-log` - Leer logs
- `http://localhost:3000/estadisticas-logs` - Estadísticas

### 2. Uso desde Terminal

**PowerShell**:
```powershell
# Leer logs
Invoke-WebRequest -Uri "http://localhost:3000/leer-log" -Method GET

# Ver estadísticas
Invoke-WebRequest -Uri "http://localhost:3000/estadisticas-logs" -Method GET
```

**curl**:
```bash
# Leer logs
curl "http://localhost:3000/leer-log"

# Ver estadísticas
curl "http://localhost:3000/estadisticas-logs"
```

### 3. Ejemplo de Flujo Completo

1. **Iniciar servidor**: `node app.js`
2. **Acceder a interfaz**: `http://localhost:3000`
3. **Realizar operaciones**: Crear, leer, anexar, eliminar archivos
4. **Ver logs generados**: Ir a "Sistema de Logs" en la interfaz
5. **Leer logs**: Hacer clic en "Leer Logs Completos"
6. **Ver estadísticas**: Hacer clic en "Ver Estadísticas"

## Características Avanzadas

### 1. EventEmitter Integration

```javascript
// Escuchar eventos del sistema de logs
sistemaLogs.on('logRegistrado', (data) => {
    console.log(`📝 Log registrado: ${data.metodo} ${data.url}`);
});

sistemaLogs.on('errorLog', (error) => {
    console.error('❌ Error en sistema de logs:', error);
});
```

### 2. Estadísticas de Logs

**Endpoint**: `GET /estadisticas-logs`

**Información proporcionada**:
- Total de registros
- Conteo por método HTTP
- URLs únicas accedidas
- Fecha de inicio y último registro

### 3. Manejo de Errores

```javascript
try {
    const logs = await sistemaLogs.leerLogs();
    res.json({ mensaje: 'Logs leídos exitosamente', ...logs });
} catch (err) {
    if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Archivo de logs no encontrado' });
    }
    next(err);
}
```

## Cumplimiento de Requerimientos

### ✅ Requerimientos Cumplidos

1. **Función asincrónica para registro de logs** ✅
   - Implementada en `SistemaLogs.registrarLog()`
   - Se ejecuta en cada petición HTTP

2. **Información de logs** ✅
   - Fecha: Formato ISO 8601
   - Método HTTP: GET, POST, DELETE, etc.
   - URL accedida: Ruta completa

3. **Nueva URL `/leer-log`** ✅
   - Implementada con `fs.readFile()`
   - Accesible desde navegador
   - Respuesta en formato JSON

4. **Módulos nativos utilizados** ✅
   - `fs`: Operaciones con archivos
   - `http`: Servidor HTTP nativo
   - `path`: Resolución de rutas
   - `eventEmitter`: Manejo de eventos

5. **URLs accesibles desde navegador** ✅
   - Todas las rutas funcionan en navegador
   - Interfaz web integrada
   - Respuestas JSON apropiadas

## Conclusión

- Función asincrónica para registro automático
- Información completa (fecha, método, URL)
- Nueva ruta `/leer-log` funcional
- Uso exclusivo de módulos nativos de Node.js
- Accesibilidad desde navegador
- Integración completa con el sistema existente

---

**Desarrollado por**: Alejandro Taborda Sepúlveda  
**Materia**: Desarrollo - VII Semestre  
**Fecha**: Octubre 2025
