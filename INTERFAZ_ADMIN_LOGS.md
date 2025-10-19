# Interfaz Web de Administración de Logs

## Descripción

Sistema completo de administración web para la gestión, análisis y monitoreo de logs del servidor File System API. 

## Características Principales

### **Panel de Control Principal**
- **Lectura de logs completos**: Visualización de todos los logs del sistema
- **Estadísticas en tiempo real**: Métricas y análisis de uso
- **Navegación intuitiva**: Interfaz amigable y responsiva

### **Sistema de Filtros Avanzados**
- **Filtro por método HTTP**: GET, POST, DELETE, PUT
- **Filtro por rango de fechas**: Fecha inicio y fin
- **Filtro por URL**: Búsqueda por contenido de URL
- **Combinación de filtros**: Múltiples criterios simultáneos

### **Motor de Búsqueda**
- **Búsqueda de texto libre**: Buscar cualquier término en los logs
- **Búsqueda en tiempo real**: Resultados instantáneos
- **Resaltado de resultados**: Visualización clara de coincidencias
- **Navegación por resultados**: Paginación automática

### **Herramientas de Gestión**
- **Limpieza automática**: Eliminar logs antiguos (7, 30 días)
- **Exportación de datos**: Descargar logs en JSON o CSV
- **Gestión de espacio**: Control del tamaño de archivos de log
- **Mantenimiento del sistema**: Herramientas de administración

## Funcionalidades Implementadas

### 1. **Panel de Filtros Avanzados**

```javascript
// Filtros disponibles
const filtros = {
    metodo: 'GET|POST|DELETE|PUT',
    fechaInicio: 'YYYY-MM-DD',
    fechaFin: 'YYYY-MM-DD',
    urlContiene: 'texto a buscar'
};
```

**Características**:
- ✅ Selector de método HTTP
- ✅ Campos de fecha con validación
- ✅ Campo de texto para URL
- ✅ Aplicación de filtros combinados
- ✅ Resultados en tiempo real

### 2. **Sistema de Búsqueda**

```javascript
// Búsqueda de texto libre
const buscarEnLogs = async (termino) => {
    const response = await fetch(`/buscar-logs?termino=${termino}`);
    return response.json();
};
```

**Características**:
- ✅ Búsqueda de texto libre
- ✅ Búsqueda case-insensitive
- ✅ Resultados numerados
- ✅ Resaltado de coincidencias
- ✅ Límite de resultados (paginación)

### 3. **Gestión de Logs**

```javascript
// Limpieza de logs antiguos
const limpiarLogsAntiguos = async (dias) => {
    const response = await fetch(`/limpiar-logs?dias_antiguedad=${dias}`, {
        method: 'DELETE'
    });
    return response.json();
};
```

**Características**:
- ✅ Limpieza por antigüedad (7, 30 días)
- ✅ Confirmación antes de eliminar
- ✅ Reporte de logs eliminados
- ✅ Preservación de estructura del archivo

### 4. **Exportación de Datos**

```javascript
// Exportación en múltiples formatos
const exportarLogs = async (formato) => {
    const response = await fetch(`/exportar-logs?formato=${formato}`);
    const blob = await response.blob();
    // Descarga automática del archivo
};
```

**Formatos soportados**:
- ✅ **JSON**: Estructura completa con metadatos
- ✅ **CSV**: Formato tabular para análisis
- ✅ **Descarga automática**: Sin intervención del usuario
- ✅ **Nombres de archivo**: Con fecha de exportación

## Interfaz de Usuario

### **Diseño Responsivo**
- **Desktop**: Layout de 3 columnas con paneles expandidos
- **Tablet**: Layout de 2 columnas con navegación optimizada
- **Mobile**: Layout de 1 columna con menús colapsables

### **Componentes Visuales**

#### 1. **Panel de Acciones Principales**
```html
<div className="logs-main-actions">
    <button>📖 Leer Logs Completos</button>
    <button>📈 Ver Estadísticas</button>
    <button>Volver al Menú</button>
</div>
```

