# Explicación del Servidor HTTP Básico con Node.js

## Introducción

Este documento explica cómo funciona un servidor HTTP básico creado con los módulos nativos de Node.js, sin usar frameworks como Express.

## Componentes del Código

### 1. Módulos Requeridos

```javascript
const http = require("http");
const url = require("url");
```

- **`http`**: Módulo nativo de Node.js que proporciona funcionalidades para crear servidores y clientes HTTP.
- **`url`**: Módulo nativo que permite parsear URLs y trabajar con sus componentes (protocolo, host, path, query parameters, etc.).

### 2. Creación del Servidor

```javascript
const server = http.createServer((req, res) => {
    // Código del manejador de peticiones
});
```

- **`http.createServer()`**: Método que crea un servidor HTTP.
- Recibe un callback que se ejecuta cada vez que llega una petición.
- **`req`** (request): Objeto que representa la petición HTTP entrante (URL, headers, método, etc.).
- **`res`** (response): Objeto que representa la respuesta HTTP que enviaremos.

### 3. Parseo de la URL

```javascript
const parsedUrl = url.parse(req.url, true);
const query = parsedUrl.query;
```

- **`req.url`**: Contiene la URL de la petición (ej: `/ruta?nombre=Juan&edad=25`).
- **`url.parse(req.url, true)`**: Parsea la URL y devuelve un objeto con sus componentes.
  - El segundo parámetro `true` indica que también queremos parsear los query parameters.
- **`parsedUrl.query`**: Objeto que contiene los query parameters como pares clave-valor.
  - Ejemplo: Si la URL es `/?nombre=Juan&edad=25`, `query` será `{ nombre: 'Juan', edad: '25' }`.

### 4. Configuración de la Respuesta HTTP

```javascript
res.writeHead(200, {"content-type": "application/json"});
```

- **`res.writeHead()`**: Establece el código de estado HTTP y los headers de la respuesta.
  - **Primer parámetro (200)**: Código de estado HTTP (200 = OK).
  - **Segundo parámetro**: Objeto con los headers HTTP.
    - `"content-type": "application/json"`: Indica que la respuesta será JSON.

### 5. Envío de la Respuesta

```javascript
res.end(JSON.stringify({
    message: "Parametros Recibidos",
    params: query
}));
```

- **`JSON.stringify()`**: Convierte un objeto JavaScript a una cadena JSON.
- **`res.end()`**: Envía la respuesta al cliente y cierra la conexión.
  - Puede recibir datos como parámetro (que será el cuerpo de la respuesta).

### 6. Iniciar el Servidor

```javascript
server.listen(3000, () => {
    console.log("Server Running at: http://localhost:3000");
});
```

- **`server.listen()`**: Inicia el servidor para que escuche en un puerto específico.
  - **Primer parámetro (3000)**: Puerto donde escuchará el servidor.
  - **Segundo parámetro**: Callback que se ejecuta cuando el servidor está listo.

## Flujo Completo

1. El servidor escucha en el puerto 3000.
2. Cuando llega una petición HTTP:
   - Se parsea la URL para extraer query parameters.
   - Se establece el código de estado y headers de respuesta.
   - Se envía una respuesta JSON con los parámetros recibidos.
3. El servidor queda listo para recibir más peticiones.

## Ejemplo de Uso

### Petición
```
GET http://localhost:3000/?nombre=Juan&edad=25&ciudad=Madrid
```

### Respuesta
```json
{
  "message": "Parametros Recibidos",
  "params": {
    "nombre": "Juan",
    "edad": "25",
    "ciudad": "Madrid"
  }
}
```

## Diferencias con Express

| Aspecto | HTTP Nativo | Express |
|---------|------------|---------|
| Enrutamiento | Manual con `if/else` | Router con métodos `.get()`, `.post()`, etc. |
| Query Parameters | `url.parse()` | Automático en `req.query` |
| Middleware | No disponible | Sistema de middleware |
| JSON Parsing | Manual | `express.json()` |
| Headers | Manual | Automático y fácil |
| Complejidad | Baja para casos simples | Mayor flexibilidad y características |

## Ventajas del HTTP Nativo

- ✅ No requiere dependencias externas
- ✅ Más ligero (sin framework)
- ✅ Mejor comprensión de cómo funciona HTTP
- ✅ Control total sobre la respuesta

## Desventajas

- ❌ Más código para funcionalidades complejas
- ❌ No tiene middleware incorporado
- ❌ Enrutamiento manual más tedioso
- ❌ Menos convenciones y mejores prácticas incorporadas

## Cuándo Usar Cada Uno

- **HTTP Nativo**: Para servidores muy simples, microservicios ligeros, o para aprender cómo funciona HTTP.
- **Express**: Para aplicaciones web más complejas que requieren enrutamiento, middleware, y otras funcionalidades avanzadas.

