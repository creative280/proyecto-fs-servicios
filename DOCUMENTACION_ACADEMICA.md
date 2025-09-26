# Documentación Técnica - Sistema de Gestión de Archivos

## Información del Proyecto

**Materia**: Desarrollo Full Stack  
**Alumno**: Alejandro Taborda Sepúlveda
**Tecnologías**: Node.js, Express, React  
**Objetivo**: Implementar operaciones básicas del File System como servicios web de acuerdo a lo visto en clase y los videotutoriales proporcionados.

## Introducción

Este es un proyecto que implementa un sistema web para el manejo de archivos usando **Node.js**, **Express** y **React**, basado en lo que se ha aprendido con el profesor German en Programación V, El objetivo es crear una aplicación que permita realizar operaciones básicas del sistema de archivos a través de una interfaz web.

## Objetivos de Aprendizaje

- Comprender el funcionamiento del módulo fs de Node.js
- Implementar una API REST con Express
- Crear una interfaz web con React
- Aplicar conceptos de seguridad básica en aplicaciones web
- Integrar frontend y backend en una aplicación completa

## Arquitectura del Sistema

### Backend (Servidor)
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web para crear APIs
- **File System**: Módulo nativo para operaciones con archivos
- **Middleware**: Para validación y manejo de errores

### Frontend (Cliente)
- **React**: Biblioteca para interfaces de usuario
- **HTML/CSS**: Estructura y estilos
- **JavaScript**: Lógica de la aplicación
- **Fetch API**: Para comunicación con el servidor

## Implementación de Funcionalidades

### 1. Escribir Archivo (writeFile)

**Propósito**: Crear un archivo nuevo o sobrescribir uno existente.

**Implementación**:
```javascript
// Backend - routes/archivo.js
router.post('/escribir', async (req, res, next) => {
    try {
        const { nombre, contenido } = req.body;
        const ruta = resolverRutaSegura(nombre);
        await fs.writeFile(ruta, contenido ?? '', 'utf8');
        res.status(201).json({ mensaje: 'Archivo escrito', archivo: nombre });
    } catch (err) {
        // Manejo de errores
    }
});
```

**Frontend**:
```javascript
// React Component
const writeFile = async (formData) => {
    const response = await fetch('/archivos/escribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const result = await response.json();
};
```

### 2. Leer Archivo (readFile)

**Propósito**: Obtener el contenido de un archivo existente.

**Implementación**:
```javascript
// Backend
router.get('/leer', async (req, res, next) => {
    try {
        const nombre = req.query.nombre;
        const ruta = resolverRutaSegura(nombre);
        const contenido = await fs.readFile(ruta, 'utf8');
        res.json({ archivo: nombre, contenido });
    } catch (err) {
        if (err.code === 'ENOENT') return res.status(404).json({ error: 'Archivo no encontrado' });
    }
});
```

### 3. Anexar Contenido (appendFile)

**Propósito**: Añadir contenido al final de un archivo existente.

**Implementación**:
```javascript
// Backend
router.post('/anexar', async (req, res, next) => {
    try {
        const { nombre, contenido } = req.body;
        const ruta = resolverRutaSegura(nombre);
        await fs.appendFile(ruta, contenido ?? '', 'utf8');
        res.json({ mensaje: 'Contenido anexado', archivo: nombre });
    } catch (err) {
        // Manejo de errores
    }
});
```

### 4. Eliminar Archivo (unlink)

**Propósito**: Eliminar un archivo del sistema.

**Implementación**:
```javascript
// Backend
router.delete('/eliminar', async (req, res, next) => {
    try {
        const nombre = req.query.nombre;
        const ruta = resolverRutaSegura(nombre);
        await fs.unlink(ruta);
        res.json({ mensaje: 'Archivo eliminado', archivo: nombre });
    } catch (err) {
        if (err.code === 'ENOENT') return res.status(404).json({ error: 'Archivo no encontrado' });
    }
});
```

## Medidas de Seguridad Implementadas

