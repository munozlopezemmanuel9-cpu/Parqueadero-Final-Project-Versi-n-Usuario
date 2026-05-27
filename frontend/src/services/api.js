/**
 * Servicio de API para GPA Parqueadero
 *
 * Este archivo gestiona todas las comunicaciones con Supabase
 * para el sistema de gestión de parqueadero.
 *
 * @author Equipo de Desarrollo
 * @version 2.0.0
 */

import { supabase } from '../config/supabase';

/**
 * Función auxiliar para simular la estructura de respuesta de Axios
 * y evitar romper los componentes de React que esperan `response.data.data`
 */
const mockAxiosResponse = (data, key) => {
  return {
    data: {
      data: key ? { [key]: data } : data,
      success: true,
    }
  };
};

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

export const authAPI = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) throw new Error(userError.message);

    return mockAxiosResponse({
      usuario: userData,
      token: data.session.access_token
    });
  },

  registro: async (datos) => {
    const { email, password, nombre } = datos;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert([{ email, nombre, password_hash: 'auth_managed', rol: 'empleado' }])
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    return mockAxiosResponse({
      usuario: newUser,
      token: data.session?.access_token || 'pending'
    });
  },

  obtenerPerfil: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) throw new Error(error.message);
    return mockAxiosResponse({ usuario: data });
  },

  actualizarPerfil: async (datos) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('usuarios')
      .update(datos)
      .eq('email', user.email)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mockAxiosResponse({ usuario: data });
  },
};

// ============================================
// SERVICIO DE USUARIOS
// ============================================

export const usuariosAPI = {
  listar: async () => {
    const { data, error } = await supabase.from('usuarios').select('*').order('id');
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'usuarios');
  },
  crear: async (datos) => {
    const { email, password, nombre, rol } = datos;
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw new Error(authError.message);

    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert([{ email, nombre, password_hash: 'auth_managed', rol: rol || 'empleado', activo: true }])
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    return mockAxiosResponse(newUser, 'usuario');
  },
  actualizar: async (id, datos) => {
    const updateData = {
      nombre: datos.nombre,
      rol: datos.rol,
      activo: datos.activo
    };
    const { data, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'usuario');
  },
  eliminar: async (id) => {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return mockAxiosResponse({ id });
  },
};

// ============================================
// SERVICIO DE VEHÍCULOS
// ============================================

export const vehiculosAPI = {
  registrar: async (datos) => {
    const { data: existing } = await supabase.from('vehiculos').select('*').eq('placa', datos.placa).maybeSingle();
    if (existing) {
      const { data, error: updateError } = await supabase.from('vehiculos').update(datos).eq('id', existing.id).select().single();
      if (updateError) throw new Error(updateError.message);
      return mockAxiosResponse(data, 'vehiculo');
    }
    const { data, error } = await supabase.from('vehiculos').insert([datos]).select().single();
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'vehiculo');
  },
  buscarPorPlaca: async (placa) => {
    const { data, error } = await supabase.from('vehiculos').select('*').eq('placa', placa).maybeSingle();
    if (error) throw new Error(error.message);
    return mockAxiosResponse({ vehiculo: data });
  },
  obtenerHistorial: async () => {
    const { data, error } = await supabase.from('vehiculos').select('*').order('creado_en', { ascending: false });
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'vehiculos');
  },
};

// ============================================
// SERVICIO DE MOVIMIENTOS
// ============================================

