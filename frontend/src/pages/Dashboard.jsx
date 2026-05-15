import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movimientosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Car,
  Bike,
  Truck,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  RefreshCw,
  Activity,
  PlusCircle,
  ClipboardList,
  Users,
  Zap
} from 'lucide-react';

/**
 * Tarjeta de estadística con diseño premium
 */
function StatCard({ titulo, valor, subtexto, icono: Icono, colorBar, colorText, colorBg }) {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${colorBar} opacity-80`} />
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{titulo}</p>
          <p className="text-4xl font-black text-white mt-2 group-hover:scale-105 transition-transform duration-500 origin-left">
            {valor}
          </p>
          {subtexto && (
            <div className="flex items-center gap-1.5 mt-2">
               <div className={`w-1.5 h-1.5 rounded-full ${colorBar} animate-pulse`} />
               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{subtexto}</p>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${colorBg} border border-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-inner`}>
          <Icono className={`w-7 h-7 ${colorText} drop-shadow-[0_0_8px_currentColor]`} />
        </div>
      </div>
      {/* Background glow effect on hover */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 ${colorBg} blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
    </div>
  );
}

/**
 * Acciones rápidas para mejorar el flujo de trabajo
 */
function QuickAction({ titulo, descripcion, ruta, icono: Icono, color }) {
  return (
    <Link 
      to={ruta}
      className="glass-card p-5 border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 group flex items-start gap-4"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icono className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="font-bold text-white text-base group-hover:text-gpa-cyan transition-colors">{titulo}</p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{descripcion}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto self-center" />
    </Link>
  );
}

/**
 * Tarjeta de vehículo en parqueadero (Simplificada para lista)
 */
