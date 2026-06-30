/**
 * ModalReserva.jsx
 * Modal premium que muestra el comprobante de la reserva con código QR interactivo
 */

import { X, Calendar, Car, Clock, ShieldCheck, Download, Share2 } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function ModalReserva({ reserva, parqueadero, onClose }) {
  if (!reserva) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#0a0a0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 animate-fade-in">
        {/* Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gpa-blue/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-slate-400 hover:text-white cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          
          {/* Icon Badge */}
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>

          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
            ¡Reserva <span className="text-gpa-cyan">Confirmada</span>!
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
            Presenta este QR al ingresar al parqueadero
          </p>

          {/* QR Code Container */}
          <div className="my-6 p-4 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner relative group">
            <div className="p-3 bg-white rounded-2xl">
              <QRCode 
                value={reserva.codigo_reserva || 'GPA-MOCK-CODE'} 
                size={160} 
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
            <div className="absolute inset-0 bg-[#0a0a0d]/80 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <p className="text-xs font-black text-white tracking-widest uppercase">CÓDIGO DE ACCESO</p>
              <p className="text-lg font-black text-gpa-cyan font-mono tracking-wider">{reserva.codigo_reserva}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="w-full space-y-3.5 border-t border-b border-white/5 py-5 mb-6 text-left">
            <div className="flex justify-between items-start gap-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Parqueadero</span>
              <span className="text-xs font-bold text-white text-right">
                {parqueadero?.nombre || 'Sede GPA'}
                <span className="block text-[10px] text-slate-500 font-medium normal-case mt-0.5">
                  {parqueadero?.direccion || 'Medellín, Colombia'}
                </span>
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vehículo</span>
              <span className="text-xs font-black text-gpa-blue uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                {reserva.vehiculo_placa}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Horario</span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {new Date(reserva.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(reserva.fecha_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(reserva.fecha_inicio).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Pagado</span>
              <span className="text-base font-black text-gpa-cyan">
                ${(reserva.total || 0).toLocaleString()} COP
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/8 text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-widest transition-all border border-white/5 active:scale-95"
            >
              Listo
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Reserva GPA - ${parqueadero?.nombre}`,
                    text: `Mi código de reserva es: ${reserva.codigo_reserva}`,
                    url: window.location.origin
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(reserva.codigo_reserva);
                  alert('¡Código copiado al portapapeles!');
                }
              }}
              className="px-4 py-3 bg-gpa-blue/10 border border-gpa-blue/20 hover:bg-gpa-blue/20 text-gpa-blue rounded-2xl transition-all active:scale-95 cursor-pointer"
              title="Compartir reserva"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
