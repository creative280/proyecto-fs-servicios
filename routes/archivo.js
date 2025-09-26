// routes/archivos.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

module.exports = function(carpetaBase) {
  const router = express.Router();

  // Helper: valida y devuelve la ruta absoluta del archivo dentro de carpetaBase
  function resolverRutaSegura(nombreArchivo) {
    if (!nombreArchivo || typeof nombreArchivo !== 'string') {
      throw { status: 400, message: 'nombreArchivo inválido' };
    }
    
    // Validar longitud del nombre
    if (nombreArchivo.length > 255) {
      throw { status: 400, message: 'Nombre de archivo demasiado largo' };
    }
    
    // Validar caracteres no permitidos
    if (nombreArchivo.includes('..') || nombreArchivo.includes('/') || nombreArchivo.includes('\\')) {
      throw { status: 400, message: 'Nombre de archivo contiene caracteres no permitidos' };
    }
    
    // Evitar que el usuario pase rutas relativas con ../
    const ruta = path.join(carpetaBase, nombreArchivo);
    const rutaResuelta = path.resolve(ruta);

    // Comprobación de traversal: la ruta resuelta debe empezar por carpetaBase + separador
    const prefijo = carpetaBase.endsWith(path.sep) ? carpetaBase : carpetaBase + path.sep;
    if (!rutaResuelta.startsWith(prefijo)) {
      throw { status: 400, message: 'Ruta fuera del directorio permitido' };
    }
    return rutaResuelta;
  }

  // 1) Escribir archivo (sobrescribe o crea)
  // POST /archivos/escribir
  // Body: { "nombre": "archivo.txt", "contenido": "hola" }
  router.post('/escribir', async (req, res, next) => {
    try {
      const { nombre, contenido } = req.body;
      
      // Validar que se envíen los campos requeridos
      if (!nombre) {
        return res.status(400).json({ error: 'El campo nombre es requerido' });
      }
      
      // Validar tamaño del contenido
      if (contenido && contenido.length > 1000000) { // 1MB
        return res.status(400).json({ error: 'El contenido es demasiado grande (máximo 1MB)' });
      }
      
      const ruta = resolverRutaSegura(nombre);
      await fs.writeFile(ruta, contenido ?? '', 'utf8');
      res.status(201).json({ mensaje: 'Archivo escrito', archivo: nombre });
    } catch (err) {
      if (err && err.status) return res.status(err.status).json({ error: err.message });
      if (err.code === 'ENOSPC') return res.status(507).json({ error: 'Espacio en disco insuficiente' });
      if (err.code === 'EACCES') return res.status(403).json({ error: 'Sin permisos para escribir el archivo' });
      next(err);
    }
  });

  // 2) Leer archivo
  // GET /archivos/leer?nombre=archivo.txt
  router.get('/leer', async (req, res, next) => {
    try {
      const nombre = req.query.nombre;
      
      // Validar que se proporcione el nombre
      if (!nombre) {
        return res.status(400).json({ error: 'El parámetro nombre es requerido' });
      }
      
      const ruta = resolverRutaSegura(nombre);
      const contenido = await fs.readFile(ruta, 'utf8');
      res.json({ archivo: nombre, contenido });
    } catch (err) {
      // si el archivo no existe, enviamos 404
      if (err && err.code === 'ENOENT') return res.status(404).json({ error: 'Archivo no encontrado' });
      if (err && err.status) return res.status(err.status).json({ error: err.message });
      if (err.code === 'EACCES') return res.status(403).json({ error: 'Sin permisos para leer el archivo' });
      if (err.code === 'EISDIR') return res.status(400).json({ error: 'El nombre especificado es un directorio, no un archivo' });
      next(err);
    }
  });

  // 3) Anexar (append)
  // POST /archivos/anexar
  // Body: { "nombre": "archivo.txt", "contenido": "texto a anexar" }
  router.post('/anexar', async (req, res, next) => {
    try {
      const { nombre, contenido } = req.body;
      
      // Validar que se envíen los campos requeridos
      if (!nombre) {
        return res.status(400).json({ error: 'El campo nombre es requerido' });
      }
      
      // Validar tamaño del contenido
      if (contenido && contenido.length > 1000000) { // 1MB
        return res.status(400).json({ error: 'El contenido es demasiado grande (máximo 1MB)' });
      }
      
      const ruta = resolverRutaSegura(nombre);
      // fs.appendFile crea el archivo si no existe
      await fs.appendFile(ruta, contenido ?? '', 'utf8');
      res.json({ mensaje: 'Contenido anexado', archivo: nombre });
    } catch (err) {
      if (err && err.status) return res.status(err.status).json({ error: err.message });
      if (err.code === 'ENOSPC') return res.status(507).json({ error: 'Espacio en disco insuficiente' });
      if (err.code === 'EACCES') return res.status(403).json({ error: 'Sin permisos para escribir el archivo' });
      next(err);
    }
  });

  // 4) Eliminar (unlink)
  // DELETE /archivos/eliminar?nombre=archivo.txt
  router.delete('/eliminar', async (req, res, next) => {
    try {
      const nombre = req.query.nombre;
      
      // Validar que se proporcione el nombre
      if (!nombre) {
        return res.status(400).json({ error: 'El parámetro nombre es requerido' });
      }
      
      const ruta = resolverRutaSegura(nombre);
      await fs.unlink(ruta);
      res.json({ mensaje: 'Archivo eliminado', archivo: nombre });
    } catch (err) {
      if (err && err.code === 'ENOENT') return res.status(404).json({ error: 'Archivo no encontrado' });
      if (err && err.status) return res.status(err.status).json({ error: err.message });
      if (err.code === 'EACCES') return res.status(403).json({ error: 'Sin permisos para eliminar el archivo' });
      if (err.code === 'EISDIR') return res.status(400).json({ error: 'El nombre especificado es un directorio, no un archivo' });
      next(err);
    }
  });

  // Opcional: listar archivos (GET /archivos/listar)
  router.get('/listar', async (req, res, next) => {
    try {
      const lista = await fs.readdir(carpetaBase);
      res.json({ carpeta: carpetaBase, archivos: lista });
    } catch (err) {
      if (err.code === 'EACCES') return res.status(403).json({ error: 'Sin permisos para acceder al directorio' });
      if (err.code === 'ENOENT') return res.status(404).json({ error: 'Directorio no encontrado' });
      next(err);
    }
  });

  return router;
};
