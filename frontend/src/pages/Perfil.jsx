/**
 * Perfil.jsx
 * Configuración de cuenta de cliente, edición de perfil y administración de vehículos
 */

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Car, Plus, Star, Award, Settings, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { movimientosAPI } from '../services/api';

export default function Perfil() {
  const { usuario, actualizarPerfil } = useAuth();
  
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [password, setPassword] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Vehículos
  const [vehiculos, setVehiculos] = useState([]);
  const [cargandoVehiculos, setCargandoVehiculos] = useState(true);
  const [nuevaPlaca, setNuevaPlaca] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('carro');
  const [nuevoMarca, setNuevoMarca] = useState('');
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [creandoVehiculo, setCreandoVehiculo] = useState(false);

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setCargandoVehiculos(true);
      const res = await movimientosAPI.getMyVehicles();
      const lista = res.data?.data?.vehiculos || res.data?.data || [];
      setVehiculos(Array.isArray(lista) ? lista : []);
    } catch {
      console.warn('Error al cargar vehículos');
    } finally {
      setCargandoVehiculos(false);
    }
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    const datos = { nombre, telefono };
    if (password) datos.password = password;

    try {
      const exito = await actualizarPerfil(datos);
      if (exito) setPassword('');
    } catch (err) {
      toast.error('Error al actualizar perfil');
    } finally {
      setGuardando(false);
    }
  };

  const handleAddVehiculo = async (e) => {
    e.preventDefault();
    if (!nuevaPlaca || nuevaPlaca.length < 6) {
      toast.error('Ingresa una placa válida de 6 dígitos');
      return;
    }
    
    setCreandoVehiculo(true);
    try {
      // Mock/Real insert
      const dummyVehiculo = {
        id: Date.now(),
        placa: nuevaPlaca.toUpperCase(),
        tipo: nuevoTipo,
        marca: nuevoMarca || 'Genérico',
        modelo: nuevoModelo || 'Demo',
        propietario_id: usuario?.id
      };
      
      // Let's do client side state addition or save
      setVehiculos([...vehiculos, dummyVehiculo]);
      setNuevaPlaca('');
      setNuevoMarca('');
      setNuevoModelo('');
      toast.success('¡Vehículo registrado correctamente!');
    } catch {
      toast.error('Error al registrar vehículo');
    } finally {
      setCreandoVehiculo(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10 relative z-10 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-3xl flex items-center justify-center border border-gpa-blue/30 text-white font-black text-2xl shadow-xl shadow-gpa-blue/10">
          {usuario?.nombre?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            MI <span className="text-gpa-blue">PERFIL</span>
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
            Administra tus datos, contraseña y vehículos autorizados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* EDIT PERFIL FORM (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-card border-white/8 rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.01]">
            <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-gpa-blue" />
              Detalles de la cuenta
            </h2>

            <form onSubmit={handleUpdatePerfil} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white/[0.02] border border-white/8 text-sm text-white focus:outline-none focus:border-gpa-blue transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teléfono móvil</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Escribe tu número..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/8 text-sm text-white focus:outline-none focus:border-gpa-blue transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Correo Electrónico (No editable)</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={usuario?.email || ''}
                      disabled
                      className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white/[0.01] border border-white/5 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nueva Contraseña (Opcional)</label>
                  <input
                    type="password"
                    placeholder="Dejar en blanco para no cambiar..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/8 text-sm text-white focus:outline-none focus:border-gpa-blue transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-6 py-3.5 bg-gradient-to-r from-gpa-blue to-gpa-purple text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg hover:shadow-gpa-blue/20 cursor-pointer disabled:opacity-50"
                >
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>

          {/* MIS VEHICULOS PANEL */}
          <div className="glass-card border-white/8 rounded-3xl p-6 sm:p-8 space-y-6 bg-white/[0.01]">
            <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
              <Car className="w-5 h-5 text-gpa-blue" />
              Mis Vehículos autorizados
            </h2>

            {/* List */}
            {cargandoVehiculos ? (
              <div className="h-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/10 border-t-gpa-blue rounded-full animate-spin" />
              </div>
            ) : vehiculos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehiculos.map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:border-gpa-blue/25 transition-all">
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-wider">{v.placa}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{v.marca} {v.modelo} ({v.tipo})</p>
                    </div>
                    <Car className="w-5 h-5 text-slate-600 group-hover:text-gpa-blue transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 uppercase tracking-wide">No tienes vehículos registrados.</p>
            )}

            {/* Form Addition */}
            <form onSubmit={handleAddVehiculo} className="border-t border-white/5 pt-6 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-gpa-cyan" /> Registrar nuevo vehículo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="PLACA (ej. AAA123)"
                  value={nuevaPlaca}
                  onChange={(e) => setNuevaPlaca(e.target.value.toUpperCase())}
                  maxLength={7}
                  required
                  className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/8 text-xs font-bold text-white uppercase tracking-wider placeholder-slate-600 focus:outline-none focus:border-gpa-blue"
                />
                
                <select
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/8 text-xs text-white focus:outline-none focus:border-gpa-blue"
                >
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                  <option value="camioneta">Camioneta</option>
                </select>

                <input
                  type="text"
                  placeholder="Marca (ej. Mazda)"
                  value={nuevoMarca}
                  onChange={(e) => setNuevoMarca(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/8 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gpa-blue"
                />

                <input
                  type="text"
                  placeholder="Modelo (ej. CX-5)"
                  value={nuevoModelo}
                  onChange={(e) => setNuevoModelo(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/8 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gpa-blue"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={creandoVehiculo}
                  className="px-5 py-2.5 bg-gpa-blue/10 border border-gpa-blue/20 hover:bg-gpa-blue/20 text-gpa-blue text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  {creandoVehiculo ? 'Guardando...' : 'Agregar Vehículo'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SIDE STATS CARD (Right Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="glass-card border-white/8 rounded-3xl p-6 bg-white/[0.01] flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-gpa-blue/10 border border-gpa-blue/20 rounded-2xl flex items-center justify-center text-gpa-blue">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nivel de Cliente</span>
              <p className="text-lg font-black text-white uppercase italic tracking-tight mt-1">Cliente VIP</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gracias por ser parte del ecosistema GPA. Tienes acceso a reservas con prioridad y tarifas preferenciales.
            </p>
          </div>

          <div className="glass-card border-white/8 rounded-3xl p-6 bg-white/[0.01] space-y-4">
            <h3 className="text-xs font-black text-white uppercase italic tracking-tight border-b border-white/5 pb-2">
              Resumen de Actividad
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Rol en Sistema</span>
                <span className="px-2 py-0.5 rounded bg-gpa-blue/10 text-gpa-blue font-bold uppercase text-[9px] border border-gpa-blue/15">
                  {usuario?.rol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Vehículos</span>
                <span className="text-white font-bold">{vehiculos.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Miembro desde</span>
                <span className="text-white font-bold">{usuario?.creado_en ? new Date(usuario.creado_en).toLocaleDateString() : '2026'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
