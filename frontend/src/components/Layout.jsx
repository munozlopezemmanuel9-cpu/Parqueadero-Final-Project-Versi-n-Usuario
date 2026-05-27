/**
 * Layout Principal de la Aplicación
 *
 * Contiene el sidebar de navegación y el área de contenido principal.
 * Se usa en todas las páginas protegidas de la aplicación.
 *
 * IMPORTANTE: El sistema de roles diferencia claramente entre:
 * - Admin: Acceso total al sistema (incluyendo gestión de usuarios)
 * - Empleado: Acceso operativo (vehículos, plazas, historial) SIN gestión de usuarios
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  ParkingSquare,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  MapPin,
  Shield,
  UserCheck,
} from 'lucide-react';

/**
 * Menú lateral de navegación
 *
 * @param {Object} props - Props del componente
 * @param {boolean} props.abierto - Estado del menú en móvil
 * @param {Function} props.onCerrar - Función para cerrar el menú
 */
function Sidebar({ abierto, onCerrar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, isAdmin, logout } = useAuth();

  // Definición de items del menú con control de roles estricto
  const menuItems = [
    {
      titulo: 'Dashboard',
      icon: LayoutDashboard,
      ruta: '/dashboard',
      roles: ['admin'], // SOLO ADMIN - Los empleados no ven ingresos ni gráficos
      descripcion: 'Panel principal con estadísticas',
      adminOnly: true,
    },
    {
      titulo: 'Vehículos en Parqueadero',
      icon: Car,
      ruta: '/vehiculos',
      roles: ['admin', 'empleado'],
      descripcion: 'Gestión de entradas y salidas',
    },
    {
      titulo: 'Plazas',
      icon: ParkingSquare,
      ruta: '/plazas',
      roles: ['admin', 'empleado'],
      descripcion: 'Estado de espacios',
    },
    {
      titulo: 'Historial',
      icon: History,
      ruta: '/historial',
      roles: ['admin', 'empleado'],
      descripcion: 'Registro de movimientos',
    },
    {
      titulo: 'Usuarios',
      icon: Users,
      ruta: '/usuarios',
      roles: ['admin'],  // SOLO ADMIN - Los empleados NO pueden acceder
      descripcion: 'Gestión de usuarios del sistema',
      adminOnly: true,
    },
  ];

  // Filtrar items según rol del usuario de forma estricta
  const itemsVisibles = menuItems.filter(item => {
    // Si el item es solo para admin, verificar que el usuario sea admin
    if (item.adminOnly) {
      return usuario?.rol === 'admin';
    }
    // Para otros items, verificar que el rol esté en la lista permitida
    return item.roles.includes(usuario?.rol);
  });

  /**
   * Manejar cierre de sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
    onCerrar();
  };

  return (
    <>
      {/* Overlay para móvil */}
      {abierto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden fade-in"
          onClick={onCerrar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 text-white
          transform transition-transform duration-300 ease-in-out
          ${abierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gpa-blue/20 border border-gpa-blue/30 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gpa-blue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">GPA</h1>
                <p className="text-xs text-gpa-400">Parqueadero</p>
              </div>
            </div>
            <button
              onClick={onCerrar}
              className="lg:hidden p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {itemsVisibles.map((item) => {
              const Icono = item.icon;
              const activo = location.pathname === item.ruta;

              return (
                <Link
                  key={item.ruta}
                  to={item.ruta}
                  onClick={onCerrar}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 border
                    ${activo
                      ? 'bg-gpa-blue/10 border-gpa-blue/30 text-gpa-blue shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.2)]'
                      : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icono className="w-5 h-5" />
                  <span className="font-medium">{item.titulo}</span>
                  {activo && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Información del usuario con indicador de rol */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card bg-white/5 border-white/5">
              <div className={`w-10 h-10 ${isAdmin ? 'bg-purple-500/20 border-purple-500/30' : 'bg-gpa-blue/20 border-gpa-blue/30'} border rounded-full flex items-center justify-center`}>
                <span className={`text-sm font-bold ${isAdmin ? 'text-purple-400' : 'text-gpa-blue'}`}>
                  {usuario?.nombre?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {usuario?.nombre}
                </p>
                <div className="flex items-center gap-1.5">
                  {isAdmin ? (
                    <>
                      <Shield className="w-3 h-3 text-purple-400" />
                      <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Administrador</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3 h-3 text-gpa-cyan" />
                      <span className="text-xs text-gpa-cyan font-bold uppercase tracking-wider">Empleado</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Indicador de permisos */}
            {isAdmin && (
              <div className="mt-3 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Acceso Total al Sistema
                </p>
              </div>
            )}

            {/* Botón cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5
                       glass-card bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400
                       rounded-xl transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/**
 * Componente Layout principal
 *
 * @param {Object} props - Props de React
 * @param {ReactNode} props.children - Contenido de la página
 */
export default function Layout({ children }) {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  
  // Interactive Background State
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-slate-950 flex relative overflow-hidden"
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`
      }}
    >
      {/* Interactive Background Glows & Grid */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        
        {/* Subtle Grid overlay masked by mouse position */}
        <div 
          className="absolute inset-0 opacity-20 transition-opacity duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle 600px at var(--mouse-x) var(--mouse-y), black, transparent)',
            WebkitMaskImage: 'radial-gradient(circle 600px at var(--mouse-x) var(--mouse-y), black, transparent)'
          }}
        />

        {/* Glowing Orb 1: Tracks mouse exactly (Blue) */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[100px] transition-all duration-75 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-blue) 0%, transparent 70%)',
            left: 'calc(var(--mouse-x) - 300px)',
            top: 'calc(var(--mouse-y) - 300px)',
          }}
        />

        {/* Glowing Orb 2: Moves inversely to mouse (Purple) */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.08] blur-[120px] transition-all duration-500 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-purple) 0%, transparent 70%)',
            left: 'calc(100% - var(--mouse-x) - 400px)',
            top: 'calc(100% - var(--mouse-y) - 400px)',
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Header móvil */}
        <header className="lg:hidden glass-card rounded-none border-x-0 border-t-0 border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarAbierto(true)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gpa-blue/20 border border-gpa-blue/30 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gpa-blue" />
            </div>
            <span className="font-bold text-lg text-white">GPA</span>
          </div>
          <div className="w-10" />  {/* Espaciador para centrar */}
        </header>

        {/* Área de contenido */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
