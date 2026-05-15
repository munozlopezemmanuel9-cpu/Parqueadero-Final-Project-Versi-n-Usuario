/**
 * Página de Registro de Usuarios
 * 
 * Permite a nuevos usuarios crear una cuenta en el sistema.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Registro() {
  const navigate = useNavigate();
  const { registro, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }
    if (formData.password.length < 6) {
      nuevosErrores.password = 'Mínimo 6 caracteres';
    }
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
    const exito = await registro({
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password
    });
    setCargando(false);
    if (exito) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gpa-500 to-gpa-700 rounded-2xl shadow-lg mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="mt-2 text-gray-600">Únete al sistema GPA Parqueadero</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errores.nombre ? 'border-danger-500' : ''}`}
                  placeholder="Juan Pérez"
                />
              </div>
              {errores.nombre && <p className="text-xs text-danger-500 mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errores.email ? 'border-danger-500' : ''}`}
                  placeholder="juan@ejemplo.com"
                />
              </div>
              {errores.email && <p className="text-xs text-danger-500 mt-1">{errores.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errores.password ? 'border-danger-500' : ''}`}
                    placeholder="••••••"
                  />
                </div>
                {errores.password && <p className="text-xs text-danger-500 mt-1">{errores.password}</p>}
              </div>
              <div>
                <label className="input-label">Confirmar</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type={mostrarPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errores.confirmPassword ? 'border-danger-500' : ''}`}
                    placeholder="••••••"
                  />
                </div>
                {errores.confirmPassword && <p className="text-xs text-danger-500 mt-1">{errores.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full btn-primary py-3 mt-4"
            >
              {cargando ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-gpa-600 hover:text-gpa-500">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-gpa-900 via-gpa-800 to-gpa-900 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Empieza hoy mismo</h2>
          <p className="text-gpa-200 text-lg">Optimiza la gestión de tu parqueadero con nuestra plataforma líder.</p>
        </div>
      </div>
    </div>
  );
}