export const movimientosAPI = {
  registrarEntrada: async (datos) => {
    const insertData = {
      ...datos,
      tipo_movimiento: 'entrada',
      fecha_entrada: datos.fecha_entrada || new Date().toISOString(),
      estado: 'en_parqueadero'
    };
    const { data, error } = await supabase.from('movimientos').insert([insertData]).select().single();
    if (error) throw new Error(error.message);
    await supabase.from('plazas').update({ estado: 'ocupada' }).eq('id', datos.plaza_id);
    return mockAxiosResponse(data, 'movimiento');
  },
  registrarSalida: async (movimientoId, datos) => {
    const fechaSalida = new Date().toISOString();
    const { data: movimiento, error: movError } = await supabase.from('movimientos').select('plaza_id').eq('id', movimientoId).single();
    if (movError) throw new Error(movError.message);
    const costoData = await movimientosAPI.calcularCosto(movimientoId);
    const { data, error } = await supabase.from('movimientos').update({
      tipo_movimiento: 'salida',
      fecha_salida: fechaSalida,
      estado: 'finalizado',
      metodo_pago: datos.metodo_pago,
      notas: datos.notas,
      total_pagar: costoData.data.data.costo_estimado
    }).eq('id', movimientoId).select().single();
    if (error) throw new Error(error.message);
    await supabase.from('plazas').update({ estado: 'libre' }).eq('id', movimiento.plaza_id);
    return mockAxiosResponse(data, 'movimiento');
  },
  calcularCosto: async (movimientoId) => {
    const { data, error } = await supabase.from('movimientos').select('*, plazas(tarifa_por_hora)').eq('id', movimientoId).single();
    if (error) throw new Error(error.message);
    const fechaEntrada = new Date(data.fecha_entrada);
    const fechaSalida = new Date();
    const diffMs = fechaSalida - fechaEntrada;
    const diffHoras = Math.ceil(diffMs / (1000 * 60 * 60));
    const tarifa = data.plazas?.tarifa_por_hora || 5000;
    const costoEstimado = diffHoras * tarifa;
    return mockAxiosResponse({
      costo_estimado: costoEstimado,
      horas_transcurridas: (diffMs / (1000 * 60 * 60)).toFixed(1),
      horas_cobrar: diffHoras
    });
  },
  obtenerEnParqueadero: async () => {
    const { data, error } = await supabase.from('movimientos').select('*, vehiculos(*), plazas(*)').eq('estado', 'en_parqueadero').order('fecha_entrada', { ascending: false });
    if (error) throw new Error(error.message);
    const formattedData = data.map(m => ({
      ...m,
      movimiento_id: m.id,
      placa: m.vehiculos?.placa || m.placa,
      vehiculo_tipo: m.vehiculos?.tipo || m.vehiculo_tipo,
      plaza_nombre: m.plazas?.nombre || m.plaza_nombre,
      usuario_registro: m.usuario_id || 'Admin'
    }));
    return mockAxiosResponse(formattedData, 'movimientos');
  },
  obtenerHistorico: async (filtros) => {
    let query = supabase.from('movimientos').select('*, vehiculos(*), plazas(*)');
    if (filtros?.placa) query = query.filter('vehiculos.placa', 'ilike', `%${filtros.placa}%`);
    if (filtros?.estado) query = query.eq('estado', filtros.estado);
    if (filtros?.fecha_desde) query = query.gte('fecha_entrada', filtros.fecha_desde);
    if (filtros?.fecha_hasta) {
      const hasta = new Date(filtros.fecha_hasta);
      hasta.setDate(hasta.getDate() + 1);
      query = query.lt('fecha_entrada', hasta.toISOString().split('T')[0]);
    }
    const { data, error } = await query.order('fecha_entrada', { ascending: false });
    if (error) throw new Error(error.message);
    const formattedData = data.map(m => ({
      ...m,
      movimiento_id: m.id,
      placa: m.vehiculos?.placa || m.placa,
      vehiculo_tipo: m.vehiculos?.tipo || m.vehiculo_tipo,
      plaza_nombre: m.plazas?.nombre || m.plaza_nombre,
      usuario_registro: m.usuario_id || 'Admin'
    }));
    return mockAxiosResponse(formattedData, 'movimientos');
  },
  obtenerEstadisticas: async () => {
    // Obtener plazas
    const { data: plazas } = await supabase.from('plazas').select('*');
    const plazasLibres = plazas?.filter(p => p.estado === 'libre').length || 0;
    const plazasOcupadas = plazas?.filter(p => p.estado === 'ocupada').length || 0;
    const plazasTotales = plazas?.length || 0;

    // Obtener movimientos de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const { data: movimientosHoy } = await supabase
      .from('movimientos')
      .select('*')
      .gte('fecha_entrada', hoy);

    const { data: movimientosFinalizados } = await supabase
      .from('movimientos')
      .select('total_pagar')
      .eq('estado', 'finalizado')
      .gte('fecha_salida', hoy);

    const recaudadoHoy = movimientosFinalizados?.reduce((acc, m) => acc + (m.total_pagar || 0), 0) || 0;

    // Ocupación por tipo
    const ocupacionPorTipo = {
      carro: plazas?.filter(p => p.tipo === 'carro' && p.estado === 'ocupada').length || 0,
      moto: plazas?.filter(p => p.tipo === 'moto' && p.estado === 'ocupada').length || 0,
      camioneta: plazas?.filter(p => p.tipo === 'camioneta' && p.estado === 'ocupada').length || 0,
    };

    return mockAxiosResponse({
      general: {
        plazas_libres: plazasLibres,
        plazas_ocupadas: plazasOcupadas,
        plazas_totales: plazasTotales,
        movimientos_hoy: movimientosHoy?.length || 0,
        recaudado_hoy: recaudadoHoy,
        ocupacion_por_tipo: ocupacionPorTipo
      }
    });
  },
  getMyVehicles: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");
    const { data, error } = await supabase.from('vehiculos').select('*').eq('propietario_id', user.id);
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'vehiculos');
  },
  getMyHistory: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");
    const { data, error } = await supabase.from('movimientos').select('*, vehiculos(*), plazas(*)').eq('vehiculos.propietario_id', user.id).order('fecha_entrada', { ascending: false });
    if (error) throw new Error(error.message);
    const formattedData = data.map(m => ({
      ...m,
      movimiento_id: m.id,
      placa: m.vehiculos?.placa || m.placa,
      vehiculo_tipo: m.vehiculos?.tipo || m.vehiculo_tipo,
      plaza_nombre: m.plazas?.nombre || m.plaza_nombre,
      usuario_registro: m.usuario_id || 'Admin'
    }));
    return mockAxiosResponse(formattedData, 'movimientos');
  },
};

// ============================================
// SERVICIO DE PLAZAS
// ============================================

export const plazasAPI = {
  listar: async () => {
    const { data, error } = await supabase.from('plazas').select('*').order('id');
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'plazas');
  },
  listarDisponibles: async (tipo) => {
    let query = supabase.from('plazas').select('*').eq('estado', 'libre');
    if (tipo) query = query.eq('tipo', tipo);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'plazas');
  },
  crear: async (datos) => {
    const { data, error } = await supabase.from('plazas').insert([datos]).select().single();
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'plaza');
  },
  actualizar: async (id, datos) => {
    const { data, error } = await supabase.from('plazas').update(datos).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'plaza');
  },
  eliminar: async (id) => {
    const { error } = await supabase.from('plazas').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return mockAxiosResponse({ id });
  },
};

export default { authAPI, usuariosAPI, vehiculosAPI, movimientosAPI, plazasAPI };
