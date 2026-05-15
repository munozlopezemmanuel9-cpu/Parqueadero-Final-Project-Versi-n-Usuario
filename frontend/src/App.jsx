/**
 * Componente Principal de la Aplicación GPA
 *
 * Configura el enrutamiento y provee los contextos
 * necesarios para toda la aplicación.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Vehiculos from './pages/Vehiculos';
import Plazas from './pages/Plazas';
import Historial from './pages/Historial';
import Usuarios from './pages/Usuarios';

// Componentes
import Layout from './components/Layout';

/**
 * Ruta protegida
 *
 * Redirige al login si el usuario no está autenticado.
 * También verifica el rol si se requiere uno específico.
 *
 * @param {Object} props - Props de la ruta
 * @param {ReactNode} props.children - Componente a renderizar
 * @param {string} props.rolRequerido - Rol requerido (opcional)
 */
function RutaProtegida({ children, rolRequerido }) {
  const { isAuthenticated, isAdmin, cargando } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      {children}
    </Layout>
  );
}

/**
 * Componente de Rutas de la Aplicación
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />
      <Route
        path="/vehiculos"
        element={
          <RutaProtegida>
            <Vehiculos />
          </RutaProtegida>
        }
      />
      <Route
        path="/plazas"
        element={
          <RutaProtegida>
            <Plazas />
          </RutaProtegida>
        }
      />
      <Route
        path="/historial"
        element={
          <RutaProtegida>
            <Historial />
          </RutaProtegida>
        }
      />
      <Route
        path="/usuarios"
        element={
          <RutaProtegida rolRequerido="admin">
            <Usuarios />
          </RutaProtegida>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

/**
 * Componente Raíz de la Aplicación
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {/* Toast notifications */}
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
            success: {
              iconTheme: {
                primary: '#22d3ee', // gpa-cyan
                secondary: '#111116',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // red
                secondary: '#111116',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
