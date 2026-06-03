/**
 * Contexto de Autenticación
 *
 * Provee el estado de autenticación a toda la aplicación
 * y maneja las funciones de login, logout y registro.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

// Crear el contexto
const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 *
 * @returns {Object} Estado y funciones de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}

/**
 * Proveedor del contexto de autenticación
 *
 * @param {Object} props - Props de React
 * @param {ReactNode} props.children - Componentes hijos
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cargando, setCargando] = useState(true);

  /**
   * Verificar si hay sesión al cargar la aplicación
   */
  useEffect(() => {
    const verificarSesion = async () => {
      const tokenGuardado = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (tokenGuardado && usuarioGuardado) {
        try {
          // Opcional: verificar token con el backend
          // const response = await authAPI.obtenerPerfil();
          // setUsuario(response.data.data.usuario);

          // Usar datos guardados (más rápido, sin llamada API)
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

  /**
   * Iniciar sesión
   *
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<boolean>} Éxito de la operación
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { usuario: usuarioData, token: nuevoToken } = response.data.data;

      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));

      // Actualizar estado
      setUsuario(usuarioData);
      setToken(nuevoToken);

      toast.success(`¡Bienvenido, ${usuarioData.nombre}!`);

      return true;
    } catch (error) {
      const mensaje = error.message || 'Error al iniciar sesión';
      toast.error(mensaje);
      return false;
    }
  };

  /**
   * Registrar nuevo usuario
   *
   * @param {Object} datos - Datos del usuario
   * @returns {Promise<boolean>} Éxito de la operación
   */
  const registro = async (datos) => {
    try {
      const response = await authAPI.registro(datos);
      const { usuario: usuarioData, token: nuevoToken } = response.data.data;

      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));

      // Actualizar estado
      setUsuario(usuarioData);
      setToken(nuevoToken);

      toast.success('Usuario registrado exitosamente');

      return true;
    } catch (error) {
      // Si hay errores de validación, mostrar cada uno
      if (error.response?.data?.errores) {
        error.response.data.errores.forEach(err => {
          toast.error(`${err.campo}: ${err.mensaje}`);
        });
      } else {
        const mensaje = error.response?.data?.message || error.message || 'Error al registrar usuario';
        toast.error(mensaje);
      }
      return false;
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setToken(null);
    toast.success('Sesión cerrada correctamente');
  };

  /**
   * Actualizar perfil del usuario
   *
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<boolean>} Éxito de la operación
   */
  const actualizarPerfil = async (datos) => {
    try {
      const response = await authAPI.actualizarPerfil(datos);
      const { usuario: usuarioActualizado } = response.data.data;

      // Actualizar estado y localStorage
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

      toast.success('Perfil actualizado correctamente');

      return true;
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(mensaje);
      return false;
    }
  };

  // Valor del contexto que se proveerá a los hijos
  const valor = {
    usuario,
    token,
    cargando,
    isAuthenticated: !!token && !!usuario,
    isAdmin: usuario?.rol === 'admin',
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
