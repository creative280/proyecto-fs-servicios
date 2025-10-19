// sistema-logs.js
const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class SistemaLogs extends EventEmitter {
    constructor() {
        super();
        this.archivoLog = path.join(__dirname, 'data', 'log.txt');
        this.inicializarLog();
    }

    // Inicializar el archivo de log si no existe
    async inicializarLog() {
        try {
            await fs.access(this.archivoLog);
        } catch (error) {
            // Si el archivo no existe, crearlo con un encabezado
            const encabezado = `=== SISTEMA DE LOGS ===
Fecha de inicio: ${new Date().toISOString()}
Servidor: File System API
========================================

`;
            await fs.writeFile(this.archivoLog, encabezado, 'utf8');
        }
    }

    // Función asincrónica para registrar logs
    async registrarLog(metodo, url, informacionAdicional = '') {
        try {
            const fecha = new Date().toISOString();
            const logEntry = `[${fecha}] ${metodo} ${url} ${informacionAdicional}\n`;
            
            // Escribir al archivo de log
            await fs.appendFile(this.archivoLog, logEntry, 'utf8');
            
            // Emitir evento para notificar el registro
            this.emit('logRegistrado', {
                fecha,
                metodo,
                url,
                informacionAdicional
            });
            
            console.log(`📝 Log registrado: ${metodo} ${url}`);
        } catch (error) {
            console.error('Error al registrar log:', error);
            this.emit('errorLog', error);
        }
    }

    // Leer el archivo de logs completo
    async leerLogs() {
        try {
            const contenido = await fs.readFile(this.archivoLog, 'utf8');
            return {
                archivo: 'log.txt',
                contenido,
                fechaLectura: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error al leer logs:', error);
            throw error;
        }
    }

    // Obtener estadísticas de logs
    async obtenerEstadisticas() {
        try {
            const contenido = await fs.readFile(this.archivoLog, 'utf8');
            const lineas = contenido.split('\n').filter(linea => linea.trim() && !linea.startsWith('='));
            
            const estadisticas = {
                totalRegistros: lineas.length,
                metodos: {},
                urlsUnicas: new Set(),
                fechaInicio: null,
                fechaUltimo: null
            };

            lineas.forEach(linea => {
                const match = linea.match(/\[(.*?)\] (\w+) (.*?)(?:\s|$)/);
                if (match) {
                    const [, fecha, metodo, url] = match;
                    
                    // Contar métodos
                    estadisticas.metodos[metodo] = (estadisticas.metodos[metodo] || 0) + 1;
                    
                    // URLs únicas
                    estadisticas.urlsUnicas.add(url);
                    
                    // Fechas
                    if (!estadisticas.fechaInicio) estadisticas.fechaInicio = fecha;
                    estadisticas.fechaUltimo = fecha;
                }
            });

            estadisticas.urlsUnicas = Array.from(estadisticas.urlsUnicas);
            return estadisticas;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    // Filtrar logs por criterios
    async filtrarLogs(filtros) {
        try {
            const contenido = await fs.readFile(this.archivoLog, 'utf8');
            const lineas = contenido.split('\n').filter(linea => linea.trim() && !linea.startsWith('='));
            
            let logsFiltrados = lineas.map(linea => {
                const match = linea.match(/\[(.*?)\] (\w+) (.*?)(?:\s|$)/);
                if (match) {
                    const [, fecha, metodo, url] = match;
                    return { fecha, metodo, url, linea };
                }
                return null;
            }).filter(log => log !== null);

            // Aplicar filtros
            if (filtros.metodo) {
                logsFiltrados = logsFiltrados.filter(log => log.metodo === filtros.metodo);
            }

            if (filtros.fechaInicio) {
                const fechaInicio = new Date(filtros.fechaInicio);
                logsFiltrados = logsFiltrados.filter(log => new Date(log.fecha) >= fechaInicio);
            }

            if (filtros.fechaFin) {
                const fechaFin = new Date(filtros.fechaFin);
                logsFiltrados = logsFiltrados.filter(log => new Date(log.fecha) <= fechaFin);
            }

            if (filtros.urlContiene) {
                logsFiltrados = logsFiltrados.filter(log => 
                    log.url.toLowerCase().includes(filtros.urlContiene.toLowerCase())
                );
            }

            return logsFiltrados;
        } catch (error) {
            console.error('Error al filtrar logs:', error);
            throw error;
        }
    }

    // Buscar en logs
    async buscarEnLogs(termino) {
        try {
            const contenido = await fs.readFile(this.archivoLog, 'utf8');
            const lineas = contenido.split('\n').filter(linea => linea.trim() && !linea.startsWith('='));
            
            const resultados = lineas
                .map((linea, index) => ({ linea, numero: index + 1 }))
                .filter(({ linea }) => linea.toLowerCase().includes(termino.toLowerCase()));

            return resultados;
        } catch (error) {
            console.error('Error al buscar en logs:', error);
            throw error;
        }
    }

    // Limpiar logs antiguos
    async limpiarLogsAntiguos(diasAntiguedad) {
        try {
            const contenido = await fs.readFile(this.archivoLog, 'utf8');
            const lineas = contenido.split('\n');
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);
            
            let logsEliminados = 0;
            const lineasActualizadas = lineas.filter(linea => {
                if (linea.startsWith('=') || !linea.trim()) return true;
                
                const match = linea.match(/\[(.*?)\]/);
                if (match) {
                    const fechaLog = new Date(match[1]);
                    if (fechaLog < fechaLimite) {
                        logsEliminados++;
                        return false;
                    }
                }
                return true;
            });

            await fs.writeFile(this.archivoLog, lineasActualizadas.join('\n'), 'utf8');
            return { logsEliminados };
        } catch (error) {
            console.error('Error al limpiar logs antiguos:', error);
            throw error;
        }
    }

    // Exportar logs
    async exportarLogs(formato) {
        try {
            const contenido = await fs.readFile(this.archivoLog, 'utf8');
            const lineas = contenido.split('\n').filter(linea => linea.trim() && !linea.startsWith('='));
            
            if (formato === 'csv') {
                const csvHeader = 'Fecha,Método,URL,Información Adicional\n';
                const csvData = lineas.map(linea => {
                    const match = linea.match(/\[(.*?)\] (\w+) (.*?)(?:\s(.*))?$/);
                    if (match) {
                        const [, fecha, metodo, url, infoAdicional = ''] = match;
                        return `"${fecha}","${metodo}","${url}","${infoAdicional}"`;
                    }
                    return '';
                }).filter(row => row).join('\n');
                return csvHeader + csvData;
            } else {
                // JSON
                const logs = lineas.map(linea => {
                    const match = linea.match(/\[(.*?)\] (\w+) (.*?)(?:\s(.*))?$/);
                    if (match) {
                        const [, fecha, metodo, url, infoAdicional = ''] = match;
                        return { fecha, metodo, url, infoAdicional };
                    }
                    return null;
                }).filter(log => log !== null);
                
                return JSON.stringify({ logs, fechaExportacion: new Date().toISOString() }, null, 2);
            }
        } catch (error) {
            console.error('Error al exportar logs:', error);
            throw error;
        }
    }
}

module.exports = SistemaLogs;
