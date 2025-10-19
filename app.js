// app.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const SistemaLogs = require('./sistema-logs');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Inicializar sistema de logs
const sistemaLogs = new SistemaLogs();

// Limitamos tamaño del JSON por seguridad
app.use(express.json({ limit: '1mb' }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para registrar logs de cada petición
app.use(async (req, res, next) => {
    // Registrar log de la petición
    await sistemaLogs.registrarLog(req.method, req.originalUrl, `IP: ${req.ip || 'unknown'}`);
    next();
});

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

// Nueva ruta para leer logs
app.get('/leer-log', async (req, res, next) => {
    try {
        const logs = await sistemaLogs.leerLogs();
        res.json({
            mensaje: 'Logs leídos exitosamente',
            ...logs
        });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: 'Archivo de logs no encontrado' });
        }
        next(err);
    }
});

// Ruta adicional para estadísticas de logs
app.get('/estadisticas-logs', async (req, res, next) => {
    try {
        const estadisticas = await sistemaLogs.obtenerEstadisticas();
        res.json({
            mensaje: 'Estadísticas de logs obtenidas',
            estadisticas
        });
    } catch (err) {
        next(err);
    }
});

// Ruta para filtrar logs por criterios
app.get('/filtrar-logs', async (req, res, next) => {
    try {
        const { metodo, fecha_inicio, fecha_fin, url_contiene } = req.query;
        const logsFiltrados = await sistemaLogs.filtrarLogs({
            metodo,
            fechaInicio: fecha_inicio,
            fechaFin: fecha_fin,
            urlContiene: url_contiene
        });
        res.json({
            mensaje: 'Logs filtrados obtenidos',
            logs: logsFiltrados,
            filtros: { metodo, fecha_inicio, fecha_fin, url_contiene }
        });
    } catch (err) {
        next(err);
    }
});

// Ruta para buscar en logs
app.get('/buscar-logs', async (req, res, next) => {
    try {
        const { termino } = req.query;
        if (!termino) {
            return res.status(400).json({ error: 'Término de búsqueda requerido' });
        }
        const resultados = await sistemaLogs.buscarEnLogs(termino);
        res.json({
            mensaje: 'Búsqueda completada',
            termino,
            resultados,
            total: resultados.length
        });
    } catch (err) {
        next(err);
    }
});

// Ruta para limpiar logs antiguos
app.delete('/limpiar-logs', async (req, res, next) => {
    try {
        const { dias_antiguedad = 30 } = req.query;
        const resultado = await sistemaLogs.limpiarLogsAntiguos(parseInt(dias_antiguedad));
        res.json({
            mensaje: 'Logs antiguos eliminados',
            logsEliminados: resultado.logsEliminados,
            diasAntiguedad: dias_antiguedad
        });
    } catch (err) {
        next(err);
    }
});

// Ruta para exportar logs
app.get('/exportar-logs', async (req, res, next) => {
    try {
        const { formato = 'json' } = req.query;
        const exportacion = await sistemaLogs.exportarLogs(formato);
        res.setHeader('Content-Type', formato === 'csv' ? 'text/csv' : 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="logs-${new Date().toISOString().split('T')[0]}.${formato}"`);
        res.send(exportacion);
    } catch (err) {
        next(err);
    }
});

// Middleware para rutas no encontradas
app.use((req, res) => {
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
  // Crear servidor HTTP usando el módulo http nativo
  const servidor = http.createServer(app);
  
  // Configurar eventos del servidor
  servidor.on('request', (req, res) => {
    console.log(`📡 Petición recibida: ${req.method} ${req.url}`);
  });
  
  servidor.on('error', (err) => {
    console.error('Error del servidor:', err);
  });
  
  // Escuchar en el puerto
  servidor.listen(PUERTO, () => {
    console.log(`🚀 Servidor HTTP escuchando en http://localhost:${PUERTO}`);
    console.log(`📝 Sistema de logs activado`);
    console.log(`🔗 Rutas disponibles:`);
    console.log(`   - http://localhost:${PUERTO}/ (Interfaz web)`);
    console.log(`   - http://localhost:${PUERTO}/leer-log (Leer logs)`);
    console.log(`   - http://localhost:${PUERTO}/estadisticas-logs (Estadísticas)`);
    console.log(`   - http://localhost:${PUERTO}/archivos/* (API de archivos)`);
  });
  
  // Configurar eventos del sistema de logs
  sistemaLogs.on('logRegistrado', (data) => {
    console.log(`📝 Log registrado: ${data.metodo} ${data.url}`);
  });
  
  sistemaLogs.on('errorLog', (error) => {
    console.error('❌ Error en sistema de logs:', error);
  });
});
