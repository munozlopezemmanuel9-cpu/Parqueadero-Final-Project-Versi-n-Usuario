/**
 * App.jsx v3.0 — Ecosistema GPA Parqueaderos
 * Rutas para admin, empleado y cliente
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas Staff (admin/empleado)
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Vehiculos from './pages/Vehiculos';
import Plazas from './pages/Plazas';
import Historial from './pages/Historial';
import Usuarios from './pages/Usuarios';
import Landing from './pages/Landing';

// Páginas Cliente (NUEVAS)
import MapaParqueaderos from './pages/MapaParqueaderos';
import Reservar from './pages/Reservar';
import MisReservas from './pages/MisReservas';
import Perfil from './pages/Perfil';
import ClientPortal from './pages/ClientPortal';

// Componentes
import Layout from './components/Layout';
import LayoutCliente from './components/LayoutCliente';
import VoiceAssistant from './components/VoiceAssistant';
import FaqDrawer from './components/FaqDrawer';

/**
 * Ruta protegida para staff (admin/empleado)
 */
function RutaProtegida({ children, rolRequerido }) {
  const { isAuthenticated, isAdmin, isStaff, usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.5)]" />
          <p className="text-slate-400 font-bold tracking-widest uppercase">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (rolRequerido === 'admin' && !isAdmin) {
    console.warn(`Acceso denegado: ${usuario?.nombre} (${usuario?.rol})`);
    return <Navigate to="/vehiculos" replace />;
  }

  // Si es un cliente intentando acceder a rutas de staff, redirigirlo a su panel
  if (isAuthenticated && usuario?.rol === 'cliente') {
    return <Navigate to="/mapa" replace />;
  }

  return <Layout>{children}</Layout>;
}

/**
 * Ruta protegida para clientes
 */
function RutaCliente({ children }) {
  const { isAuthenticated, usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold tracking-widest uppercase">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Staff accediendo a rutas de cliente → redirigir a dashboard
  if (usuario?.rol === 'admin') return <Navigate to="/dashboard" replace />;
  if (usuario?.rol === 'empleado') return <Navigate to="/vehiculos" replace />;

  return <LayoutCliente>{children}</LayoutCliente>;
}

// Componente para animar rutas
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      {/* Rutas públicas */}
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/registro" element={<PageTransition><Registro /></PageTransition>} />

      {/* Rutas públicas — Mapa accesible sin login */}
      <Route path="/mapa" element={<PageTransition><MapaParqueaderos /></PageTransition>} />

      {/* Rutas del CLIENTE */}
      <Route path="/reservar/:parqueaderoId" element={<RutaCliente><PageTransition><Reservar /></PageTransition></RutaCliente>} />
      <Route path="/mis-reservas" element={<RutaCliente><PageTransition><MisReservas /></PageTransition></RutaCliente>} />
      <Route path="/perfil" element={<RutaCliente><PageTransition><Perfil /></PageTransition></RutaCliente>} />
      <Route path="/portal" element={<RutaCliente><PageTransition><ClientPortal /></PageTransition></RutaCliente>} />

      {/* Rutas de STAFF (admin/empleado) */}
      <Route path="/dashboard" element={<RutaProtegida rolRequerido="admin"><PageTransition><Dashboard /></PageTransition></RutaProtegida>} />
      <Route path="/vehiculos" element={<RutaProtegida><PageTransition><Vehiculos /></PageTransition></RutaProtegida>} />
      <Route path="/plazas" element={<RutaProtegida><PageTransition><Plazas /></PageTransition></RutaProtegida>} />
      <Route path="/historial" element={<RutaProtegida><PageTransition><Historial /></PageTransition></RutaProtegida>} />
      <Route path="/usuarios" element={<RutaProtegida rolRequerido="admin"><PageTransition><Usuarios /></PageTransition></RutaProtegida>} />

      {/* Default */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VoiceAssistant />
        <FaqDrawer />
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111116',
              color: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
            },
            success: { iconTheme: { primary: '#22d3ee', secondary: '#111116' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#111116' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
