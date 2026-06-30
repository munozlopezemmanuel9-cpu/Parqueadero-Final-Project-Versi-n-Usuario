/**
 * Página de Registro de Usuarios
 *
 * Diseño premium dark con glass morphism,
 * consistente con el resto del sistema GPA.
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Mail, Lock, User, Eye, EyeOff,
  ShieldCheck, Zap, ArrowRight, CheckCircle2,
  LayoutDashboard,
} from 'lucide-react';

const beneficios = [
  'Reserva tu cupo en menos de 2 minutos',
  'Código QR de acceso a la entrada',
  'Cancela gratis antes de tu llegada',
  'Guarda tus vehículos para reservar más rápido',
  'Historial y calificaciones de tus parqueaderos',
];

export default function Registro() {
  const { registro, isAuthenticated, usuario } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && usuario) {
      if (usuario.rol === 'cliente') {
        navigate('/mapa', { replace: true });
      } else if (usuario.rol === 'empleado') {
        navigate('/vehiculos', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, usuario, navigate]);


  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  // Mouse tracking
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  // Redirect handled by useEffect above


  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'nombre' ? value.replace(/^\s+/, '') : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  // Reglas de validación de contraseña
  const passwordRules = [
    { test: (p) => p.length >= 8, label: 'Mínimo 8 caracteres' },
    { test: (p) => p.length <= 12, label: 'Máximo 12 caracteres' },
    { test: (p) => /[a-z]/.test(p), label: 'Al menos una minúscula' },
    { test: (p) => /[A-Z]/.test(p), label: 'Al menos una mayúscula' },
    { test: (p) => /\d/.test(p), label: 'Al menos un número' },
    { test: (p) => /[^A-Za-z0-9]/.test(p), label: 'Al menos un carácter especial (!@#$...)' },
  ];

  const passwordPassed = passwordRules.filter(r => r.test(formData.password)).length;

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Nombre: solo letras y espacios, 3-100 chars
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    } else if (!/^[A-Za-zÁÉÍÓÚñáéíóúÑ\s]{3,100}$/.test(formData.nombre)) {
      nuevosErrores.nombre = 'Solo letras y espacios (3-100 caracteres)';
    }

    // Email: debe ser @gmail.com
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      nuevosErrores.email = 'El email debe ser un Gmail válido (@gmail.com)';
    }

    // Password: todas las reglas deben pasar
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es requerida';
    } else {
      const fallos = passwordRules.filter(r => !r.test(formData.password)).map(r => r.label);
      if (fallos.length > 0) {
        nuevosErrores.password = 'Falta: ' + fallos.join(', ');
      }
    }

    // Confirmar contraseña
    if (formData.password !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setCargando(true);
    try {
      const exito = await registro({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      setCargando(false);
      if (exito) {
        // Redirección manejada por useEffect una vez cargado el usuario
      }
    } catch (error) {
      setCargando(false);
      // Mostrar errores del backend campo por campo
      if (error.response?.data?.errores) {
        const backendErrors = {};
        error.response.data.errores.forEach(err => {
          backendErrors[err.campo] = err.mensaje;
        });
        setErrores(prev => ({ ...prev, ...backendErrors }));
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex bg-[#07070a] overflow-hidden relative"
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      }}
    >
      {/* Interactive background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-[0.12] blur-[130px] transition-all duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-purple) 0%, transparent 70%)',
            left: 'calc(var(--mouse-x) - 350px)',
            top: 'calc(var(--mouse-y) - 350px)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[100px] transition-all duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-blue) 0%, transparent 70%)',
            left: 'calc(100% - var(--mouse-x) - 250px)',
            top: 'calc(100% - var(--mouse-y) - 250px)',
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Watermark */}
        <div className="absolute bottom-8 right-8 text-[160px] font-black text-white/[0.015] select-none leading-none">
          GPA
        </div>
      </div>

      {/* Left panel — benefits */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-16 relative z-10">
        <div className="max-w-lg animate-fade-in">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-xl flex items-center justify-center shadow-lg shadow-gpa-blue/20 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                GPA<span className="text-gpa-blue">.</span>
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Parqueadero</p>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gpa-purple/10 border border-gpa-purple/20 text-gpa-purple text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" />
            Únete al sistema
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Empieza a gestionar
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gpa-blue via-gpa-purple to-gpa-cyan">
              tu parqueadero
            </span>
          </h1>

          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Crea tu cuenta y accede a todas las herramientas para automatizar y optimizar tu negocio.
          </p>

          {/* Benefits list */}
          <div className="space-y-3">
            {beneficios.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
              >
                <div className="w-6 h-6 rounded-full bg-gpa-blue/15 border border-gpa-blue/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gpa-blue" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-20">
        <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tighter">
              GPA<span className="text-gpa-blue">.</span>
            </span>
          </div>

          <div className="glass-card p-8 relative overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gpa-purple to-transparent opacity-60" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 glass-card bg-gpa-purple/10 border-gpa-purple/20 rounded-2xl mb-4">
                <ShieldCheck className="w-7 h-7 text-gpa-purple" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Crear Cuenta</h2>
              <p className="text-slate-400 text-sm">Únete al sistema GPA Parqueadero</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  Nombre Completo
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
                  <input
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`glass-input pl-11 ${errores.nombre ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                    placeholder="Juan Pérez"
                  />
                </div>
                {errores.nombre && (
                  <p className="text-xs text-red-400 ml-1">{errores.nombre}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`glass-input pl-11 ${errores.email ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                {errores.email && (
                  <p className="text-xs text-red-400 ml-1">{errores.email}</p>
                )}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
                    <input
                      name="password"
                      type={mostrarPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`glass-input pl-10 pr-10 ${errores.password ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errores.password && (
                    <p className="text-xs text-red-400 ml-1">{errores.password}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Confirmar
                  </label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
                    <input
                      name="confirmPassword"
                      type={mostrarConfirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`glass-input pl-10 pr-10 ${errores.confirmPassword ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirm(!mostrarConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {mostrarConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errores.confirmPassword && (
                    <p className="text-xs text-red-400 ml-1">{errores.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Password strength indicator — based on real rules */}
              {formData.password && (
                <div className="space-y-2 px-1">
                  {/* Strength bar */}
                  <div className="flex gap-1.5">
                    {passwordRules.map((rule, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          rule.test(formData.password)
                            ? passwordPassed === passwordRules.length
                              ? 'bg-green-500'
                              : passwordPassed >= 4
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Rule checklist */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    {passwordRules.map((rule, i) => (
                      <span
                        key={i}
                        className={`text-[10px] flex items-center gap-1 transition-colors ${
                          rule.test(formData.password) ? 'text-green-400' : 'text-slate-500'
                        }`}
                      >
                        {rule.test(formData.password) ? '✓' : '○'} {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="btn-premium w-full mt-2 flex items-center justify-center gap-2"
              >
                {cargando ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-gpa-blue hover:text-gpa-cyan font-semibold transition-colors">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
