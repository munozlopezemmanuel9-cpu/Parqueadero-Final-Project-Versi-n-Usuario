/**
 * LayoutCliente.jsx
 * Layout para usuarios con rol 'cliente'
 * Barra de navegación superior + contenido principal
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Map, CalendarCheck, User, LogOut, Menu, X,
  MapPin, Bell, ChevronDown, Search, Home
} from 'lucide-react';

const navItems = [
  { titulo: 'Inicio', icon: Home, ruta: '/' },
  { titulo: 'Buscar Parqueadero', icon: Map, ruta: '/mapa' },
  { titulo: 'Mis Reservas', icon: CalendarCheck, ruta: '/mis-reservas' },
  { titulo: 'Mi Perfil', icon: User, ruta: '/perfil' },
];

export default function LayoutCliente({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      </div>

      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#0a0a0d]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gpa-blue/20 border border-gpa-blue/30 rounded-xl flex items-center justify-center group-hover:bg-gpa-blue/30 transition-colors">
                <MapPin className="w-5 h-5 text-gpa-blue" />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-white text-lg tracking-tight">GPA</span>
                <span className="text-gpa-blue text-lg font-black"> Parqueaderos</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Ico = item.icon;
                const activo = location.pathname === item.ruta;
                return (
                  <Link
                    key={item.ruta}
                    to={item.ruta}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activo
                        ? 'bg-gpa-blue/15 text-gpa-blue border border-gpa-blue/25'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Ico className="w-4 h-4" />
                    {item.titulo}
                  </Link>
                );
              })}
            </div>

            {/* Right: profile + mobile toggle */}
            <div className="flex items-center gap-3">
              {/* Reservar CTA */}
              <Link
                to="/mapa"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gpa-blue to-gpa-purple text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-gpa-blue/25 transition-all duration-300 hover:scale-105"
              >
                <Search className="w-4 h-4" />
                Buscar
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/8 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-full flex items-center justify-center text-xs font-black text-white">
                    {usuario?.nombre?.charAt(0)?.toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-card border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-sm font-bold text-white truncate">{usuario?.nombre}</p>
                      <p className="text-xs text-slate-500 truncate">{usuario?.email}</p>
                    </div>
                    <Link to="/perfil" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors">
                      <User className="w-4 h-4" /> Mi Perfil
                    </Link>
                    <Link to="/mis-reservas" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors">
                      <CalendarCheck className="w-4 h-4" /> Mis Reservas
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors mt-1">
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="md:hidden p-2 rounded-xl hover:bg-white/8 text-slate-400"
              >
                {menuAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuAbierto && (
          <div className="md:hidden border-t border-white/8 bg-[#0a0a0d] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Ico = item.icon;
              const activo = location.pathname === item.ruta;
              return (
                <Link
                  key={item.ruta}
                  to={item.ruta}
                  onClick={() => setMenuAbierto(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activo ? 'bg-gpa-blue/15 text-gpa-blue' : 'text-slate-400'
                  }`}
                >
                  <Ico className="w-4 h-4" />
                  {item.titulo}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="relative z-10 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer mínimo */}
      <footer className="relative z-10 border-t border-white/5 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-slate-600">© 2025 GPA Parqueaderos · Medellín, Colombia</p>
          <p className="text-xs text-slate-700">v3.0 Ecosistema Inteligente</p>
        </div>
      </footer>
    </div>
  );
}