### 1. Validación de Rutas
```javascript
function resolverRutaSegura(nombreArchivo) {
    // Validar que el nombre sea válido
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
    
    // Construir ruta segura
    const ruta = path.join(carpetaBase, nombreArchivo);
    const rutaResuelta = path.resolve(ruta);
    
    // Prevenir directory traversal
    const prefijo = carpetaBase.endsWith(path.sep) ? carpetaBase : carpetaBase + path.sep;
    if (!rutaResuelta.startsWith(prefijo)) {
        throw { status: 400, message: 'Ruta fuera del directorio permitido' };
    }
    
    return rutaResuelta;
}
```

### 2. Límites de Tamaño
```javascript
// En app.js
app.use(express.json({ limit: '1mb' }));

// Validación adicional en cada endpoint
if (contenido && contenido.length > 1000000) {
    return res.status(400).json({ error: 'El contenido es demasiado grande (máximo 1MB)' });
}
```

### 3. Manejo de Errores Mejorado
- **Validación de campos**: Verificación de campos requeridos
- **Códigos de error específicos**: 400, 403, 404, 413, 500, 507
- **Mensajes descriptivos**: Errores claros y específicos
- **Logging mejorado**: Registro detallado de errores
- **Manejo de permisos**: Detección de problemas de acceso
- **Validación de rutas**: Prevención de directory traversal

### 4. Tipos de Errores Manejados
- **400 Bad Request**: Campos faltantes, nombres inválidos, contenido muy grande
- **403 Forbidden**: Sin permisos para leer/escribir/eliminar archivos
- **404 Not Found**: Archivo no encontrado, ruta no existe
- **413 Payload Too Large**: Archivo demasiado grande
- **500 Internal Server Error**: Errores del servidor
- **507 Insufficient Storage**: Espacio en disco insuficiente

## Estructura de Componentes React

### Componente Principal (App)
```javascript
function App() {
    const [currentView, setCurrentView] = useState('menu');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    // Lógica para manejar operaciones de archivos
}
```

### Componentes de Formularios
- **WriteFileForm**: Para crear archivos
- **ReadFileForm**: Para leer archivos
- **AppendFileForm**: Para anexar contenido
- **DeleteFileForm**: Para eliminar archivos
- **FileList**: Para mostrar lista de archivos

## Flujo de Datos

1. **Usuario interactúa** con la interfaz React
2. **Frontend envía** petición HTTP al backend
3. **Backend procesa** la solicitud y ejecuta operación fs
4. **Sistema de archivos** realiza la operación
5. **Backend responde** con resultado
6. **Frontend actualiza** la interfaz con el resultado

## Consideraciones de Desarrollo

### Ventajas del Enfoque
- **Separación de responsabilidades**: Backend y frontend independientes
- **API RESTful**: Fácil de extender y mantener
- **React**: Interfaz reactiva y moderna
- **Seguridad**: Validación de rutas implementada

### Limitaciones Actuales
- Solo maneja archivos de texto
- No hay autenticación de usuarios
- Interfaz básica sin características avanzadas
- No hay sistema de carpetas

### Posibles Mejoras
- Implementar autenticación
- Añadir subida de archivos binarios
- Crear sistema de permisos
- Implementar búsqueda de archivos
- Añadir historial de cambios

## Conclusiones

Este proyecto demuestra la implementación exitosa de un sistema de gestión de archivos utilizando tecnologías web modernas. Se lograron los objetivos de aprendizaje:

1. **Comprensión del módulo fs**: Se implementaron las 4 operaciones principales
2. **API REST**: Se creó una API funcional con Express
3. **Interfaz React**: Se desarrolló una interfaz web interactiva
4. **Seguridad básica**: Se implementaron medidas de protección
5. **Integración**: Se logró la comunicación efectiva entre frontend y backend

El proyecto sirve como base para futuras implementaciones más complejas y demuestra el conocimiento práctico de desarrollo full-stack.

## Referencias

- [Documentación oficial de Node.js](https://nodejs.org/docs/)
- [Guía de Express.js](https://expressjs.com/)
- [Documentación de React](https://reactjs.org/docs/)
- [Módulo File System de Node.js](https://nodejs.org/api/fs.html)

---

**Proyecto desarrollado para 7mo semestre de Ingeniería de Software**  
**Fecha**: Septiembre 2025  
**Autor**: Alejandro Taborda Sepúlveda