function VehiculoRow({ movimiento }) {
  const fechaEntrada = new Date(movimiento.fecha_entrada);
  const ahora = new Date();
  const horasTranscurridas = ((ahora - fechaEntrada) / (1000 * 60 * 60)).toFixed(1);

  const iconos = { moto: Bike, carro: Car, camioneta: Truck, otro: Car };
  const IconoVehiculo = iconos[movimiento.vehiculo_tipo] || Car;

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-slate-800/50 border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <IconoVehiculo className="w-5 h-5 text-slate-300 group-hover:text-gpa-blue transition-colors" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-black text-white tracking-widest text-sm uppercase">{movimiento.placa}</p>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">{movimiento.vehiculo_tipo}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-gpa-cyan" />
            {movimiento.plaza_nombre} <span className="text-slate-700 mx-1">|</span> {movimiento.usuario_registro}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-xs font-black text-gpa-cyan justify-end uppercase tracking-tighter">
          <Clock className="w-3 h-3" />
          <span>{horasTranscurridas}h</span>
        </div>
        <p className="text-[10px] text-slate-600 mt-1 font-bold">
          ENTRADA: {fechaEntrada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { usuario } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [vehiculosEnParqueadero, setVehiculosEnParqueadero] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [statsResponse, vehiculosResponse] = await Promise.all([
        movimientosAPI.obtenerEstadisticas(),
        movimientosAPI.obtenerEnParqueadero(),
      ]);
      setEstadisticas(statsResponse.data.data.general);
      setVehiculosEnParqueadero(vehiculosResponse.data.data.movimientos);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const ocupacionPorcentaje = estadisticas
    ? Math.round((estadisticas.plazas_ocupadas / estadisticas.plazas_totales) * 100)
    : 0;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-fade-in pb-20">
      {/* Encabezado Dinámico */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gpa-blue/20 rounded-2xl flex items-center justify-center border border-gpa-blue/30 shadow-[0_0_20px_rgba(var(--color-gpa-blue),0.2)]">
              <Activity className="w-6 h-6 text-gpa-blue animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                SISTEMA <span className="text-gpa-blue">GPA</span>
              </h1>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Operativo en línea
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right mr-4">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Última actualización</p>
             <p className="text-xs font-bold text-white uppercase">{new Date().toLocaleTimeString()}</p>
          </div>
          <button
            onClick={cargarDatos}
            disabled={cargando}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl glass-card bg-white/[0.02] text-white hover:bg-gpa-blue hover:text-white transition-all duration-500 active:scale-95 shadow-xl border-white/5"
          >
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
            <span className="font-black text-sm uppercase tracking-widest">Sincronizar</span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div className="relative group overflow-hidden rounded-[2.5rem] p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-gpa-blue/40 via-gpa-purple/40 to-gpa-cyan/40 animate-gradient-x opacity-20" />
        <div className="relative glass-card bg-slate-950/80 backdrop-blur-3xl border-white/10 p-8 md:p-12 overflow-hidden rounded-[2.4rem]">
          <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-gpa-blue/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-gpa-blue/30 transition-all duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gpa-cyan uppercase tracking-widest">
                <Zap className="w-3 h-3 fill-current" />
                Acceso Nivel {usuario?.rol === 'admin' ? 'Total' : 'Operativo'}
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                HOLA, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-600 uppercase">{usuario?.nombre.split(' ')[0]}</span>.
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                {usuario?.rol === 'admin'
                  ? 'El sistema está operando al máximo rendimiento. Tienes 4 alertas pendientes de revisión en el módulo de usuarios.'
                  : 'Listo para procesar ingresos y salidas. Recuerda verificar siempre la placa antes de confirmar.'}
              </p>
            </div>
            {usuario?.rol === 'admin' && (
              <Link
                to="/usuarios"
                className="btn-premium py-5 px-10 text-lg shadow-[0_20px_50px_rgba(var(--color-gpa-blue),0.3)] hover:scale-105 hover:-rotate-1 active:scale-95 transition-all duration-300"
              >
                Gobernanza de Usuarios
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Métricas Críticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          titulo="Plazas Libres"
          valor={estadisticas?.plazas_libres || '0'}
          subtexto="Disponibilidad Real"
          icono={TrendingUp}
          colorBar="bg-emerald-500"
          colorText="text-emerald-400"
          colorBg="bg-emerald-500/10"
        />
        <StatCard
          titulo="Plazas Ocupadas"
          valor={estadisticas?.plazas_ocupadas || '0'}
          subtexto={`${ocupacionPorcentaje}% de capacidad`}
          icono={Car}
          colorBar="bg-gpa-blue"
          colorText="text-gpa-blue"
          colorBg="bg-gpa-blue/10"
        />
        <StatCard
          titulo="Flujo del Día"
          valor={estadisticas?.movimientos_hoy || '0'}
          subtexto="Ingresos Totales"
          icono={Clock}
          colorBar="bg-purple-500"
          colorText="text-purple-400"
          colorBg="bg-purple-500/10"
        />
        <StatCard
          titulo="Ingresos Brutos"
          valor={`$${(estadisticas?.recaudado_hoy || 0).toLocaleString()}`}
          subtexto="Corte de Caja"
          icono={DollarSign}
          colorBar="bg-amber-500"
          colorText="text-amber-400"
          colorBg="bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal (8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Accesos Rápidos */}
          <section className="space-y-4">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
              <Zap className="w-5 h-5 text-gpa-cyan" />
              Operaciones Flash
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickAction 
                titulo="Nueva Entrada" 
                descripcion="Registrar vehículo y asignar plaza disponible" 
                ruta="/vehiculos" 
                icono={PlusCircle} 
                color="bg-gpa-blue"
              />
              <QuickAction 
                titulo="Histórico" 
                descripcion="Consulta movimientos pasados y auditoría" 
                ruta="/historial" 
                icono={ClipboardList} 
                color="bg-purple-600"
              />
              <QuickAction 
                titulo="Plazas" 
                descripcion="Gestión técnica de espacios y tarifas" 
                ruta="/plazas" 
                icono={Users} 
                color="bg-indigo-600"
              />
            </div>
          </section>

          {/* Vehículos en Vivo */}
          <div className="glass-card p-8 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gpa-blue/5 blur-[80px] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Monitoreo <span className="text-gpa-blue">En Vivo</span>
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase mt-1">Vehículos actualmente estacionados</p>
              </div>
              <Link
                to="/vehiculos"
                className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black text-white uppercase transition-all border border-white/5"
              >
                Auditar Todos
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            {cargando ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin shadow-[0_0_20px_rgba(var(--color-gpa-blue),0.3)]" />
              </div>
            ) : vehiculosEnParqueadero.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehiculosEnParqueadero.slice(0, 6).map((movimiento) => (
                  <VehiculoRow key={movimiento.movimiento_id} movimiento={movimiento} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <Car className="w-10 h-10 text-slate-600" />
                </div>
                <h4 className="text-xl font-black text-white uppercase italic">Plataforma Vacía</h4>
                <p className="text-slate-500 max-w-[240px] mt-2 font-medium">No se detectan vehículos activos en este momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna Lateral (4) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Distribución Analítica */}
          <div className="glass-card p-8 border-white/5 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-gpa-purple/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="mb-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Carga <span className="text-gpa-purple">Analítica</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase mt-1">Distribución por segmento</p>
            </div>

            <div className="space-y-10 flex-1">
              {[
                { tipo: 'Carros', key: 'carro', icono: Car, color: 'bg-gpa-blue', glow: 'shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.4)]' },
                { tipo: 'Motos', key: 'moto', icono: Bike, color: 'bg-orange-500', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]' },
                { tipo: 'Camionetas', key: 'camioneta', icono: Truck, color: 'bg-purple-600', glow: 'shadow-[0_0_15px_rgba(147,51,234,0.4)]' },
              ].map((item) => {
                const Icono = item.icono;
                const ocupadas = estadisticas?.ocupacion_por_tipo?.[item.key] || 0;
                const totales = 10; // Asumido
                const porcentaje = Math.min((ocupadas / totales) * 100, 100);

                return (
                  <div key={item.tipo} className="group cursor-default">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${item.color}/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                           <Icono className={`w-5 h-5 ${item.color.replace('bg-', 'text-')}`} />
                        </div>
                        <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{item.tipo}</span>
                      </div>
                      <span className="text-sm font-black text-white">
                        {ocupadas} <span className="text-slate-700">/ {totales}</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-[1.5px]">
                      <div
                        className={`h-full rounded-full ${item.color} ${item.glow} transition-all duration-1000 ease-out relative`}
                        style={{ width: `${porcentaje}%` }}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Círculo de Ocupación */}
            <div className="mt-12 pt-10 border-t border-white/10 relative">
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-gpa-blue/10 blur-[60px] rounded-full" />
                <p className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl relative z-10">
                  {ocupacionPorcentaje}<span className="text-gpa-blue text-3xl">%</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.4em] font-black relative z-10">Ocupación Sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
