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
