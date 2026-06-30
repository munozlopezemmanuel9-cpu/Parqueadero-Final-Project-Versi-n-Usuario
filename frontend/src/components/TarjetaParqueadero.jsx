/**
 * TarjetaParqueadero.jsx
 * Card premium reutilizable para mostrar información de un parqueadero
 */

import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Car, Shield, Umbrella, Navigation, ChevronRight } from 'lucide-react';

// Helpers de estado
export const getEstadoInfo = (parqueadero) => {
  const pct = parqueadero.espacios_disponibles / parqueadero.capacidad_total;
  if (parqueadero.espacios_disponibles === 0) {
    return { label: 'Completo', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500' };
  }
  if (pct < 0.2) {
    return { label: `${parqueadero.espacios_disponibles} espacios`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500' };
  }
  return { label: `${parqueadero.espacios_disponibles} libres`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500' };
};

export const formatDistancia = (metros) => {
  if (!metros) return null;
  if (metros < 1000) return `${metros} m`;
  return `${(metros / 1000).toFixed(1)} km`;
};

export default function TarjetaParqueadero({ parqueadero, compact = false, onClick, seleccionado = false }) {
  const estado = getEstadoInfo(parqueadero);
  const distancia = formatDistancia(parqueadero.distancia_metros);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
          seleccionado
            ? 'bg-gpa-blue/10 border-gpa-blue/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
            : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.04] hover:border-white/15'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm truncate">{parqueadero.nombre}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{parqueadero.barrio || parqueadero.direccion}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-bold ${estado.bg} ${estado.color} shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${estado.dot} animate-pulse`} />
            {estado.label}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {parqueadero.rating_promedio?.toFixed(1) || '—'}
          </span>
          <span className="text-xs font-bold text-gpa-cyan">
            ${(parqueadero.tarifa_hora || 0).toLocaleString()}/h
          </span>
          {distancia && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              {distancia}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className={`glass-card border-white/8 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-gpa-blue/20 hover:shadow-2xl hover:shadow-black/40 ${
      seleccionado ? 'border-gpa-blue/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''
    }`}>
      {/* Header con estado */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white text-lg leading-tight">{parqueadero.nombre}</h3>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {parqueadero.direccion}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${estado.bg} ${estado.color} shrink-0`}>
            <span className={`w-2 h-2 rounded-full ${estado.dot} animate-pulse`} />
            {estado.label}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-lg font-black text-gpa-cyan">${(parqueadero.tarifa_hora || 0).toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">por hora</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-lg font-black text-white flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {parqueadero.rating_promedio?.toFixed(1) || '—'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{parqueadero.total_calificaciones || 0} reseñas</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            {distancia ? (
              <>
                <p className="text-lg font-black text-white">{distancia}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">de ti</p>
              </>
            ) : (
              <>
                <p className="text-lg font-black text-white">{parqueadero.capacidad_total}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">espacios</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amenidades */}
      <div className="px-6 pb-4 flex items-center gap-3">
        {parqueadero.tiene_camaras && (
          <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <Shield className="w-3 h-3 text-gpa-blue" /> Cámaras
          </span>
        )}
        {parqueadero.tiene_techado && (
          <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <Umbrella className="w-3 h-3 text-gpa-cyan" /> Techado
          </span>
        )}
        {parqueadero.abierto_24h && (
          <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-emerald-400" /> 24/7
          </span>
        )}
        {!parqueadero.abierto_24h && (
          <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-slate-500" />
            {parqueadero.horario_apertura?.slice(0,5)} – {parqueadero.horario_cierre?.slice(0,5)}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          to={parqueadero.espacios_disponibles === 0 ? '#' : `/reservar/${parqueadero.id}`}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
            parqueadero.espacios_disponibles === 0
              ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-gpa-blue to-gpa-purple text-white hover:shadow-lg hover:shadow-gpa-blue/30 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {parqueadero.espacios_disponibles === 0 ? 'Sin disponibilidad' : 'Reservar ahora'}
          {parqueadero.espacios_disponibles > 0 && <ChevronRight className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  );
}
