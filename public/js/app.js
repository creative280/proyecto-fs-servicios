const { useState, useEffect } = React;

// Componente principal de la aplicación
function App() {
    const [currentView, setCurrentView] = useState('menu');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Cargar lista de archivos al iniciar
    useEffect(() => {
        loadFiles();
    }, []);

    // Función para cargar la lista de archivos
    const loadFiles = async () => {
        try {
            const response = await fetch('/archivos/listar');
            const data = await response.json();
            setFiles(data.archivos || []);
        } catch (error) {
            console.error('Error al cargar archivos:', error);
        }
    };

    // Función para manejar respuestas de la API
    const handleApiResponse = async (response, operation) => {
        const data = await response.json();
        
        if (response.ok) {
            setResult({
                type: 'success',
                title: `${operation} exitoso`,
                data: data
            });
        } else {
            setResult({
                type: 'error',
                title: `Error en ${operation}`,
                data: data
            });
        }
        
        // Recargar lista de archivos
        loadFiles();
    };

    // Función para escribir archivo
    const writeFile = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch('/archivos/escribir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            await handleApiResponse(response, 'Escritura');
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error de conexión',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para leer archivo
    const readFile = async (fileName) => {
        setLoading(true);
        try {
            const response = await fetch(`/archivos/leer?nombre=${encodeURIComponent(fileName)}`);
            await handleApiResponse(response, 'Lectura');
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error de conexión',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para anexar contenido
    const appendFile = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch('/archivos/anexar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            await handleApiResponse(response, 'Anexado');
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error de conexión',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar archivo
    const deleteFile = async (fileName) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${fileName}"?`)) {
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`/archivos/eliminar?nombre=${encodeURIComponent(fileName)}`, {
                method: 'DELETE'
            });
            await handleApiResponse(response, 'Eliminación');
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error de conexión',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para leer logs
    const leerLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch('/leer-log');
            await handleApiResponse(response, 'Lectura de Logs');
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error de conexión',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener estadísticas de logs
    const obtenerEstadisticasLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch('/estadisticas-logs');
            await handleApiResponse(response, 'Estadísticas de Logs');
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error de conexión',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Componente del menú principal
    const MenuPrincipal = () => (
        <div className="fade-in">
            <div className="header">
                <h1>🗂️ File System API</h1>
                <p>Gestión completa de archivos con Node.js y Express</p>
            </div>
            
            <div className="menu">
                <div className="menu-item" onClick={() => setCurrentView('write')}>
                    <span className="icon">📝</span>
                    <h3>Escribir Archivo</h3>
                    <p>Crear un nuevo archivo o sobrescribir uno existente</p>
                </div>
                
                <div className="menu-item" onClick={() => setCurrentView('read')}>
                    <span className="icon">📖</span>
                    <h3>Leer Archivo</h3>
                    <p>Ver el contenido de un archivo existente</p>
                </div>
                
                <div className="menu-item" onClick={() => setCurrentView('append')}>
                    <span className="icon">➕</span>
                    <h3>Anexar Contenido</h3>
                    <p>Añadir contenido al final de un archivo</p>
                </div>
                
                <div className="menu-item" onClick={() => setCurrentView('delete')}>
                    <span className="icon">🗑️</span>
                    <h3>Eliminar Archivo</h3>
                    <p>Eliminar un archivo del sistema</p>
                </div>
                
                <div className="menu-item" onClick={() => setCurrentView('list')}>
                    <span className="icon">📋</span>
                    <h3>Listar Archivos</h3>
                    <p>Ver todos los archivos disponibles</p>
                </div>
                
                <div className="menu-item" onClick={() => setCurrentView('logs')}>
                    <span className="icon">📊</span>
                    <h3>Sistema de Logs</h3>
                    <p>Ver logs del servidor y estadísticas</p>
                </div>
            </div>
        </div>
    );

    // Componente para escribir archivo
    const WriteFileForm = () => {
        const [formData, setFormData] = useState({ nombre: '', contenido: '' });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (formData.nombre.trim() && formData.contenido.trim()) {
                writeFile(formData);
            }
        };

        return (
            <div className="fade-in">
                <div className="form-container">
                    <h2>📝 Escribir Archivo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre del archivo:</label>
                            <input
                                type="text"
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                placeholder="ejemplo.txt"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contenido">Contenido del archivo:</label>
                            <textarea
                                id="contenido"
                                value={formData.contenido}
                                onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                                placeholder="Escribe aquí el contenido del archivo..."
                                required
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Escribiendo...' : 'Escribir Archivo'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setCurrentView('menu')}>
                            Volver al Menú
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Componente para leer archivo
    const ReadFileForm = () => {
        const [fileName, setFileName] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (fileName.trim()) {
                readFile(fileName);
            }
        };

        return (
            <div className="fade-in">
                <div className="form-container">
                    <h2>📖 Leer Archivo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fileName">Nombre del archivo:</label>
                            <input
                                type="text"
                                id="fileName"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="ejemplo.txt"
                                required
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Leyendo...' : 'Leer Archivo'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setCurrentView('menu')}>
                            Volver al Menú
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Componente para anexar contenido
    const AppendFileForm = () => {
        const [formData, setFormData] = useState({ nombre: '', contenido: '' });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (formData.nombre.trim() && formData.contenido.trim()) {
                appendFile(formData);
            }
        };

        return (
            <div className="fade-in">
                <div className="form-container">
                    <h2>➕ Anexar Contenido</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="appendNombre">Nombre del archivo:</label>
                            <input
                                type="text"
                                id="appendNombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                placeholder="ejemplo.txt"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="appendContenido">Contenido a anexar:</label>
                            <textarea
                                id="appendContenido"
                                value={formData.contenido}
                                onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                                placeholder="Contenido que se añadirá al final del archivo..."
                                required
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Anexando...' : 'Anexar Contenido'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setCurrentView('menu')}>
                            Volver al Menú
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Componente para eliminar archivo
    const DeleteFileForm = () => {
        const [fileName, setFileName] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (fileName.trim()) {
                deleteFile(fileName);
            }
        };

        return (
            <div className="fade-in">
                <div className="form-container">
                    <h2>🗑️ Eliminar Archivo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="deleteFileName">Nombre del archivo:</label>
                            <input
                                type="text"
                                id="deleteFileName"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="ejemplo.txt"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-danger" disabled={loading}>
                            {loading ? 'Eliminando...' : 'Eliminar Archivo'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setCurrentView('menu')}>
                            Volver al Menú
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Componente para listar archivos
    const FileList = () => (
        <div className="fade-in">
            <div className="form-container">
                <h2>📋 Lista de Archivos</h2>
                <button className="btn btn-success" onClick={loadFiles}>
                    🔄 Actualizar Lista
                </button>
                <button className="btn btn-secondary" onClick={() => setCurrentView('menu')}>
                    Volver al Menú
                </button>
                
                <div className="file-list">
                    {files.length === 0 ? (
                        <p>No hay archivos disponibles</p>
                    ) : (
                        files.map((file, index) => (
                            <div key={index} className="file-item">
                                <span className="file-name">📄 {file}</span>
                                <div className="file-actions">
                                    <button 
                                        className="btn btn-small" 
                                        onClick={() => readFile(file)}
                                    >
                                        Leer
                                    </button>
                                    <button 
                                        className="btn btn-small btn-danger" 
                                        onClick={() => deleteFile(file)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // Estado para la administración de logs
    const [logsData, setLogsData] = useState(null);
    const [filtros, setFiltros] = useState({
        metodo: '',
        fechaInicio: '',
        fechaFin: '',
        urlContiene: ''
    });
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState(null);

    // Función para filtrar logs
    const filtrarLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtros.metodo) params.append('metodo', filtros.metodo);
            if (filtros.fechaInicio) params.append('fecha_inicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fecha_fin', filtros.fechaFin);
            if (filtros.urlContiene) params.append('url_contiene', filtros.urlContiene);

            const response = await fetch(`/filtrar-logs?${params}`);
            const data = await response.json();
            setLogsData(data);
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error al filtrar logs',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para buscar en logs
    const buscarEnLogs = async () => {
        if (!terminoBusqueda.trim()) return;
        
        setLoading(true);
        try {
            const response = await fetch(`/buscar-logs?termino=${encodeURIComponent(terminoBusqueda)}`);
            const data = await response.json();
            setResultadosBusqueda(data);
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error en búsqueda',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para limpiar logs antiguos
    const limpiarLogsAntiguos = async (dias = 30) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar logs más antiguos que ${dias} días?`)) {
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`/limpiar-logs?dias_antiguedad=${dias}`, { method: 'DELETE' });
            const data = await response.json();
            setResult({
                type: 'success',
                title: 'Logs limpiados',
                data: data
            });
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error al limpiar logs',
                data: { error: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para exportar logs
    const exportarLogs = async (formato) => {
        try {
            const response = await fetch(`/exportar-logs?formato=${formato}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `logs-${new Date().toISOString().split('T')[0]}.${formato}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            setResult({
                type: 'error',
                title: 'Error al exportar',
                data: { error: error.message }
            });
        }
    };

    // Componente para sistema de logs avanzado
    const SistemaLogs = () => (
        <div className="fade-in">
            <div className="logs-admin-container">
                <h2>📊 Administración Avanzada de Logs</h2>
                <p>Sistema completo para gestión, análisis y administración de logs del servidor</p>
                
                {/* Panel de acciones principales */}
                <div className="logs-main-actions">
                    <button className="btn btn-primary" onClick={leerLogs} disabled={loading}>
                        {loading ? 'Cargando...' : '📖 Leer Logs Completos'}
                    </button>
                    <button className="btn btn-info" onClick={obtenerEstadisticasLogs} disabled={loading}>
                        {loading ? 'Cargando...' : '📈 Ver Estadísticas'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setCurrentView('menu')}>
                        Volver al Menú
                    </button>
                </div>

                {/* Panel de filtros */}
                <div className="logs-filters">
                    <h3>🔍 Filtros Avanzados</h3>
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Método HTTP:</label>
                            <select 
                                value={filtros.metodo} 
                                onChange={(e) => setFiltros({...filtros, metodo: e.target.value})}
                            >
                                <option value="">Todos</option>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PUT">PUT</option>
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <label>Fecha Inicio:</label>
                            <input 
                                type="date" 
                                value={filtros.fechaInicio}
                                onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>Fecha Fin:</label>
                            <input 
                                type="date" 
                                value={filtros.fechaFin}
                                onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>URL contiene:</label>
                            <input 
                                type="text" 
                                placeholder="ej: /archivos"
                                value={filtros.urlContiene}
                                onChange={(e) => setFiltros({...filtros, urlContiene: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <button className="btn btn-success" onClick={filtrarLogs} disabled={loading}>
                        🔍 Aplicar Filtros
                    </button>
                </div>

                {/* Panel de búsqueda */}
                <div className="logs-search">
                    <h3>🔎 Búsqueda en Logs</h3>
                    <div className="search-group">
                        <input 
                            type="text" 
                            placeholder="Buscar término en logs..."
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && buscarEnLogs()}
                        />
                        <button className="btn btn-info" onClick={buscarEnLogs} disabled={loading || !terminoBusqueda.trim()}>
                            🔍 Buscar
                        </button>
                    </div>
                </div>

                {/* Panel de gestión */}
                <div className="logs-management">
                    <h3>⚙️ Gestión de Logs</h3>
                    <div className="management-actions">
                        <button className="btn btn-warning" onClick={() => limpiarLogsAntiguos(7)}>
                            🗑️ Limpiar Logs (7 días)
                        </button>
                        <button className="btn btn-warning" onClick={() => limpiarLogsAntiguos(30)}>
                            🗑️ Limpiar Logs (30 días)
                        </button>
                        <button className="btn btn-success" onClick={() => exportarLogs('json')}>
                            📄 Exportar JSON
                        </button>
                        <button className="btn btn-success" onClick={() => exportarLogs('csv')}>
                            📊 Exportar CSV
                        </button>
                    </div>
                </div>

                {/* Resultados de filtros */}
                {logsData && (
                    <div className="logs-results">
                        <h3>📋 Resultados de Filtros</h3>
                        <div className="results-info">
                            <p><strong>Total encontrados:</strong> {logsData.logs?.length || 0}</p>
                            <p><strong>Filtros aplicados:</strong> {JSON.stringify(logsData.filtros)}</p>
                        </div>
                        <div className="logs-list">
                            {logsData.logs?.slice(0, 50).map((log, index) => (
                                <div key={index} className="log-entry">
                                    <span className="log-fecha">{log.fecha}</span>
                                    <span className="log-metodo">{log.metodo}</span>
                                    <span className="log-url">{log.url}</span>
                                </div>
                            ))}
                            {logsData.logs?.length > 50 && (
                                <p className="more-results">... y {logsData.logs.length - 50} más</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Resultados de búsqueda */}
                {resultadosBusqueda && (
                    <div className="search-results">
                        <h3>🔎 Resultados de Búsqueda</h3>
                        <div className="results-info">
                            <p><strong>Término:</strong> "{resultadosBusqueda.termino}"</p>
                            <p><strong>Total encontrados:</strong> {resultadosBusqueda.total}</p>
                        </div>
                        <div className="logs-list">
                            {resultadosBusqueda.resultados?.slice(0, 20).map((resultado, index) => (
                                <div key={index} className="log-entry search-result">
                                    <span className="log-numero">#{resultado.numero}</span>
                                    <span className="log-linea">{resultado.linea}</span>
                                </div>
                            ))}
                            {resultadosBusqueda.resultados?.length > 20 && (
                                <p className="more-results">... y {resultadosBusqueda.resultados.length - 20} más</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Información del sistema */}
                <div className="logs-info">
                    <h3>🔗 URLs de Administración Disponibles:</h3>
                    <ul>
                        <li><code>GET /leer-log</code> - Leer archivo de logs completo</li>
                        <li><code>GET /estadisticas-logs</code> - Obtener estadísticas de logs</li>
                        <li><code>GET /filtrar-logs</code> - Filtrar logs por criterios</li>
                        <li><code>GET /buscar-logs</code> - Buscar término en logs</li>
                        <li><code>DELETE /limpiar-logs</code> - Limpiar logs antiguos</li>
                        <li><code>GET /exportar-logs</code> - Exportar logs (JSON/CSV)</li>
                    </ul>
                    
                    <h3>📝 Información Registrada en Logs:</h3>
                    <ul>
                        <li>✅ Fecha y hora de cada petición</li>
                        <li>✅ Método HTTP utilizado (GET, POST, DELETE)</li>
                        <li>✅ URL accedida</li>
                        <li>✅ Dirección IP del cliente</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    // Renderizado condicional
    const renderCurrentView = () => {
        switch (currentView) {
            case 'write':
                return <WriteFileForm />;
            case 'read':
                return <ReadFileForm />;
            case 'append':
                return <AppendFileForm />;
            case 'delete':
                return <DeleteFileForm />;
            case 'list':
                return <FileList />;
            case 'logs':
                return <SistemaLogs />;
            default:
                return <MenuPrincipal />;
        }
    };

    return (
        <div className="container">
            {renderCurrentView()}
            
            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Procesando...</p>
                </div>
            )}
            
            {result && (
                <div className={`result ${result.type}`}>
                    <h4>{result.title}</h4>
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    <button className="btn btn-secondary" onClick={() => setResult(null)}>
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
}

// Renderizar la aplicación
ReactDOM.render(<App />, document.getElementById('root'));
