// ejemplo-servidor-basico.js
// Ejemplo de servidor HTTP básico usando módulos nativos de Node.js
// Este código demuestra cómo crear un servidor sin usar frameworks como Express

// Importar módulos nativos de Node.js
const http = require("http");
const url = require("url");

// Crear el servidor HTTP
// El callback se ejecuta cada vez que llega una petición
const server = http.createServer((req, res) => {

    // Parsear la URL de la petición
    // req.url contiene la URL completa de la petición (ej: "/?nombre=Juan&edad=25")
    // El segundo parámetro 'true' indica que queremos parsear también los query parameters
    const parsedUrl = url.parse(req.url, true);

    // Extraer los query parameters (parámetros de la URL)
    // Ejemplo: si la URL es "/?nombre=Juan&edad=25"
    // query será: { nombre: 'Juan', edad: '25' }
    const query = parsedUrl.query;

    // Configurar la respuesta HTTP
    // writeHead establece el código de estado y los headers
    // 200 = código de estado OK
    // "content-type": "application/json" = indica que la respuesta será JSON
    res.writeHead(200, {"content-type": "application/json"});

    // Enviar la respuesta y cerrar la conexión
    // JSON.stringify convierte un objeto JavaScript a una cadena JSON
    // res.end() envía los datos y cierra la conexión
    res.end(JSON.stringify({
        message: "Parametros Recibidos",
        params: query
    }));
});

// Iniciar el servidor en el puerto 3001
// (Usamos 3001 para no interferir con el servidor Express principal en 3000)
// El callback se ejecuta cuando el servidor está listo para recibir peticiones
server.listen(3001, () => {
    console.log("================================================");
    console.log("Servidor HTTP Básico iniciado correctamente");
    console.log("================================================");
    console.log("📍 Servidor corriendo en: http://localhost:3001");
    console.log("📝 Ejemplos de uso:");
    console.log("   - http://localhost:3001/?nombre=Juan");
    console.log("   - http://localhost:3001/?nombre=Juan&edad=25");
    console.log("   - http://localhost:3001/?nombre=Juan&edad=25&ciudad=Madrid");
    console.log("================================================");
});

// Manejo de errores del servidor
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: El puerto 3001 ya está en uso.`);
        console.error(`   Por favor, cierra la aplicación que está usando ese puerto o cambia el puerto en el código.`);
    } else {
        console.error('❌ Error del servidor:', err);
    }
    process.exit(1);
});

// Manejo de señales para cerrar el servidor correctamente
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

