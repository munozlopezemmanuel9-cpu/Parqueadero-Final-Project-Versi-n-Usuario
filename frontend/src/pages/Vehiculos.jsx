/**
 * Página de Gestión de Vehículos
 *
 * Permite registrar entradas, ver vehículos actuales
 * y procesar salidas con cálculo de tarifas.
 */

import { useState, useEffect } from 'react';
import { movimientosAPI, vehiculosAPI, plazasAPI, reservasAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Car, Bike, Truck, Search, X, DollarSign, Clock, Calendar, CheckCircle, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Modal para registrar entrada
 */
function ModalEntrada({ abierto, onClose, onRegistrar, datosIniciales }) {
  const [paso, setPaso] = useState(1);
  const [vehiculo, setVehiculo] = useState({ placa: '', tipo: 'carro', marca: '', modelo: '', color: '' });
  const [reservaId, setReservaId] = useState(null);
  
  useEffect(() => {
    if (abierto && datosIniciales) {
        setVehiculo(prev => ({
            ...prev,
            placa: datosIniciales.placa,
            tipo: datosIniciales.tipo || 'carro'
        }));
        if (datosIniciales.reservaId) setReservaId(datosIniciales.reservaId);
    } else if (!abierto) {
        // Reset when closed manually
        setPaso(1);
        setVehiculo({ placa: '', tipo: 'carro', marca: '', modelo: '', color: '' });
        setPlazaSeleccionada(null);
        setReservaId(null);
    }
  }, [abierto, datosIniciales]);
  const [plazaSeleccionada, setPlazaSeleccionada] = useState(null);
  const [plazasDisponibles, setPlazasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);

  /**
   * Buscar vehículo existente por placa
   */
  const buscarVehiculo = async () => {
    if (vehiculo.placa.length < 6) return;

    try {
      const response = await vehiculosAPI.buscarPorPlaca(vehiculo.placa);
      if (response.data.data.vehiculo) {
        const v = response.data.data.vehiculo;
        setVehiculo(prev => ({
          ...prev,
          tipo: v.tipo || 'carro',
          marca: v.marca || '',
          modelo: v.modelo || '',
          color: v.color || '',
        }));
        toast.success('Vehículo encontrado');
      }
    } catch (error) {
      // Vehículo no encontrado, continuar con registro
    }
  };

  /**
   * Cargar plazas disponibles según tipo de vehículo
   */
  useEffect(() => {
    if (paso === 2 && vehiculo.tipo) {
      const cargarPlazas = async () => {
        try {
          const response = await plazasAPI.listarDisponibles(vehiculo.tipo);
          setPlazasDisponibles(response.data.data.plazas);
        } catch (error) {
          toast.error('Error al cargar plazas');
        }
      };
      cargarPlazas();
    }
  }, [paso, vehiculo.tipo]);

  /**
   * Manejar registro completo
   */
  const handleRegistrar = async () => {
    if (!plazaSeleccionada) {
      toast.error('Selecciona una plaza');
      return;
    }

    setCargando(true);

    try {
      // Primero registrar/obtener vehículo
      const vehiculoResponse = await vehiculosAPI.registrar(vehiculo);
      const vehiculoId = vehiculoResponse.data.data.vehiculo.id;

      // Luego registrar entrada
      await onRegistrar({
        vehiculo_id: vehiculoId,
        plaza_id: plazaSeleccionada,
        fecha_entrada: new Date().toISOString(),
        reserva_id: reservaId
      });

      // Resetear formulario (ahora se maneja en el useEffect o onClose)
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al registrar entrada');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card bg-slate-950/90 border-white/10 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Registrar Entrada</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress steps */}
        <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-colors duration-300 ${paso >= 1 ? 'bg-gpa-blue text-white border-gpa-blue shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.5)]' : 'bg-transparent text-slate-500 border-slate-600'}`}>
              1
            </div>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full bg-gpa-blue transition-all duration-500 ${paso >= 2 ? 'w-full shadow-[0_0_10px_rgba(var(--color-gpa-blue),0.5)]' : 'w-0'}`} />
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-colors duration-300 delay-100 ${paso >= 2 ? 'bg-gpa-blue text-white border-gpa-blue shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.5)]' : 'bg-transparent text-slate-500 border-slate-600'}`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-3 text-xs font-bold uppercase tracking-wider">
            <span className={paso >= 1 ? 'text-gpa-blue' : 'text-slate-500'}>Datos Vehículo</span>
            <span className={paso >= 2 ? 'text-gpa-blue' : 'text-slate-500'}>Plaza</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {paso === 1 ? (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Placa</label>
                <input
                  type="text"
                  value={vehiculo.placa}
                  onChange={(e) => setVehiculo({ ...vehiculo, placa: e.target.value.toUpperCase() })}
                  onBlur={buscarVehiculo}
                  className="glass-input uppercase text-lg tracking-widest font-bold"
                  placeholder="ABC-123"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Tipo de Vehículo</label>
                <select
                  value={vehiculo.tipo}
                  onChange={(e) => setVehiculo({ ...vehiculo, tipo: e.target.value })}
                  className="glass-input bg-[#111116] appearance-none"
                >
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                  <option value="camioneta">Camioneta</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Marca</label>
                  <input
                    type="text"
                    value={vehiculo.marca}
                    onChange={(e) => setVehiculo({ ...vehiculo, marca: e.target.value })}
                    className="glass-input"
                    placeholder="Ej: Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Modelo</label>
                  <input
                    type="text"
                    value={vehiculo.modelo}
                    onChange={(e) => setVehiculo({ ...vehiculo, modelo: e.target.value })}
                    className="glass-input"
                    placeholder="Ej: Corolla"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Color</label>
                <input
                  type="text"
                  value={vehiculo.color}
                  onChange={(e) => setVehiculo({ ...vehiculo, color: e.target.value })}
                  className="glass-input"
                  placeholder="Ej: Blanco"
                />
              </div>

              <button
                onClick={() => setPaso(2)}
                disabled={!vehiculo.placa}
                className="w-full btn-premium mt-6"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <p className="text-sm text-slate-400 font-medium">
                Plazas disponibles para <span className="text-white capitalize font-bold">{vehiculo.tipo}</span>
              </p>

              <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {plazasDisponibles.length > 0 ? (
                  plazasDisponibles.map((plaza) => (
                    <button
                      key={plaza.id}
                      onClick={() => setPlazaSeleccionada(plaza.id)}
                      className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                        plazaSeleccionada === plaza.id
                          ? 'border-gpa-blue bg-gpa-blue/20 shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.2)]'
                          : 'border-white/10 bg-white/5 hover:border-gpa-blue/50 hover:bg-white/10'
                      }`}
                    >
                      {plazaSeleccionada === plaza.id && (
                        <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-gpa-blue animate-fade-in" />
                      )}
                      <p className={`font-bold text-lg tracking-wider ${plazaSeleccionada === plaza.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {plaza.nombre}
                      </p>
                      <p className={`text-xs mt-1 ${plazaSeleccionada === plaza.id ? 'text-gpa-blue font-bold' : 'text-slate-500'}`}>
                        ${plaza.tarifa_por_hora}/h
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-slate-400 font-medium">No hay plazas disponibles</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setPaso(1)} 
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all font-bold"
                >
                  Atrás
                </button>
                <button
                  onClick={handleRegistrar}
                  disabled={cargando || !plazaSeleccionada}
                  className="flex-1 btn-premium"
                >
                  {cargando ? 'Registrando...' : 'Confirmar Entrada'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Modal para registrar salida
 */
function ModalSalida({ abierto, movimiento, onClose, onConfirmar }) {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [notas, setNotas] = useState('');
  const [costoEstimado, setCostoEstimado] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (movimiento?.movimiento_id) {
      const calcularCosto = async () => {
        try {
          const response = await movimientosAPI.calcularCosto(movimiento.movimiento_id);
          setCostoEstimado(response.data.data);
        } catch (error) {
          console.error('Error al calcular costo:', error);
        }
      };
      calcularCosto();
    }
  }, [movimiento]);

  const handleConfirmar = async () => {
    setCargando(true);
    try {
      await onConfirmar(movimiento.movimiento_id, { metodo_pago: metodoPago, notas });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar salida');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto || !movimiento) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card bg-slate-950/90 border-white/10 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Registrar Salida</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info vehículo */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gpa-blue/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                {movimiento.vehiculo_tipo === 'moto' ? (
                  <Bike className="w-6 h-6 text-orange-400" />
                ) : movimiento.vehiculo_tipo === 'camioneta' ? (
                  <Truck className="w-6 h-6 text-purple-400" />
                ) : (
                  <Car className="w-6 h-6 text-gpa-blue" />
                )}
              </div>
              <div>
                <p className="font-black text-xl text-white tracking-widest">{movimiento.placa}</p>
                <p className="text-sm font-medium text-slate-400">{movimiento.plaza_nombre}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm relative z-10 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gpa-blue" />
                <span className="text-slate-300 font-medium">{new Date(movimiento.fecha_entrada).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gpa-blue" />
                <span className="text-slate-300 font-medium">{new Date(movimiento.fecha_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          {/* Costo estimado */}
          {costoEstimado && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <span className="text-sm font-bold text-green-400/80 uppercase tracking-wider">Total a pagar</span>
                </div>
                <span className="text-3xl font-black text-green-400">
                  ${costoEstimado.costo_estimado.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-green-400/60 mt-2 font-medium">
                {costoEstimado.horas_transcurridas} horas totales • <span className="font-bold text-green-400/80">{costoEstimado.horas_cobrar} horas facturables</span>
              </p>
            </div>
          )}

          {/* Método de pago */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Método de Pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="glass-input bg-[#111116] appearance-none font-bold"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta (Datafono)</option>
              <option value="transferencia">Transferencia Bancaria</option>
            </select>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="glass-input resize-none"
              rows={2}
              placeholder="Observaciones de salida..."
            />
          </div>

          <button
            onClick={handleConfirmar}
            disabled={cargando}
            className="w-full btn-premium mt-4"
          >
            {cargando ? 'Procesando Pago...' : 'Confirmar Salida y Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Página principal de Vehículos
 */
export default function Vehiculos() {
  const { usuario } = useAuth();
  const [tabActiva, setTabActiva] = useState('activos'); // 'activos' o 'reservas'
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  const [reservasPendientes, setReservasPendientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalEntradaAbierto, setModalEntradaAbierto] = useState(false);
  const [modalSalida, setModalSalida] = useState({ abierto: false, movimiento: null });
  const [datosInicialesVoz, setDatosInicialesVoz] = useState(null);

  useEffect(() => {
    const handleVoiceCommand = (e) => {
      if (e.detail && e.detail.type === 'plate') {
        setDatosInicialesVoz({
          placa: e.detail.data,
          tipo: e.detail.vehicleType
        });
        setModalEntradaAbierto(true);
      }
    };

    window.addEventListener('voiceCommand', handleVoiceCommand);
    return () => window.removeEventListener('voiceCommand', handleVoiceCommand);
  }, []);

  const cargarVehiculos = async () => {
    setCargando(true);
    try {
      const response = await movimientosAPI.obtenerEnParqueadero();
      const data = response.data.data.movimientos;
      setVehiculos(data);
      setVehiculosFiltrados(data);
    } catch (error) {
      toast.error('Error al cargar vehículos');
    } finally {
      setCargando(false);
    }
  };

  const cargarReservas = async () => {
    setCargando(true);
    try {
      const response = await reservasAPI.obtenerTodas();
      // Filtrar solo las confirmadas/activas para que el empleado las vea
      const todas = response.data?.data?.reservas || response.data?.data || [];
      setReservasPendientes(todas.filter(r => r.estado === 'confirmada' || r.estado === 'activa'));
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // Filter vehicles or reservations by plate search
  useEffect(() => {
    if (tabActiva === 'activos') {
      if (!busqueda.trim()) {
        setVehiculosFiltrados(vehiculos);
      } else {
        setVehiculosFiltrados(
          vehiculos.filter(v =>
            v.placa?.toLowerCase().includes(busqueda.toLowerCase())
          )
        );
      }
    } else {
      if (!busqueda.trim()) {
        setVehiculosFiltrados(reservasPendientes);
      } else {
        setVehiculosFiltrados(
          reservasPendientes.filter(r =>
            r.vehiculo_placa?.toLowerCase().includes(busqueda.toLowerCase())
          )
        );
      }
    }
  }, [busqueda, vehiculos, reservasPendientes, tabActiva]);

  useEffect(() => {
    if (tabActiva === 'activos') {
      cargarVehiculos();
    } else {
      cargarReservas();
    }
  }, [tabActiva]);

  const handleRegistrarEntrada = async (datos) => {
    try {
      await movimientosAPI.registrarEntrada({
        ...datos,
        usuario_registro_id: usuario.id
      });
      if (datos.reserva_id) {
        // Marcar la reserva como utilizada
        await reservasAPI.confirmarLlegada(datos.reserva_id);
      }
      toast.success('Entrada registrada exitosamente');
      if (tabActiva === 'activos') cargarVehiculos();
      else cargarReservas();
    } catch (error) {
      toast.error(error.message || 'Error al registrar entrada');
    }
  };

  const handleRegistrarSalida = async (movimientoId, datos) => {
    await movimientosAPI.registrarSalida(movimientoId, datos);
    toast.success('Salida registrada exitosamente');
    cargarVehiculos();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión Operativa</h1>
          <p className="text-slate-400 mt-1">Controla vehículos en sitio y reservas entrantes</p>
        </div>
        <button onClick={() => setModalEntradaAbierto(true)} className="btn-premium flex items-center gap-2 self-start shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.2)]">
          <Car className="w-5 h-5" />
          <span>Nueva Entrada</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-1 overflow-x-auto">
        <button
          onClick={() => setTabActiva('activos')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all relative whitespace-nowrap ${
            tabActiva === 'activos' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Car className="w-4 h-4" /> <span className="hidden sm:inline">Vehículos </span>Activos
          {tabActiva === 'activos' && (
            <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-gpa-blue shadow-[0_0_10px_rgba(var(--color-gpa-blue),0.8)]" />
          )}
        </button>
        <button
          onClick={() => setTabActiva('reservas')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all relative whitespace-nowrap ${
            tabActiva === 'reservas' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <CalendarDays className="w-4 h-4" /> <span className="hidden sm:inline">Reservas </span>Pendientes
          {tabActiva === 'reservas' && (
            <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-gpa-cyan shadow-[0_0_10px_rgba(var(--color-gpa-cyan),0.8)]" />
          )}
        </button>
      </div>

      {/* Stats rápidas (Solo para activos) */}
      {tabActiva === 'activos' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
          <div className="glass-card p-4 sm:p-6 border-white/5 hover:border-white/20 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-400" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2">Total Activos</p>
            <p className="text-3xl sm:text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">{vehiculos.length}</p>
          </div>
          <div className="glass-card p-4 sm:p-6 bg-orange-500/5 border-orange-500/10 hover:border-orange-500/30 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
            <p className="text-xs font-bold text-orange-400/80 uppercase tracking-wider mb-1 sm:mb-2">Motos</p>
            <p className="text-3xl sm:text-4xl font-black text-orange-400 group-hover:scale-105 transition-transform origin-left">
              {vehiculos.filter(v => v.vehiculo_tipo === 'moto').length}
            </p>
          </div>
          <div className="glass-card p-4 sm:p-6 bg-gpa-blue/5 border-gpa-blue/10 hover:border-gpa-blue/30 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gpa-blue" />
            <p className="text-xs font-bold text-gpa-blue/80 uppercase tracking-wider mb-1 sm:mb-2">Carros</p>
            <p className="text-3xl sm:text-4xl font-black text-gpa-blue group-hover:scale-105 transition-transform origin-left">
              {vehiculos.filter(v => v.vehiculo_tipo === 'carro').length}
            </p>
          </div>
          <div className="glass-card p-4 sm:p-6 bg-purple-500/5 border-purple-500/10 hover:border-purple-500/30 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <p className="text-xs font-bold text-purple-400/80 uppercase tracking-wider mb-1 sm:mb-2">Camionetas</p>
            <p className="text-3xl sm:text-4xl font-black text-purple-400 group-hover:scale-105 transition-transform origin-left">
              {vehiculos.filter(v => v.vehiculo_tipo === 'camioneta').length}
            </p>
          </div>
        </div>
      )}

      {/* Lista Principal */}
      <div className="glass-card border-white/5 overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">
            {tabActiva === 'activos' ? 'Vehículos Estacionados' : 'Reservas Pendientes del Día'}
          </h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
              placeholder="Buscar por placa..."
              className="glass-input pl-11 w-full sm:w-72"
            />
          </div>
        </div>

        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin" />
          </div>
        ) : vehiculosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Placa</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                  {tabActiva === 'activos' ? (
                    <>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Plaza</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hora Entrada</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sede</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Llegada Est.</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Código QR</th>
                    </>
                  )}
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehiculosFiltrados.map((item) => {
                  if (tabActiva === 'activos') {
                    const fechaEntrada = new Date(item.fecha_entrada);
                    const horas = ((new Date() - fechaEntrada) / (1000 * 60 * 60)).toFixed(1);

                    return (
                      <tr key={item.movimiento_id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4 align-middle font-black text-white tracking-widest">{item.placa}</td>
                        <td className="p-4 align-middle capitalize text-slate-300 font-medium">{item.vehiculo_tipo}</td>
                        <td className="p-4 align-middle text-slate-300">{item.plaza_nombre}</td>
                        <td className="p-4 align-middle text-slate-400 font-medium">{fechaEntrada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-4 align-middle font-bold text-gpa-cyan">{horas}h</td>
                        <td className="p-4 align-middle text-right">
                          <button
                            onClick={() => setModalSalida({ abierto: true, movimiento: item })}
                            className="px-4 py-2 rounded-lg bg-gpa-blue/10 text-gpa-blue border border-gpa-blue/20 hover:bg-gpa-blue hover:text-white transition-colors font-bold text-sm shadow-[0_0_10px_rgba(var(--color-gpa-blue),0.1)]"
                          >
                            Salida
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4 align-middle font-black text-white tracking-widest">{item.vehiculo_placa}</td>
                        <td className="p-4 align-middle capitalize text-slate-300 font-medium">{item.vehiculo_tipo}</td>
                        <td className="p-4 align-middle text-slate-300">{item.parqueaderos?.nombre || 'Sede GPA'}</td>
                        <td className="p-4 align-middle text-slate-400 font-medium">{new Date(item.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-4 align-middle font-bold text-slate-300 font-mono text-xs">{item.codigo_reserva}</td>
                        <td className="p-4 align-middle text-right">
                          <button
                            onClick={() => {
                                setDatosInicialesVoz({ placa: item.vehiculo_placa, tipo: item.vehiculo_tipo, reservaId: item.id });
                                setModalEntradaAbierto(true);
                            }}
                            className="px-4 py-2 rounded-lg bg-gpa-cyan/10 text-gpa-cyan border border-gpa-cyan/20 hover:bg-gpa-cyan hover:text-white transition-colors font-bold text-sm shadow-[0_0_10px_rgba(var(--color-gpa-cyan),0.1)] flex items-center justify-end gap-1.5 w-full max-w-[140px] ml-auto"
                          >
                            <Car className="w-4 h-4" /> Ingresar
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              {tabActiva === 'activos' ? <Car className="w-8 h-8 text-slate-500" /> : <CalendarDays className="w-8 h-8 text-slate-500" />}
            </div>
            <p className="text-xl font-bold text-white mb-2">
              {tabActiva === 'activos' ? 'Parqueadero Vacío' : 'Sin Reservas Pendientes'}
            </p>
            <p className="text-slate-400">
              {tabActiva === 'activos' ? 'No hay vehículos registrados en este momento' : 'No hay reservas confirmadas pendientes por ingresar.'}
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalEntrada
        abierto={modalEntradaAbierto}
        onClose={() => {
            setModalEntradaAbierto(false);
            setDatosInicialesVoz(null);
        }}
        onRegistrar={handleRegistrarEntrada}
        datosIniciales={datosInicialesVoz}
      />

      <ModalSalida
        abierto={modalSalida.abierto}
        movimiento={modalSalida.movimiento}
        onClose={() => setModalSalida({ abierto: false, movimiento: null })}
        onConfirmar={handleRegistrarSalida}
      />
    </div>
  );
}
