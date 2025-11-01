# Comparación: HTTP Nativo vs Express

Este documento compara las dos implementaciones del mismo servidor: una usando módulos nativos de Node.js y otra usando Express.

## Implementaciones Disponibles

- **HTTP Nativo**: `ejemplo-servidor-basico.js` (puerto 3001)
- **Express**: `ejemplo-servidor-express.js` (puerto 3002)

## Comparación Lado a Lado

### 1. Imports/Módulos Requeridos

#### HTTP Nativo
```javascript
const http = require("http");
const url = require("url");
```
- Usa módulos nativos de Node.js
- No requiere dependencias externas

#### Express
```javascript
const express = require("express");
```
- Requiere instalar Express (`npm install express`)
- Framework que simplifica el trabajo

### 2. Creación del Servidor

#### HTTP Nativo
```javascript
const server = http.createServer((req, res) => {
    // Manejo de peticiones
});
```
- Crea el servidor explícitamente
- Callback maneja todas las peticiones

#### Express
```javascript
const app = express();
```
- Crea una instancia de la aplicación
- El servidor se crea automáticamente con `app.listen()`

### 3. Obtención de Query Parameters

#### HTTP Nativo
```javascript
const parsedUrl = url.parse(req.url, true);
const query = parsedUrl.query;
```
- **3 líneas de código**
- Parseo manual de la URL
- Requiere el módulo `url`

#### Express
```javascript
const query = req.query;
```
- **1 línea de código**
- Parseo automático
- Ya está disponible en `req.query`

### 4. Configuración de Headers y Envío de Respuesta

#### HTTP Nativo
```javascript
res.writeHead(200, {"content-type": "application/json"});
res.end(JSON.stringify({
    message: "Parametros Recibidos",
    params: query
}));
```
- **2 líneas de código**
- Headers manuales
- `JSON.stringify()` manual
- Método `res.end()` para enviar

#### Express
```javascript
res.json({
    message: "Parametros Recibidos",
    params: query
});
```
- **1 línea de código**
- Headers automáticos
- Conversión a JSON automática
- Método `res.json()` simplificado

### 5. Definición de Rutas

#### HTTP Nativo
```javascript
const server = http.createServer((req, res) => {
    // Todas las rutas se manejan aquí
    // Necesitas if/else para diferentes rutas
});
```
- Sin sistema de enrutamiento
- Manejo manual con condicionales
- Una sola función para todas las rutas

#### Express
```javascript
app.get('*', (req, res) => {
    // Manejo de ruta GET
});
```
- Sistema de enrutamiento integrado
- Métodos específicos: `.get()`, `.post()`, `.put()`, `.delete()`
- Múltiples rutas pueden definirse fácilmente

### 6. Iniciar el Servidor

#### HTTP Nativo
```javascript
server.listen(3001, () => {
    console.log("Server Running at: http://localhost:3001");
});
```
- Método directo sobre el servidor HTTP

#### Express
```javascript
app.listen(3002, () => {
    console.log("Server Running at: http://localhost:3002");
});
```
- Método sobre la aplicación Express
- Express crea el servidor HTTP internamente

## Tabla Comparativa

| Aspecto | HTTP Nativo | Express |
|---------|-------------|---------|
| **Líneas de código (funcionalidad core)** | ~12 líneas | ~8 líneas |
| **Dependencias externas** | 0 | 1 (express) |
| **Parseo de query parameters** | Manual (3 líneas) | Automático (1 línea) |
| **Headers HTTP** | Manual | Automático |
| **Conversión JSON** | Manual (`JSON.stringify()`) | Automático (`res.json()`) |
| **Enrutamiento** | Manual (if/else) | Integrado (`.get()`, `.post()`, etc.) |
| **Middleware** | No disponible | Sistema completo |
| **Curva de aprendizaje** | Mayor (conocer HTTP) | Menor (más abstracción) |
| **Control** | Total | Alto (con opciones de configuración) |
| **Rendimiento** | Ligeramente mejor | Muy similar |
| **Comunidad y recursos** | Limitados | Extensos |
| **Mejores prácticas** | Manuales | Integradas |

