/**
 * Página de Historial de Movimientos
 *
 * Muestra el histórico completo de entradas y salidas
 * con opciones de filtrado y exportación.
 */

import { useState, useEffect } from 'react';
import { movimientosAPI } from '../services/api';
import { Calendar, Download, Filter, Car, Bike, Truck } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { DollarSign, Activity } from 'lucide-react';

/**
 * Página de Historial
 */
export default function Historial() {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    fecha_desde: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    fecha_hasta: format(new Date(), 'yyyy-MM-dd'),
    estado: '',
    placa: '',
  });

  const cargarHistorial = async (filtrosAUsar = filtros) => {
    setCargando(true);
    try {
      const response = await movimientosAPI.obtenerHistorico(filtrosAUsar);
      setMovimientos(response.data?.data?.movimientos || []);
    } catch (error) {
      toast.error('Error al cargar historial');
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltroRapido = (tipo) => {
    const hoy = new Date();
    let desde = hoy;
    let hasta = hoy;

    switch (tipo) {
      case 'hoy':
        desde = hoy;
        hasta = hoy;
        break;
      case 'semana':
        desde = startOfWeek(hoy, { weekStartsOn: 1 });
        hasta = endOfWeek(hoy, { weekStartsOn: 1 });
        break;
      case 'mes':
        desde = startOfMonth(hoy);
        hasta = endOfMonth(hoy);
        break;
      case 'ano':
        desde = startOfYear(hoy);
        hasta = endOfYear(hoy);
        break;
    }

    const nuevosFiltros = {
      ...filtros,
      fecha_desde: format(desde, 'yyyy-MM-dd'),
      fecha_hasta: format(hasta, 'yyyy-MM-dd')
    };

    setFiltros(nuevosFiltros);
    cargarHistorial(nuevosFiltros);
  };

  const calcularTotalIngresos = () => {
    return movimientos
      .filter(m => m.estado === 'finalizado')
      .reduce((acc, m) => acc + (m.total_pagar || 0), 0);
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  // Icono según tipo de vehículo
  const obtenerIcono = (tipo) => {
    switch (tipo) {
      case 'moto': return Bike;
      case 'camioneta': return Truck;
      default: return Car;
    }
  };

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    try {
      return format(new Date(fechaString), 'dd MMM yyyy', { locale: es });
    } catch {
      return fechaString;
    }
  };

  // Formatear hora
  const formatearHora = (fechaString) => {
    try {
      return format(new Date(fechaString), 'HH:mm');
    } catch {
      return '--:--';
    }
  };

  // Calcular duración
  const calcularDuracion = (entrada, salida) => {
    if (!salida) return '-';
    try {
      const diff = new Date(salida) - new Date(entrada);
      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${horas}h ${minutos}m`;
    } catch {
      return '-';
    }
  };

  const handleExportar = () => {
    if (movimientos.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const totalIngresos = calcularTotalIngresos();
    
    const headers = ['Fecha Entrada', 'Fecha Salida', 'Placa', 'Tipo', 'Plaza', 'Duración', 'Total Cobrado', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...movimientos.map(m => [
        m.fecha_entrada,
        m.fecha_salida || '',
        m.placa,
        m.vehiculo_tipo,
        m.plaza_nombre,
        calcularDuracion(m.fecha_entrada, m.fecha_salida),
        m.total_pagar || 0,
        m.estado
      ].join(',')),
      '',
      '--- RESUMEN FINANCIERO ---',
      `Rango:,${filtros.fecha_desde},al,${filtros.fecha_hasta}`,
      `Total Vehículos:,${movimientos.length}`,
      `Ingresos Totales:,${totalIngresos}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historial_parqueadero_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exportación completada');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Historial de Movimientos</h1>
          <p className="text-slate-400 mt-1">Consulta el histórico de entradas y salidas registradas</p>
        </div>
        <button onClick={handleExportar} className="btn-premium flex items-center gap-2 self-start shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.2)]">
          <Download className="w-4 h-4" />
          <span>Exportar a CSV</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-card p-6 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gpa-blue/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gpa-blue" />
            <h2 className="text-lg font-bold text-white tracking-wide">Filtros y Reportes</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => aplicarFiltroRapido('hoy')} className="px-3 py-1.5 text-xs font-bold text-white uppercase bg-white/5 hover:bg-gpa-blue/20 rounded-lg transition-colors border border-white/10">Hoy</button>
            <button onClick={() => aplicarFiltroRapido('semana')} className="px-3 py-1.5 text-xs font-bold text-white uppercase bg-white/5 hover:bg-gpa-blue/20 rounded-lg transition-colors border border-white/10">Semana</button>
            <button onClick={() => aplicarFiltroRapido('mes')} className="px-3 py-1.5 text-xs font-bold text-white uppercase bg-white/5 hover:bg-gpa-blue/20 rounded-lg transition-colors border border-white/10">Mes</button>
            <button onClick={() => aplicarFiltroRapido('ano')} className="px-3 py-1.5 text-xs font-bold text-white uppercase bg-white/5 hover:bg-gpa-blue/20 rounded-lg transition-colors border border-white/10">Año</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Desde</label>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
              <input
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
                className="glass-input pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Hasta</label>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
              <input
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => setFiltros({ ...filtros, fecha_hasta: e.target.value })}
                className="glass-input pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Placa</label>
            <input
              type="text"
              value={filtros.placa}
              onChange={(e) => setFiltros({ ...filtros, placa: e.target.value.toUpperCase() })}
              placeholder="Buscar por placa"
              className="glass-input uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="glass-input bg-[#111116] appearance-none"
            >
              <option value="">Todos los Estados</option>
              <option value="en_parqueadero">En parqueadero</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={cargarHistorial} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-gpa-blue/20 hover:border-gpa-blue/50 text-white transition-all font-bold group"
            >
              <span className="group-hover:scale-105 inline-block transition-transform">Aplicar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resumen Financiero del periodo */}
      {movimientos.length > 0 && !cargando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <div className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-500/80 font-black uppercase tracking-widest">Ingresos Totales (Periodo)</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">${calcularTotalIngresos().toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="glass-card p-5 border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Vehículos Registrados</p>
              <p className="text-3xl font-black text-white mt-1">{movimientos.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <Car className="w-6 h-6 text-slate-400" />
            </div>
          </div>
          <div className="glass-card p-5 border-gpa-blue/20 bg-gpa-blue/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gpa-blue/80 font-black uppercase tracking-widest">Ingreso Promedio</p>
              <p className="text-3xl font-black text-gpa-blue mt-1">
                ${movimientos.length > 0 ? Math.round(calcularTotalIngresos() / movimientos.filter(m => m.estado === 'finalizado').length || 1).toLocaleString() : 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gpa-blue/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-gpa-blue" />
            </div>
          </div>
        </div>
      )}

      {/* Tabla de movimientos */}
      <div className="glass-card overflow-hidden border-white/5">
        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin" />
          </div>
        ) : movimientos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vehículo</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Placa</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Plaza</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Entrada</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Salida</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Duración</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {movimientos.map((movimiento) => {
                  const Icono = obtenerIcono(movimiento.vehiculo_tipo);
                  const colorIcono = movimiento.vehiculo_tipo === 'moto' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' : 
                                    movimiento.vehiculo_tipo === 'camioneta' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 
                                    'text-gpa-blue bg-gpa-blue/10 border-gpa-blue/20';

                  return (
                    <tr key={movimiento.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorIcono}`}>
                            <Icono className="w-5 h-5" />
                          </div>
                          <span className="capitalize font-medium text-slate-300">{movimiento.vehiculo_tipo}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle font-bold text-white tracking-wide">{movimiento.placa}</td>
                      <td className="p-4 align-middle text-slate-300">{movimiento.plaza_nombre}</td>
                      <td className="p-4 align-middle">
                        <div className="text-slate-300 font-medium">{formatearFecha(movimiento.fecha_entrada)}</div>
                        <div className="text-xs text-slate-500 font-bold">{formatearHora(movimiento.fecha_entrada)}</div>
                      </td>
                      <td className="p-4 align-middle">
                        {movimiento.fecha_salida ? (
                          <>
                            <div className="text-slate-300 font-medium">{formatearFecha(movimiento.fecha_salida)}</div>
                            <div className="text-xs text-slate-500 font-bold">{formatearHora(movimiento.fecha_salida)}</div>
                          </>
                        ) : (
                          <span className="text-slate-600 font-medium">-</span>
                        )}
                      </td>
                      <td className="p-4 align-middle font-medium text-gpa-cyan">{calcularDuracion(movimiento.fecha_entrada, movimiento.fecha_salida)}</td>
                      <td className="p-4 align-middle font-bold text-white">
                        {movimiento.total_pagar ? `$${movimiento.total_pagar.toLocaleString()}` : <span className="text-slate-600">-</span>}
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                          movimiento.estado === 'finalizado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          movimiento.estado === 'en_parqueadero' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {movimiento.estado === 'finalizado' ? 'Finalizado' :
                           movimiento.estado === 'en_parqueadero' ? 'En parqueadero' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-xl font-bold text-white mb-2">No hay movimientos</p>
            <p className="text-slate-400">Ajusta los filtros o intenta con otro rango de fechas</p>
          </div>
        )}
      </div>
    </div>
  );
}
