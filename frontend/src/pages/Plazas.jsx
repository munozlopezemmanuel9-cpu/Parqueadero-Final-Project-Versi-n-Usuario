/**
 * Página de Gestión de Plazas
 *
 * Muestra visualmente el estado del parqueadero
 * con todas las plazas y su ocupación.
 */

import { useState, useEffect } from 'react';
import { plazasAPI } from '../services/api';
import { Car, Bike, Truck, Accessibility, RefreshCw, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Tarjeta individual de plaza
 */
function PlazaCard({ plaza, onEditar, onEliminar }) {
  // Icono según tipo de plaza
  const iconos = {
    carro: { icono: Car, color: 'text-gpa-blue', bg: 'bg-gpa-blue/10', border: 'border-gpa-blue/20' },
    moto: { icono: Bike, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    camioneta: { icono: Truck, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    discapacitado: { icono: Accessibility, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  };

  const { icono: Icono, color, bg, border } = iconos[plaza.tipo] || iconos.carro;

  // Colores según estado
  const estados = {
    libre: { bg: 'bg-green-500/5', border: 'border-green-500/20', text: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.1)]' },
    ocupada: { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
    mantenimiento: { bg: 'bg-yellow-500/5', border: 'border-yellow-500/20', text: 'text-yellow-400', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.1)]' },
  };

  const estado = estados[plaza.estado] || estados.libre;

  return (
    <div className={`relative p-5 glass-card ${estado.bg} ${estado.border} ${estado.glow} transition-all hover:scale-[1.02] hover:border-white/20 group`}>
      {/* Header de la plaza */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${border} border`}>
            <Icono className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-wide">{plaza.nombre}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{plaza.tipo}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${estado.border} ${estado.text} ${estado.bg}`}>
          {plaza.estado === 'libre' ? 'Libre' : plaza.estado === 'ocupada' ? 'Ocupada' : 'Mantenimiento'}
        </span>
      </div>

      {/* Tarifa */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <p className="text-sm text-slate-400">
          <span className="font-bold text-white">${plaza.tarifa_por_hora.toLocaleString()}</span> /hora
        </p>

        {/* Acciones */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditar(plaza)}
            className="p-2 bg-white/5 hover:bg-gpa-blue/20 text-slate-300 hover:text-gpa-blue rounded-lg border border-white/5 transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEliminar(plaza.id)}
            className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg border border-white/5 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Indicador visual de estado */}
      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
        plaza.estado === 'libre' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' :
        plaza.estado === 'ocupada' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]'
      }`} />
    </div>
  );
}

/**
 * Modal para crear o editar plaza
 */
function ModalPlaza({ abierto, plaza, onClose, onGuardar }) {
  const [datos, setDatos] = useState({
    nombre: '',
    tipo: 'carro',
    estado: 'libre',
    tarifa_por_hora: 5000,
    activa: true
  });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (plaza) {
      setDatos(plaza);
    } else {
      setDatos({
        nombre: '',
        tipo: 'carro',
        estado: 'libre',
        tarifa_por_hora: 5000,
        activa: true
      });
    }
  }, [plaza, abierto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await onGuardar(datos);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error al guardar plaza');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card bg-[#0a0a0c]/80 border-white/10 w-full max-w-md overflow-hidden animate-fade-in shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{plaza ? 'Editar Plaza' : 'Nueva Plaza'}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Nombre / Código de Plaza</label>
            <input
              type="text"
              required
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value.toUpperCase() })}
              className="glass-input"
              placeholder="Ej: A-01"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Tipo de Vehículo</label>
            <select
              value={datos.tipo}
              onChange={(e) => setDatos({ ...datos, tipo: e.target.value })}
              className="glass-input bg-[#111116] appearance-none"
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="camioneta">Camioneta</option>
              <option value="discapacitado">Discapacitado</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Tarifa por Hora</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
              <input
                type="number"
                required
                value={datos.tarifa_por_hora}
                onChange={(e) => setDatos({ ...datos, tarifa_por_hora: Number(e.target.value) })}
                className="glass-input pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Estado Inicial</label>
            <select
              value={datos.estado}
              onChange={(e) => setDatos({ ...datos, estado: e.target.value })}
              className="glass-input bg-[#111116] appearance-none"
            >
              <option value="libre">Libre</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="ocupada">Ocupada (Manual)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="btn-premium w-full mt-6"
          >
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Guardando...
              </span>
            ) : 'Guardar Plaza'}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Página de Plazas
 */
export default function Plazas() {
  const [plazas, setPlazas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState({ abierto: false, plaza: null });

  const cargarPlazas = async () => {
    setCargando(true);
    try {
      const response = await plazasAPI.listar();
      setPlazas(response.data.data.plazas);
    } catch (error) {
      toast.error('Error al cargar plazas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlazas();
  }, []);

  const handleGuardarPlaza = async (datos) => {
    if (modal.plaza) {
      await plazasAPI.actualizar(modal.plaza.id, datos);
      toast.success('Plaza actualizada');
    } else {
      await plazasAPI.crear(datos);
      toast.success('Plaza creada');
    }
    cargarPlazas();
  };

  const handleEliminarPlaza = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta plaza?')) {
      try {
        await plazasAPI.eliminar(id);
        toast.success('Plaza eliminada');
        cargarPlazas();
      } catch (error) {
        toast.error('No se puede eliminar una plaza ocupada o con historial');
      }
    }
  };

  // Filtrar plazas
  const plazasFiltradas = plazas.filter(plaza => {
    if (filtro === 'todos') return true;
    if (filtro === 'libres') return plaza.estado === 'libre';
    if (filtro === 'ocupadas') return plaza.estado === 'ocupada';
    if (filtro === 'mantenimiento') return plaza.estado === 'mantenimiento';
    return plaza.tipo === filtro;
  });

  // Estadísticas
  const stats = {
    total: plazas.length,
    libres: plazas.filter(p => p.estado === 'libre').length,
    ocupadas: plazas.filter(p => p.estado === 'ocupada').length,
    mantenimiento: plazas.filter(p => p.estado === 'mantenimiento').length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Plazas de Parqueadero</h1>
          <p className="text-slate-400 mt-1">Visualiza y gestiona el estado de cada espacio en tiempo real</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={cargarPlazas} 
            disabled={cargando} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin text-gpa-blue' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button 
            onClick={() => setModal({ abierto: true, plaza: null })}
            className="btn-premium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Plaza</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 border-white/5 hover:border-gpa-blue/30 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gpa-blue" />
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Total</p>
          <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stats.total}</p>
        </div>
        <div className="glass-card p-6 bg-green-500/5 border-green-500/10 hover:border-green-500/30 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
          <p className="text-sm font-medium text-green-400/80 uppercase tracking-wider mb-1">Libres</p>
          <p className="text-3xl font-bold text-green-400 group-hover:scale-105 transition-transform origin-left">{stats.libres}</p>
        </div>
        <div className="glass-card p-6 bg-red-500/5 border-red-500/10 hover:border-red-500/30 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <p className="text-sm font-medium text-red-400/80 uppercase tracking-wider mb-1">Ocupadas</p>
          <p className="text-3xl font-bold text-red-400 group-hover:scale-105 transition-transform origin-left">{stats.ocupadas}</p>
        </div>
        <div className="glass-card p-6 bg-yellow-500/5 border-yellow-500/10 hover:border-yellow-500/30 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
          <p className="text-sm font-medium text-yellow-400/80 uppercase tracking-wider mb-1">Mantenimiento</p>
          <p className="text-3xl font-bold text-yellow-400 group-hover:scale-105 transition-transform origin-left">{stats.mantenimiento}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="glass-card p-2 inline-flex flex-wrap gap-1">
        {[
          { value: 'todos', label: 'Todas' },
          { value: 'libres', label: 'Libres' },
          { value: 'ocupadas', label: 'Ocupadas' },
          { value: 'carro', label: 'Carros' },
          { value: 'moto', label: 'Motos' },
          { value: 'camioneta', label: 'Camionetas' },
          { value: 'discapacitado', label: 'Discapacitados' },
        ].map((opcion) => (
          <button
            key={opcion.value}
            onClick={() => setFiltro(opcion.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filtro === opcion.value
                ? 'bg-gpa-blue/20 text-white border border-gpa-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {/* Grid de plazas */}
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin" />
        </div>
      ) : plazasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plazasFiltradas.map((plaza) => (
            <PlazaCard
              key={plaza.id}
              plaza={plaza}
              onEditar={(p) => setModal({ abierto: true, plaza: p })}
              onEliminar={handleEliminarPlaza}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center justify-center py-20 border-dashed border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sin Resultados</h3>
          <p className="text-slate-400">No hay plazas que coincidan con este filtro.</p>
        </div>
      )}

      {/* Modal */}
      <ModalPlaza
        abierto={modal.abierto}
        plaza={modal.plaza}
        onClose={() => setModal({ abierto: false, plaza: null })}
        onGuardar={handleGuardarPlaza}
      />
    </div>
  );
}



