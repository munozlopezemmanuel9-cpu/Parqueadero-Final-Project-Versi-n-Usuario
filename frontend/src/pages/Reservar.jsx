/**
 * Reservar.jsx
 * Flujo de reserva premium en 3 pasos con cálculo de tarifa en tiempo real
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Car, Shield, CreditCard, ChevronRight, ChevronLeft, MapPin, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { parqueaderosAPI, reservasAPI, vehiculosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ModalReserva from '../components/ModalReserva';
import StripeCheckoutWrapper from '../components/StripeCheckout';

export default function Reservar() {
  const { parqueaderoId } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  const [parqueadero, setParqueadero] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [paso, setPaso] = useState(1);
  const [reservaCreada, setReservaCreada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Paso 1: Fecha y hora
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [duracionHoras, setDuracionHoras] = useState(2);

  // Paso 2: Vehículo
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [nuevaPlaca, setNuevaPlaca] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('carro');


  // Paso 3: Pago
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [mostrarStripe, setMostrarStripe] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [parqueaderoId]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const pRes = await parqueaderosAPI.obtenerDetalle(parqueaderoId);
      const parqueaderoData = pRes?.data?.data?.parqueadero;
      if (parqueaderoData) {
        setParqueadero(parqueaderoData);
      } else {
        toast.error('Sede no encontrada');
        navigate('/mapa');
        return;
      }

      // Intentar cargar vehículos del usuario si está autenticado
      try {
        const vRes = await vehiculosAPI.obtenerHistorial();
        const lista = vRes?.data?.data?.vehiculos || vRes?.data?.data || [];
        setVehiculos(Array.isArray(lista) ? lista : []);
        if (lista.length > 0) setVehiculoSeleccionado(lista[0].id);
      } catch {
        setVehiculos([]);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar el parqueadero');
    } finally {
      setCargando(false);
    }
  };

  const calcularTotal = () => {
    if (!parqueadero) return 0;
    return (parqueadero.tarifa_hora || 5000) * duracionHoras;
  };

  const handleSiguiente = () => {
    if (paso === 1) {
      setPaso(2);
    } else if (paso === 2) {
      // Verificar si hay placa
      const vehiculo = vehiculos.find(v => v.id === vehiculoSeleccionado);
      if (!vehiculo && !nuevaPlaca) {
        toast.error('Selecciona o ingresa un vehículo');
        return;
      }
      setPaso(3);
    }
  };

  const handleAtras = () => {
    if (paso > 1) setPaso(paso - 1);
  };

  const handleReservar = async (stripePaymentId = null) => {
    if (metodoPago === 'tarjeta' && !stripePaymentId && !mostrarStripe) {
      setMostrarStripe(true);
      return;
    }

    const vehiculo = vehiculos.find(v => v.id === vehiculoSeleccionado) || {
      placa: nuevaPlaca,
      tipo: nuevoTipo
    };

    const inicio = new Date(`${fecha}T${horaInicio}`);
    const fin = new Date(inicio.getTime() + duracionHoras * 60 * 60 * 1000);

    const reservaData = {
      parqueadero_id: parseInt(parqueaderoId),
      vehiculo_placa: vehiculo.placa,
      vehiculo_tipo: vehiculo.tipo,
      fecha_inicio: inicio.toISOString(),
      fecha_fin: fin.toISOString(),
      horas_estimadas: duracionHoras,
      total: calcularTotal(),
      metodo_pago: metodoPago,
      stripe_payment_intent_id: stripePaymentId
    };

    const promise = reservasAPI.crear(reservaData);
    toast.promise(promise, {
      loading: 'Procesando tu reserva...',
      success: (res) => {
        setMostrarStripe(false);
        setReservaCreada(res.data.data.reserva);
        setModalOpen(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#22d3ee']
        });
        return '¡Reserva confirmada con éxito!';
      },
      error: 'Hubo un error al crear la reserva.'
    });
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando Parqueadero...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 relative z-10 animate-fade-in">
      
      {/* Back button */}
      <Link to="/mapa" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white uppercase font-black tracking-wider mb-6 sm:mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Volver al mapa
      </Link>

      {/* Sede Info Header */}
      {parqueadero && (
        <div className="glass-card border-white/8 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.01]">
          <div>
            <span className="text-[10px] font-black text-gpa-cyan uppercase tracking-widest flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Estás reservando en
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic">{parqueadero.nombre}</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0 text-slate-600" /> {parqueadero.direccion}
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tarifa por hora</span>
            <span className="text-2xl font-black text-gpa-cyan mt-1">${(parqueadero.tarifa_hora || 0).toLocaleString()} COP</span>
          </div>
        </div>
      )}

      {/* Stepper Progress */}
      <div className="flex items-center justify-between max-w-md mx-auto mb-10">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1 last:flex-initial">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border transition-all ${
              paso >= num
                ? 'bg-gpa-blue/20 border-gpa-blue text-gpa-blue shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}>
              {num}
            </div>
            {num < 3 && (
              <div className={`h-0.5 flex-1 mx-2 transition-all ${
                paso > num ? 'bg-gpa-blue' : 'bg-white/5'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Step Inputs (Left Column - Spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PASO 1: Fecha y hora */}
          {paso === 1 && (
            <div className="glass-card border-white/8 rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.01]">
              <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gpa-blue" />
                Paso 1: ¿Cuándo vienes?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/8 text-sm text-white focus:outline-none focus:border-gpa-blue transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hora de ingreso</label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/8 text-sm text-white focus:outline-none focus:border-gpa-blue transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duración estimada</label>
                  <span className="text-sm font-black text-gpa-cyan">{duracionHoras} {duracionHoras === 1 ? 'hora' : 'horas'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={duracionHoras}
                  onChange={(e) => setDuracionHoras(parseInt(e.target.value))}
                  className="w-full accent-gpa-blue"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase">
                  <span>1 hora</span>
                  <span>6 horas</span>
                  <span>12 horas</span>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Vehículo */}
          {paso === 2 && (
            <div className="glass-card border-white/8 rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.01]">
              <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <Car className="w-5 h-5 text-gpa-blue" />
                Paso 2: Datos del Vehículo
              </h2>

              {/* Lista de vehículos registrados */}
              {vehiculos.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tus vehículos guardados</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {vehiculos.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setVehiculoSeleccionado(v.id);
                          setNuevaPlaca('');
                        }}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          vehiculoSeleccionado === v.id && !nuevaPlaca
                            ? 'bg-gpa-blue/10 border-gpa-blue/40 shadow-md'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{v.placa}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{v.marca || v.tipo}</p>
                        </div>
                        <Car className={`w-5 h-5 ${vehiculoSeleccionado === v.id && !nuevaPlaca ? 'text-gpa-blue' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingreso de placa manual */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">¿Otro vehículo?</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="PLACA (ej. AAA123)"
                    value={nuevaPlaca}
                    onChange={(e) => {
                      setNuevaPlaca(e.target.value.toUpperCase());
                      setVehiculoSeleccionado(null);
                    }}
                    maxLength={7}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/8 text-sm text-white focus:outline-none focus:border-gpa-blue uppercase font-bold tracking-wider"
                  />
                  <select
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-[#0a0a0d] border border-white/8 text-sm text-white focus:outline-none focus:border-gpa-blue"
                  >
                    <option value="carro">Carro</option>
                    <option value="moto">Moto</option>
                    <option value="camioneta">Camioneta</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Pago simulado */}
          {paso === 3 && (
            <div className="glass-card border-white/8 rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.01]">
              <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gpa-blue" />
                Paso 3: Pago Simulado
              </h2>

              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Elige método de pago</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {[
                    { id: 'tarjeta', label: 'Tarjeta Crédito/Débito', icon: CreditCard, color: 'text-gpa-blue' },
                    { id: 'pse', label: 'PSE (Simulado)', icon: Sparkles, color: 'text-gpa-cyan' },
                    { id: 'efectivo', label: 'Pagar en Sede', icon: Shield, color: 'text-emerald-400' }
                  ].map((pago) => {
                    const Icon = pago.icon;
                    return (
                      <button
                        key={pago.id}
                        onClick={() => {
                          setMetodoPago(pago.id);
                          setMostrarStripe(false);
                        }}
                        className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 transition-all ${
                          metodoPago === pago.id
                            ? 'bg-gpa-blue/10 border-gpa-blue/40 shadow-md'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${pago.color}`} />
                        <span className="text-xs font-bold text-white leading-tight">{pago.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <Shield className="w-5 h-5 text-gpa-blue shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Transacción Segura</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Esta es una simulación de pagos con fines de demostración en Medellín. Ningún cobro real será efectuado.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleAtras}
              disabled={paso === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Atrás
            </button>

            {paso < 3 ? (
              <button
                onClick={handleSiguiente}
                className="flex items-center gap-2 px-6 py-3.5 bg-gpa-blue hover:shadow-lg hover:shadow-gpa-blue/20 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : mostrarStripe ? null : (
              <button
                onClick={() => handleReservar()}
                className="flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-gpa-blue to-gpa-purple hover:shadow-lg hover:shadow-gpa-blue/30 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {metodoPago === 'tarjeta' ? 'Pagar Seguro' : 'Confirmar Reserva'}
              </button>
            )}
          </div>
          
          {/* Stripe Form Rendered inline if toggled */}
          {mostrarStripe && paso === 3 && (
            <div className="mt-6">
              <StripeCheckoutWrapper 
                monto={calcularTotal()} 
                onConfirm={(paymentId) => handleReservar(paymentId)}
                onCancel={() => setMostrarStripe(false)}
              />
            </div>
          )}

        </div>

        {/* Checkout Summary (Right Column) */}
        <div className="lg:col-span-1">
          <div className="glass-card border-white/8 rounded-3xl p-6 bg-white/[0.02] sticky top-24 space-y-5">
            <h3 className="text-sm font-black text-white uppercase italic tracking-tight border-b border-white/5 pb-3">
              Resumen de Compra
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 font-bold uppercase">Sede</span>
                <span className="text-white font-black text-right truncate max-w-[120px]">{parqueadero?.nombre}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Fecha</span>
                <span className="text-white font-bold">{new Date(fecha).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Hora Entrada</span>
                <span className="text-white font-bold">{horaInicio}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Duración</span>
                <span className="text-white font-bold">{duracionHoras} {duracionHoras === 1 ? 'hora' : 'horas'}</span>
              </div>

              {/* Placa display if available */}
              {(vehiculoSeleccionado || nuevaPlaca) && (
                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                  <span className="text-slate-500 font-bold uppercase">Vehículo</span>
                  <span className="text-gpa-blue font-black tracking-wider uppercase">
                    {nuevaPlaca || vehiculos.find(v => v.id === vehiculoSeleccionado)?.placa}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-widest">Total</span>
              <div className="text-right">
                <span className="text-xl font-black text-gpa-cyan">${calcularTotal().toLocaleString()}</span>
                <span className="block text-[8px] text-slate-500 font-bold uppercase mt-0.5">IVA Incluido</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Confirmation */}
      {modalOpen && (
        <ModalReserva
          reserva={reservaCreada}
          parqueadero={parqueadero}
          onClose={() => {
            setModalOpen(false);
            navigate('/mis-reservas');
          }}
        />
      )}

    </div>
  );
}
