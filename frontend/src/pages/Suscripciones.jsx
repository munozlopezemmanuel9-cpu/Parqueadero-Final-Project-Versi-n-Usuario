import React, { useState, useEffect } from 'react';
import { parqueaderosAPI, suscripcionesAPI } from '../services/api';
import { CreditCard, CheckCircle2, Shield, CalendarDays, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StripeCheckoutWrapper from '../components/StripeCheckout';

export default function Suscripciones() {
  const [parqueaderos, setParqueaderos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrandoStripe, setMostrandoStripe] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const pRes = await parqueaderosAPI.listar();
      const sRes = await suscripcionesAPI.obtenerMisSuscripciones();
      setParqueaderos(pRes.data.data || []);
      setSuscripciones(sRes.data.data.suscripciones || []);
    } catch (error) {
      toast.error('Error cargando suscripciones');
    } finally {
      setCargando(false);
    }
  };

  const handleAdquirir = async (paymentId) => {
    if (!seleccionado) return;
    
    try {
      await suscripcionesAPI.adquirir({
        parqueadero_id: seleccionado.id,
        precio_mensual: (seleccionado.tarifa_dia * 20), // 20 days equivalent
        stripe_payment_intent_id: paymentId
      });
      toast.success('Mensualidad adquirida exitosamente');
      setMostrandoStripe(false);
      setSeleccionado(null);
      cargarDatos();
    } catch (error) {
      toast.error(error.message || 'Error al adquirir mensualidad');
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 text-gpa-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Suscripciones Mensuales</h1>
        <p className="text-slate-400 mt-2">Asegura tu espacio y ahorra con nuestros planes mensuales</p>
      </div>

      {/* Suscripciones Activas */}
      {suscripciones.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Tus Mensualidades Activas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suscripciones.map(sub => (
              <div key={sub.id} className="glass-card p-6 border-emerald-500/30 bg-emerald-500/5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-emerald-500/20 text-emerald-400">
                    {sub.estado}
                  </span>
                </div>
                <h3 className="font-bold text-white uppercase mb-2">{sub.parqueadero_nombre}</h3>
                <div className="space-y-2 mt-4 text-sm text-slate-300">
                  <p className="flex justify-between"><span>Vence:</span> <span className="font-bold">{new Date(sub.fecha_fin).toLocaleDateString()}</span></p>
                  <p className="flex justify-between"><span>Valor:</span> <span className="font-bold text-gpa-cyan">${sub.precio_mensual.toLocaleString()}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adquirir nueva */}
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-gpa-blue" />
        Planes Disponibles
      </h2>
      
      {!mostrandoStripe ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parqueaderos.map(p => {
            const tarifaMensual = (p.tarifa_dia || p.tarifa_hora * 8) * 20; // Aproximación de 20 días hábiles
            const tieneSuscripcion = suscripciones.some(s => s.parqueadero_id === p.id && s.estado === 'activa');
            
            return (
              <div key={p.id} className="glass-card p-6 border-white/5 rounded-2xl hover:border-gpa-blue/30 transition-all flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="font-black text-lg text-white uppercase italic mb-1">{p.nombre}</h3>
                  <p className="text-xs text-slate-500 mb-6">{p.direccion}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-gpa-cyan">${tarifaMensual.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest ml-1">/ mes</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Acceso ilimitado 24/7 (si aplica)</li>
                    <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Entrada preferencial</li>
                    <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Pago automático seguro</li>
                  </ul>
                </div>
                
                {tieneSuscripcion ? (
                  <button disabled className="w-full py-3 rounded-xl bg-white/5 text-slate-500 font-bold uppercase tracking-wider text-xs border border-white/5">
                    Plan Activo
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setSeleccionado({ ...p, tarifa_dia: p.tarifa_dia || p.tarifa_hora * 8 });
                      setMostrandoStripe(true);
                    }}
                    className="w-full py-3 rounded-xl bg-gpa-blue text-white font-bold uppercase tracking-wider text-xs hover:bg-blue-600 transition-colors shadow-lg shadow-gpa-blue/20"
                  >
                    Adquirir Mensualidad
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-md mx-auto glass-card p-8 rounded-3xl border-white/10">
          <h3 className="text-lg font-bold text-white mb-2 text-center uppercase tracking-wider">Confirmar Compra</h3>
          <p className="text-sm text-slate-400 text-center mb-8">Mensualidad en {seleccionado.nombre}</p>
          
          <StripeCheckoutWrapper 
            monto={seleccionado.tarifa_dia * 20}
            onConfirm={handleAdquirir}
            onCancel={() => {
              setMostrandoStripe(false);
              setSeleccionado(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
