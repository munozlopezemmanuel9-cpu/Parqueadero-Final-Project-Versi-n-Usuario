/**
 * Contexto de Autenticación v3.0
 * Soporte para roles: admin, empleado, cliente
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const tokenGuardado = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');
      if (tokenGuardado && usuarioGuardado) {
        try {
          setUsuario(JSON.parse(usuarioGuardado));
          setToken(tokenGuardado);
        } catch (error) {
          console.error('Error al verificar sesión:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
        }
      }
      setCargando(false);
    };
    verificarSesion();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { usuario: usuarioData, token: nuevoToken } = response.data.data;
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData);
      setToken(nuevoToken);
      toast.success(`¡Bienvenido, ${usuarioData.nombre}!`);
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
      return false;
    }
  };

  const registro = async (datos) => {
    try {
      const response = await authAPI.registro(datos);
      const { usuario: usuarioData, token: nuevoToken } = response.data.data;
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData);
      setToken(nuevoToken);
      toast.success('¡Cuenta creada exitosamente!');
      return true;
    } catch (error) {
      if (error.response?.data?.errores) {
        error.response.data.errores.forEach(err => toast.error(`${err.campo}: ${err.mensaje}`));
      } else {
        toast.error(error.message || 'Error al registrar usuario');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setToken(null);
    toast.success('Sesión cerrada correctamente');
  };

  const actualizarPerfil = async (datos) => {
    try {
      const response = await authAPI.actualizarPerfil(datos);
      const { usuario: usuarioActualizado } = response.data.data;
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      toast.success('Perfil actualizado correctamente');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar perfil');
      return false;
    }
  };

  const valor = {
    usuario,
    token,
    cargando,
    isAuthenticated: !!token && !!usuario,
    isAdmin: usuario?.rol === 'admin',
    isEmpleado: usuario?.rol === 'empleado',
    isCliente: usuario?.rol === 'cliente',
    isStaff: usuario?.rol === 'admin' || usuario?.rol === 'empleado',
    login,
    logout,
    registro,
    actualizarPerfil,
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