## Código Completo Comparado

### HTTP Nativo (ejemplo-servidor-basico.js)
```javascript
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    
    res.writeHead(200, {"content-type": "application/json"});
    res.end(JSON.stringify({
        message: "Parametros Recibidos",
        params: query
    }));
});

server.listen(3001, () => {
    console.log("Server Running at: http://localhost:3001");
});
```

### Express (ejemplo-servidor-express.js)
```javascript
const express = require("express");
const app = express();

app.get('*', (req, res) => {
    res.json({
        message: "Parametros Recibidos",
        params: req.query
    });
});

app.listen(3002, () => {
    console.log("Server Running at: http://localhost:3002");
});
```

## Ventajas y Desventajas

### HTTP Nativo

#### Ventajas ✅
- No requiere dependencias externas
- Más ligero (sin framework)
- Mejor comprensión de cómo funciona HTTP
- Control total sobre la respuesta
- Bueno para aprender fundamentos

#### Desventajas ❌
- Más código para la misma funcionalidad
- No tiene middleware incorporado
- Enrutamiento manual más tedioso
- Menos convenciones y mejores prácticas incorporadas
- Más propenso a errores (headers, parsing, etc.)

### Express

#### Ventajas ✅
- Código más limpio y legible
- Muchas características integradas (middleware, routing, etc.)
- Gran comunidad y ecosistema
- Mejores prácticas incorporadas
- Menos código para más funcionalidad
- Mejor para proyectos grandes

#### Desventajas ❌
- Requiere dependencia externa
- Mayor abstracción (puede ocultar detalles de HTTP)
- Ligeramente más pesado (pero insignificante en la práctica)

## Cuándo Usar Cada Uno

### Usa HTTP Nativo cuando:
- 🎓 Estás aprendiendo cómo funciona HTTP
- 🔧 Necesitas un microservicio muy simple y ligero
- 📦 Quieres evitar dependencias externas
- 🎯 Solo necesitas funcionalidades básicas
- ⚡ Requieres máximo control sobre cada detalle

### Usa Express cuando:
- 🚀 Estás construyendo una aplicación web real
- 📈 Necesitas escalabilidad y mantenibilidad
- 🔌 Quieres usar middleware y plugins
- 👥 Trabajas en equipo (convenciones claras)
- 🛠️ Necesitas enrutamiento complejo
- 📚 Quieres aprovechar la comunidad y recursos

## Ejecutar los Ejemplos

### Servidor HTTP Nativo
```bash
npm run ejemplo
# O directamente:
node ejemplo-servidor-basico.js
```
Servidor disponible en: `http://localhost:3001`

### Servidor Express
```bash
npm run ejemplo:express
# O directamente:
node ejemplo-servidor-express.js
```
Servidor disponible en: `http://localhost:3002`

## Pruebas

Ambos servidores responden igual a estas peticiones:

```
GET http://localhost:3001/?nombre=Juan&edad=25
GET http://localhost:3002/?nombre=Juan&edad=25
```

**Respuesta (idéntica en ambos):**
```json
{
  "message": "Parametros Recibidos",
  "params": {
    "nombre": "Juan",
    "edad": "25"
  }
}
```

## Conclusión

Ambas implementaciones son válidas y cumplen la misma funcionalidad. La elección depende del contexto:

- **Para aprender**: Empieza con HTTP nativo
- **Para producción**: Usa Express (o frameworks similares)
- **Para proyectos simples**: Ambos funcionan, Express es más conveniente
- **Para proyectos complejos**: Express es la mejor opción

Lo importante es entender cómo funciona HTTP nativo para aprovechar mejor los frameworks y depurar problemas cuando surjan.

