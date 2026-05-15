/**
 * Página de Gestión de Usuarios
 *
 * Solo accesible para administradores.
 * Permite crear, editar y eliminar usuarios.
 */

import { useState, useEffect } from 'react';
import { usuariosAPI } from '../services/api';
import { UserPlus, Search, Edit2, Trash2, User, Shield, UserCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Modal para crear/editar usuario
 */
function ModalUsuario({ abierto, onClose, onSave, usuarioEditar }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'empleado',
  });
  const [cargando, setCargando] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (usuarioEditar) {
      setFormData({
        nombre: usuarioEditar.nombre || '',
        email: usuarioEditar.email || '',
        password: '',
        rol: usuarioEditar.rol || 'empleado',
        activo: usuarioEditar.activo,
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'empleado',
      });
    }
  }, [usuarioEditar, abierto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (usuarioEditar) {
        await usuariosAPI.actualizar(usuarioEditar.id, formData);
        toast.success('Usuario actualizado correctamente');
      } else {
        await usuariosAPI.crear(formData);
        toast.success('Usuario creado correctamente');
      }
      onClose();
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card bg-slate-950/90 border-white/10 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">
            {usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="glass-input"
              placeholder="Nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="glass-input"
              placeholder="email@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="glass-input"
              placeholder={usuarioEditar ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
              required={!usuarioEditar}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider ml-1">Rol</label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              className="glass-input bg-[#111116] appearance-none"
            >
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6 mt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all font-bold">
              Cancelar
            </button>
            <button type="submit" disabled={cargando} className="flex-1 btn-premium">
              {cargando ? 'Guardando...' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Página de Usuarios
 */
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const response = await usuariosAPI.listar();
      setUsuarios(response.data.data.usuarios);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return;

    try {
      await usuariosAPI.eliminar(id);
      toast.success('Usuario eliminado correctamente');
      cargarUsuarios();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-slate-400 mt-1">Administra los usuarios y roles del sistema</p>
        </div>
        <button onClick={() => { setUsuarioEditar(null); setModalAbierto(true); }} className="btn-premium flex items-center gap-2 self-start shadow-[0_0_15px_rgba(var(--color-gpa-blue),0.2)]">
          <UserPlus className="w-5 h-5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-white/5 hover:border-white/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gpa-blue/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-gpa-blue/10 border border-gpa-blue/20 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <User className="w-7 h-7 text-gpa-blue" />
            </div>
            <div>
              <p className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">{usuarios.length}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Usuarios</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 border-white/5 hover:border-white/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Shield className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">{usuarios.filter(u => u.rol === 'admin').length}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Administradores</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 border-white/5 hover:border-white/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <UserCheck className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">{usuarios.filter(u => u.activo).length}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Usuarios Activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="glass-card border-white/5 p-4">
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gpa-blue transition-colors" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="glass-input pl-12"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="glass-card border-white/5 overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin" />
          </div>
        ) : usuariosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha Registro</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gpa-blue/10 border border-gpa-blue/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                          <span className="font-black text-xl text-gpa-blue relative z-10">
                            {usuario.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-bold text-white tracking-wide">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-slate-300 font-medium">{usuario.email}</td>
                    <td className="p-4 align-middle">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${usuario.rol === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-gpa-blue/10 text-gpa-cyan border-gpa-blue/20'}`}>
                        {usuario.rol === 'admin' ? 'Admin' : 'Empleado'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${usuario.activo ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-slate-400 font-medium">
                      {new Date(usuario.creado_en).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setUsuarioEditar(usuario); setModalAbierto(true); }}
                          className="p-2 bg-white/5 hover:bg-gpa-blue/20 border border-transparent hover:border-gpa-blue/50 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 text-gpa-cyan" />
                        </button>
                        <button
                          onClick={() => handleEliminar(usuario.id, usuario.nombre)}
                          className="p-2 bg-white/5 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 rounded-xl transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-xl font-bold text-white mb-2">No se encontraron usuarios</p>
            <p className="text-slate-400">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalUsuario
        abierto={modalAbierto}
        onClose={() => { setModalAbierto(false); setUsuarioEditar(null); }}
        onSave={cargarUsuarios}
        usuarioEditar={usuarioEditar}
      />
    </div>
  );
}
