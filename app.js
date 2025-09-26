// app.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PUERTO = process.env.PORT || 3000;

// Limitamos tamaño del JSON por seguridad
app.use(express.json({ limit: '1mb' }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Directorio base donde guardaremos archivos
const carpetaBase = path.resolve(__dirname, 'data');

// Asegurarnos de que exista la carpeta 'data' antes de arrancar
async function inicializar() {
  try {
    await fs.mkdir(carpetaBase, { recursive: true });
    console.log('Carpeta data lista en:', carpetaBase);
  } catch (err) {
    console.error('No se pudo crear la carpeta data:', err);
    process.exit(1);
  }
}

// Montamos las rutas
const rutasArchivos = require('./routes/archivo')(carpetaBase); // pasamos carpetaBase
app.use('/archivos', rutasArchivos);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    mensaje: 'La ruta solicitada no existe',
    ruta: req.originalUrl,
    metodo: req.method
  });
});

// Middleware para manejo de errores mejorado
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  
  // Si ya se envió una respuesta, no enviar otra
  if (res.headersSent) {
    return next(err);
  }
  
  // Manejar diferentes tipos de errores
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'El archivo es demasiado grande' });
  }
  
  // Error genérico del servidor
  res.status(500).json({ 
    error: 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
});

inicializar().then(() => {
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
});
