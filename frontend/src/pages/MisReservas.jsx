/**
 * MisReservas.jsx
 * Dashboard de reservas para el cliente: activas, pasadas, QR e interactividad de calificaciones
 */

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, AlertCircle, Sparkles, CheckCircle2, XCircle, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import { reservasAPI } from '../services/api';
import ModalReserva from '../components/ModalReserva';
import SistemaCalificacion from '../components/SistemaCalificacion';
import { SkeletonReservaCard } from '../components/Skeleton';

// Componente helper para el countdown
function Countdown({ fechaInicio }) {
  const [tiempo, setTiempo] = useState('');

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date();
      const inicio = new Date(fechaInicio);
      const diff = inicio - ahora;

      if (diff <= 0) {
        setTiempo('¡Es hora!');
        return;
      }

      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTiempo(`en ${horas}h ${minutos}m`);
    };

    calcular();
    const interval = setInterval(calcular, 60000); // actualizar cada minuto
    return () => clearInterval(interval);
  }, [fechaInicio]);

  return <span className="text-amber-400 font-bold ml-1">{tiempo}</span>;
}

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [reservaActivaQR, setReservaActivaQR] = useState(null);
  const [modalQROpen, setModalQROpen] = useState(false);
  const [reservaCalificar, setReservaCalificar] = useState(null);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setCargando(true);
      const res = await reservasAPI.obtenerMisReservas();
      const lista = res.data?.data?.reservas || res.data?.data || [];
      setReservas(Array.isArray(lista) ? lista : []);
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar tus reservas');
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    try {
      await reservasAPI.cancelar(id);
      toast.success('Reserva cancelada correctamente');
      cargarReservas();
    } catch {
      toast.error('Error al cancelar la reserva');
    }
  };

  const handleConfirmarLlegada = async (id) => {
    try {
      await reservasAPI.confirmarLlegada(id);
      toast.success('¡Llegada confirmada! Tu estacionamiento ha iniciado.');
      cargarReservas();
    } catch {
      toast.error('Error al registrar llegada');
    }
  };

  const getBadgeStyle = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-gpa-blue/10 border-gpa-blue/20 text-gpa-blue';
      case 'activa':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'cancelada':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'completada':
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
      default:
        return 'bg-white/5 border-transparent text-slate-400';
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'confirmada': return 'Confirmada';
      case 'activa': return 'En Curso';
      case 'cancelada': return 'Cancelada';
      case 'completada': return 'Completada';
      default: return estado;
    }
  };

  // Separa las activas/pendientes de las pasadas
  const activas = reservas.filter(r => r.estado === 'confirmada' || r.estado === 'activa');
  const historial = reservas.filter(r => r.estado === 'cancelada' || r.estado === 'completada');

  if (cargando) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonReservaCard />
          <SkeletonReservaCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10 relative z-10 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
          MIS <span className="text-gpa-blue">RESERVAS</span>
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
          Administra tus estacionamientos y consulta tus códigos QR de acceso
        </p>
      </div>

      {/* RESERVAS ACTIVAS */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gpa-blue" />
          Reservas Activas
        </h2>

        {activas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activas.map((res) => (
              <div 
                key={res.id} 
                className="glass-card border-white/8 rounded-3xl p-6 bg-white/[0.01] flex flex-col justify-between gap-6 hover:border-gpa-blue/20 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-black text-white text-base uppercase truncate max-w-[220px]">
                        {res.parqueaderos?.nombre || 'Sede GPA'}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {res.parqueaderos?.direccion || 'Medellín, Colombia'}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getBadgeStyle(res.estado)}`}>
                      {getEstadoLabel(res.estado)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Vehículo</span>
                      <span className="text-white font-black uppercase tracking-wider">{res.vehiculo_placa}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estado de tiempo</span>
                      {res.estado === 'confirmada' ? (
                        <span className="text-[10px] text-slate-400 font-medium">Inicia <Countdown fechaInicio={res.fecha_inicio} /></span>
                      ) : (
                        <span className="text-emerald-400 font-bold">En curso</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total estimado</span>
                      <span className="text-gpa-cyan font-black">${(res.total || 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Horas</span>
                      <span className="text-white font-bold">
                        {new Date(res.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(res.fecha_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setReservaActivaQR(res);
                        setModalQROpen(true);
                      }}
                      className="flex-1 py-2.5 bg-gpa-blue/15 border border-gpa-blue/25 hover:bg-gpa-blue/25 text-gpa-blue text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      Ver QR / Ticket
                    </button>
                    {res.parqueaderos?.lat && res.parqueaderos?.lng && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${res.parqueaderos.lat},${res.parqueaderos.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Navegar
                      </a>
                    )}
                  </div>

                  {res.estado === 'confirmada' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfirmarLlegada(res.id)}
                        className="flex-1 py-2.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        Llegué
                      </button>
                      <button
                        onClick={() => handleCancelar(res.id)}
                        className="flex-1 py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        title="Cancelar reserva"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card border-white/5 bg-white/[0.01] rounded-3xl">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-semibold uppercase">No tienes reservas activas en este momento</p>
            <p className="text-slate-600 text-xs mt-1">Busca un parqueadero en el mapa y reserva tu cupo.</p>
          </div>
        )}
      </div>

      {/* HISTORIAL */}
      <div className="space-y-6 pt-6">
        <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-500" />
          Historial de Reservas
        </h2>

        {historial.length > 0 ? (
          <div className="overflow-hidden rounded-3xl glass-card border-white/5 bg-white/[0.01]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/8 bg-white/[0.01]">
                    <th className="px-6 py-4">Sede / Parqueadero</th>
                    <th className="px-6 py-4">Vehículo</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Importe</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {historial.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-bold text-white block">{res.parqueaderos?.nombre || 'Sede GPA'}</span>
                        <span className="text-[10px] text-slate-500 block">{res.parqueaderos?.direccion}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-slate-300 uppercase tracking-wider">
                        {res.vehiculo_placa}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {new Date(res.fecha_inicio).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-gpa-cyan">
                        ${(res.total || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getBadgeStyle(res.estado)}`}>
                          {getEstadoLabel(res.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {res.estado === 'completada' ? (
                          <button
                            onClick={() => setReservaCalificar(res)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            Calificar Sede
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-bold uppercase">Sin acciones</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 glass-card border-white/5 bg-white/[0.01] rounded-3xl">
            <p className="text-slate-500 text-xs uppercase tracking-wider">No tienes historial de reservas registrado</p>
          </div>
        )}
      </div>

      {/* Modal QR Code */}
      {modalQROpen && (
        <ModalReserva
          reserva={reservaActivaQR}
          parqueadero={reservaActivaQR?.parqueaderos}
          onClose={() => {
            setModalQROpen(false);
            setReservaActivaQR(null);
          }}
        />
      )}

      {/* Modal Rating / Calificación */}
      {reservaCalificar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setReservaCalificar(null)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-fade-in">
            <button
              onClick={() => setReservaCalificar(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl cursor-pointer"
            >
              ×
            </button>
            <SistemaCalificacion
              parqueaderoId={reservaCalificar.parqueadero_id}
              reservaId={reservaCalificar.id}
              onCalificado={() => {
                setReservaCalificar(null);
                cargarReservas();
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
