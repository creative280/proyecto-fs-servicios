# Sistema de Gestión de Archivos con Node.js

## Descripción del Proyecto

Este es un proyecto que implementa un sistema web para el manejo de archivos usando **Node.js**, **Express** y **React**, basado en lo que se ha aprendido con el profesor German en Programación V, El objetivo es crear una aplicación que permita realizar operaciones básicas del sistema de archivos a través de una interfaz web.

## Características Principales

- **Backend**: API REST con Node.js y Express
- **Frontend**: Interfaz web con React
- **Operaciones**: Crear, leer, anexar y eliminar archivos
- **Seguridad**: Validación básica de rutas
- **Interfaz**: Diseño simple y funcional

## Instalación y Configuración

### Requisitos Previos
- Node.js (versión 14 o superior)
- Navegador web moderno

### Pasos para Ejecutar

1. **Instalar las dependencias:**
```bash
npm install
```

2. **Ejecutar el servidor:**
```bash
node app.js
```

3. **Abrir en el navegador:**
```
http://localhost:3000
```

## Funcionalidades Implementadas

### Operaciones de Archivos
1. **Escribir archivo**: Crear un archivo nuevo o sobrescribir uno existente
2. **Leer archivo**: Ver el contenido de un archivo
3. **Anexar contenido**: Añadir texto al final de un archivo
4. **Eliminar archivo**: Borrar un archivo del sistema
5. **Listar archivos**: Ver todos los archivos disponibles

### Interfaz de Usuario
- Menú principal con opciones claras
- Formularios simples para cada operación
- Mensajes de confirmación y error
- Lista de archivos con botones de acción
- Diseño responsivo básico

## Estructura del Proyecto

```
proyecto-fs-servicios/
├── app.js                    # Servidor principal (Backend)
├── routes/
│   └── archivo.js           # Rutas de la API
├── public/                  # Archivos del Frontend
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── styles.css      # Estilos CSS
│   └── js/
│       └── app.js          # Código React
├── data/                   # Carpeta donde se guardan los archivos
└── package.json           # Dependencias del proyecto
```

## API Endpoints

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| POST | `/archivos/escribir` | Crear o sobrescribir un archivo |
| GET | `/archivos/leer` | Leer el contenido de un archivo |
| POST | `/archivos/anexar` | Añadir contenido a un archivo |
| DELETE | `/archivos/eliminar` | Eliminar un archivo |
| GET | `/archivos/listar` | Obtener lista de archivos |

## Cómo Usar la Aplicación

### Paso a Paso
1. **Ejecutar el servidor**: `node app.js`
2. **Abrir el navegador**: Ir a `http://localhost:3000`
3. **Seleccionar operación**: Elegir una opción del menú principal
4. **Completar formulario**: Llenar los campos requeridos
5. **Ver resultado**: Observar la respuesta de la operación

### Ejemplo Práctico
1. Seleccionar "Escribir Archivo"
2. Escribir nombre: `mi-archivo.txt`
3. Escribir contenido: `Hola mundo desde Node.js`
4. Hacer clic en "Escribir Archivo"
5. Ver mensaje de confirmación

## Aspectos Técnicos

### Backend (Node.js + Express)
- **app.js**: Configuración del servidor
- **routes/archivo.js**: Definición de las rutas de la API
- **Módulo fs**: Para operaciones con archivos
- **Validación**: Prevención de acceso a rutas no permitidas

### Frontend (React)
- **Componente App**: Manejo del estado principal
- **Formularios**: Para cada operación de archivos
- **Estilos**: CSS básico y responsivo
- **Comunicación**: Fetch API para conectar con el backend

## Consideraciones de Seguridad

- **Validación de rutas**: Solo permite acceso a la carpeta `data/`
- **Límite de tamaño**: Archivos máximo de 1MB
- **Codificación**: UTF-8 para caracteres especiales
- **Manejo de errores**: Respuestas HTTP apropiadas vistas en clase

## Conclusión

Este proyecto demuestra los conocimientos adquiridos en clase de programación V a nivel de frontend, como a nivel backend con node js y los parametros, manejo de errores y metosos vistos en clase.

---

**Proyecto desarrollado por Alejandro Taborda Sepúlveda**
Proyecto de manejo de archivos con Node JS
