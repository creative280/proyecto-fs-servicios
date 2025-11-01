// ejemplo-servidor-express.js
// Ejemplo de servidor HTTP usando Express.js
// Este código muestra cómo crear un servidor equivalente al ejemplo básico pero usando Express

// Importar Express (framework web para Node.js)
const express = require("express");

// Crear una instancia de la aplicación Express
const app = express();

// Configurar Express para que parsee automáticamente los query parameters
// En Express, los query parameters ya vienen parseados en req.query automáticamente
// No necesitamos hacer url.parse() manualmente

// Definir un middleware para manejar todas las peticiones (cualquier ruta y método)
// app.use() captura todas las rutas que llegue al servidor, independientemente del método HTTP
// Es equivalente a usar '*' en versiones anteriores de Express, pero compatible con Express 5
app.use((req, res) => {
    // En Express, los query parameters ya están disponibles en req.query
    // No necesitamos parsear la URL manualmente como en el ejemplo básico
    // Ejemplo: si la URL es "/?nombre=Juan&edad=25" o "/cualquier/ruta?nombre=Juan&edad=25"
    // req.query será automáticamente: { nombre: 'Juan', edad: '25' }
    const query = req.query;

    // En Express, podemos usar res.json() que automáticamente:
    // 1. Establece el content-type a application/json
    // 2. Convierte el objeto a JSON con JSON.stringify()
    // 3. Envía la respuesta y cierra la conexión
    // Equivalente a: res.writeHead(200, {"content-type": "application/json"}) + res.end(JSON.stringify(...))
    res.json({
        message: "Parametros Recibidos",
        params: query
    });
});

// Iniciar el servidor en el puerto 3002
// (Usamos 3002 para no interferir con el servidor Express principal en 3000 ni el básico en 3001)
// app.listen() crea el servidor HTTP internamente, lo inicia y lo devuelve
const server = app.listen(3002, () => {
    console.log("================================================");
    console.log("Servidor Express iniciado correctamente");
    console.log("================================================");
    console.log("📍 Servidor corriendo en: http://localhost:3002");
    console.log("📝 Ejemplos de uso:");
    console.log("   - http://localhost:3002/?nombre=Juan");
    console.log("   - http://localhost:3002/?nombre=Juan&edad=25");
    console.log("   - http://localhost:3002/?nombre=Juan&edad=25&ciudad=Madrid");
    console.log("================================================");
});

// Manejo de errores del servidor
// app.listen() devuelve el servidor HTTP, por lo que podemos escuchar sus eventos
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: El puerto 3002 ya está en uso.`);
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
        console.log('✅ Servidor Express cerrado correctamente');
        process.exit(0);
    });
});