#### 2. **Panel de Filtros**
```html
<div className="filters-grid">
    <div className="filter-group">
        <label>Método HTTP:</label>
        <select>GET|POST|DELETE|PUT</select>
    </div>
    <div className="filter-group">
        <label>Fecha Inicio:</label>
        <input type="date" />
    </div>
</div>
```

#### 3. **Panel de Búsqueda**
```html
<div className="search-group">
    <input placeholder="Buscar término en logs..." />
    <button>🔍 Buscar</button>
</div>
```

#### 4. **Panel de Gestión**
```html
<div className="management-actions">
    <button>🗑️ Limpiar Logs (7 días)</button>
    <button>🗑️ Limpiar Logs (30 días)</button>
    <button>📄 Exportar JSON</button>
    <button>📊 Exportar CSV</button>
</div>
```

## API Endpoints

### **Endpoints de Administración**

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/leer-log` | Leer logs completos | - |
| `GET` | `/estadisticas-logs` | Obtener estadísticas | - |
| `GET` | `/filtrar-logs` | Filtrar logs | `metodo`, `fecha_inicio`, `fecha_fin`, `url_contiene` |
| `GET` | `/buscar-logs` | Buscar en logs | `termino` |
| `DELETE` | `/limpiar-logs` | Limpiar logs antiguos | `dias_antiguedad` |
| `GET` | `/exportar-logs` | Exportar logs | `formato` (json/csv) |

### **Ejemplos de Uso**

#### Filtrar logs por método GET
```bash
curl "http://localhost:3000/filtrar-logs?metodo=GET"
```

#### Buscar logs con término específico
```bash
curl "http://localhost:3000/buscar-logs?termino=archivos"
```

#### Limpiar logs de más de 30 días
```bash
curl -X DELETE "http://localhost:3000/limpiar-logs?dias_antiguedad=30"
```

#### Exportar logs en formato CSV
```bash
curl "http://localhost:3000/exportar-logs?formato=csv" -o logs.csv
```

## Características Técnicas

### **Frontend (React)**
- **Componentes funcionales**: Hooks de React para estado
- **Manejo de estado**: useState para filtros y resultados
- **Comunicación asíncrona**: Fetch API para peticiones
- **Interfaz responsiva**: CSS Grid y Flexbox
- **Validación de formularios**: Validación en tiempo real

### **Backend (Node.js)**
- **Módulos nativos**: fs, http, path, events
- **Procesamiento asíncrono**: async/await para operaciones
- **Filtrado eficiente**: Algoritmos optimizados
- **Manejo de errores**: Respuestas HTTP apropiadas
- **Exportación de datos**: Múltiples formatos

### **Seguridad**
- **Validación de entrada**: Sanitización de parámetros
- **Límites de resultados**: Paginación automática
- **Confirmaciones**: Para operaciones destructivas
- **Manejo de errores**: Respuestas seguras

## Casos de Uso

### **1. Administrador del Sistema**
- Monitorear actividad del servidor
- Analizar patrones de uso
- Limpiar logs antiguos
- Exportar datos para análisis

### **2. Desarrollador**
- Debuggear problemas específicos
- Buscar errores en logs
- Analizar flujo de peticiones
- Verificar funcionamiento de APIs

### **3. Analista de Datos**
- Exportar logs para análisis
- Filtrar datos por criterios
- Generar reportes
- Identificar tendencias

## Mejoras Futuras

### **Funcionalidades Adicionales**
- **Gráficos en tiempo real**: Visualización de métricas
- **Alertas automáticas**: Notificaciones por patrones
- **Dashboard personalizable**: Configuración de widgets
- **Integración con bases de datos**: Almacenamiento persistente
- **Autenticación**: Sistema de usuarios y permisos

### **Optimizaciones**
- **Caché de resultados**: Mejora de rendimiento
- **Indexación**: Búsquedas más rápidas
- **Compresión**: Reducción de espacio
- **Backup automático**: Respaldo de logs

## **Características destacadas**:
- Interfaz intuitiva y responsiva
- Filtros avanzados y búsqueda
- Gestión automática de logs
- Exportación en múltiples formatos
- API REST completa
- Documentación detallada

---

**Desarrollado por**: Alejandro Taborda Sepúlveda  
**Materia**:  FullStack - VII Semestre
**Fecha**: Octubre 2025
