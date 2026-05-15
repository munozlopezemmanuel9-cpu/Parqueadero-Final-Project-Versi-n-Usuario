import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Form State
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  // Mouse tracking for interactive background
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.email.trim()) nuevosErrores.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = 'Email inválido';
    if (!formData.password) nuevosErrores.password = 'La contraseña es requerida';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setCargando(true);
    const exito = await login(formData.email, formData.password);
    setCargando(false);
    if (exito) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex bg-[#0a0a0c] overflow-hidden relative"
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`
      }}
    >
      {/* --- BACKGROUND INTERACTIVE ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic Glow following mouse */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] transition-all duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-blue) 0%, transparent 70%)',
            left: 'calc(var(--mouse-x) - 300px)',
            top: 'calc(var(--mouse-y) - 300px)',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] transition-all duration-500 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-purple) 0%, transparent 70%)',
            left: 'calc(100% - var(--mouse-x) - 200px)',
            top: 'calc(100% - var(--mouse-y) - 200px)',
          }}
        />
        
        {/* GPA Watermark */}
        <div className="absolute bottom-10 left-10 text-[180px] font-black text-white/[0.02] select-none leading-none">
          GPA
        </div>
      </div>

      {/* --- LEFT SECTION: DECORATIVE --- */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-16 relative z-10">
        <div className="max-w-xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gpa-blue/10 border border-gpa-blue/20 text-gpa-blue text-xs font-bold uppercase tracking-wider mb-8">
            <Zap className="w-3 h-3" />
            SaaS Inteligente
          </div>
          
          <h1 className="text-6xl font-extrabold text-white leading-tight mb-6">
            Gestión de Parqueadero <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gpa-blue via-gpa-purple to-gpa-cyan">
              Automático
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg mb-12 max-w-md">
            Optimiza cada espacio, automatiza ingresos y obtén analíticas en tiempo real con la plataforma líder en gestión vehicular.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: ShieldCheck, title: 'Seguridad E2E', desc: 'Cifrado nivel empresarial' },
              { icon: BarChart3, title: 'Analíticas', desc: 'Reportes en tiempo real' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 border-white/5 hover:border-gpa-blue/30 transition-colors group">
                <item.icon className="w-8 h-8 text-gpa-blue mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: LOGIN FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-20">
        <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-10 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gpa-blue to-transparent opacity-50" />
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 glass-card bg-gpa-blue/10 border-gpa-blue/20 rounded-2xl mb-6 group cursor-default">
                <MapPin className="w-8 h-8 text-gpa-blue group-hover:rotate-12 transition-transform" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
              <p className="text-slate-400">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@gpa.com"
                    className={`glass-input pl-12 ${errores.email ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                  />
                </div>
                {errores.email && <p className="text-xs text-red-400 mt-1 ml-1">{errores.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-medium text-slate-300">Contraseña</label>
                  <Link to="#" className="text-xs text-gpa-blue hover:text-gpa-cyan transition-colors">¿Olvidaste tu contraseña?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`glass-input pl-12 pr-12 ${errores.password ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {mostrarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errores.password && <p className="text-xs text-red-400 mt-1 ml-1">{errores.password}</p>}
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="btn-premium w-full mt-4"
              >
                {cargando ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Autenticando...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro" className="text-gpa-blue hover:text-gpa-cyan font-semibold transition-colors">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>
          
          {/* Test Credentials Badge */}
          <div className="mt-6 p-4 glass-card border-dashed border-white/10 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Credenciales de Acceso</p>
             <div className="flex justify-center gap-4 text-xs">
                <code className="text-gpa-blue bg-gpa-blue/5 px-2 py-1 rounded">admin@gpa.com / admin123</code>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
