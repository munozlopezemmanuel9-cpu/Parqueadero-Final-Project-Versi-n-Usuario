/**
 * Servicio de API para GPA Parqueadero v3.0 — Ecosistema Inteligente
 * Medellín, Colombia
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ARQUITECTURA DE DATOS:
 *   • Base de datos principal: Supabase (PostgreSQL en la nube)
 *     → Auth, Usuarios, Vehículos, Plazas, Movimientos, Parqueaderos,
 *       Reservas y Calificaciones se gestionan aquí.
 *   • Backend Node.js/Express (backend/): usado exclusivamente para
 *     integración con Stripe (pagos) y suscripciones de pago.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { supabase } from '../config/supabase';

/**
 * Función auxiliar para simular la estructura de respuesta de Axios
 */
const mockAxiosResponse = (data, key) => {
  return {
    data: {
      data: key ? { [key]: data } : data,
      success: true,
    }
  };
};

const formatMovimiento = (m) => ({
  ...m,
  movimiento_id: m.id,
  placa: m.vehiculos?.placa || m.placa,
  vehiculo_tipo: m.vehiculos?.tipo || m.vehiculo_tipo,
  plaza_nombre: m.plazas?.nombre || m.plaza_nombre,
  usuario_registro: m.usuario_id || 'Admin'
});

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
      .insert([{ email, nombre, password_hash: 'auth_managed', rol: 'cliente' }])
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
    if (!user) throw new Error('No autenticado');

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
      .insert([{ email, nombre, password_hash: 'auth_managed', rol: rol || 'cliente', activo: true }])
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    return mockAxiosResponse(newUser, 'usuario');
  },
  actualizar: async (id, datos) => {
    const updateData = { nombre: datos.nombre, rol: datos.rol, activo: datos.activo };
    const { data, error } = await supabase
      .from('usuarios').update(updateData).eq('id', id).select().single();
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
    return mockAxiosResponse(data.map(formatMovimiento), 'movimientos');
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
    return mockAxiosResponse(data.map(formatMovimiento), 'movimientos');
  },
  obtenerEstadisticas: async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const [
      { data: plazas },
      { data: movimientosHoy },
      { data: movimientosFinalizados }
    ] = await Promise.all([
      supabase.from('plazas').select('*'),
      supabase.from('movimientos').select('*').gte('fecha_entrada', hoy),
      supabase.from('movimientos').select('total_pagar').eq('estado', 'finalizado').gte('fecha_salida', hoy)
    ]);

    const plazasLibres = plazas?.filter(p => p.estado === 'libre').length || 0;
    const plazasOcupadas = plazas?.filter(p => p.estado === 'ocupada').length || 0;
    const plazasTotales = plazas?.length || 0;
    const recaudadoHoy = movimientosFinalizados?.reduce((acc, m) => acc + (m.total_pagar || 0), 0) || 0;
    const ocupacionPorTipo = {
      carro: plazas?.filter(p => p.tipo === 'carro' && p.estado === 'ocupada').length || 0,
      moto: plazas?.filter(p => p.tipo === 'moto' && p.estado === 'ocupada').length || 0,
      camioneta: plazas?.filter(p => p.tipo === 'camioneta' && p.estado === 'ocupada').length || 0,
    };
    const totalesPorTipo = {
      carro: plazas?.filter(p => p.tipo === 'carro').length || 0,
      moto: plazas?.filter(p => p.tipo === 'moto').length || 0,
      camioneta: plazas?.filter(p => p.tipo === 'camioneta').length || 0,
    };
    return mockAxiosResponse({
      general: {
        plazas_libres: plazasLibres,
        plazas_ocupadas: plazasOcupadas,
        plazas_totales: plazasTotales,
        movimientos_hoy: movimientosHoy?.length || 0,
        recaudado_hoy: recaudadoHoy,
        ocupacion_por_tipo: ocupacionPorTipo,
        totales_por_tipo: totalesPorTipo
      }
    });
  },
  getMyVehicles: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');
    const { data, error } = await supabase.from('vehiculos').select('*').eq('propietario_id', user.id);
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'vehiculos');
  },
  getMyHistory: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');
    const { data, error } = await supabase.from('movimientos').select('*, vehiculos(*), plazas(*)').eq('vehiculos.propietario_id', user.id).order('fecha_entrada', { ascending: false });
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data.map(formatMovimiento), 'movimientos');
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

// ============================================
// SERVICIO DE PARQUEADEROS — NUEVO
// ============================================

// Datos de Medellín usados como fallback si Supabase no tiene la tabla aún
const PARQUEADEROS_MEDELLIN = [
  {
    id: 1, nombre: 'Parqueadero El Poblado Centro', direccion: 'Cra. 43A #10-50, El Poblado',
    barrio: 'El Poblado', ciudad: 'Medellín', lat: 6.20820, lng: -75.57030,
    capacidad_total: 120, espacios_disponibles: 45, tarifa_hora: 4000, tarifa_dia: 35000,
    horario_apertura: '06:00', horario_cierre: '23:59', abierto_24h: false,
    rating_promedio: 4.5, total_calificaciones: 128, tiene_camaras: true, tiene_techado: true, activo: true,
  },
  {
    id: 2, nombre: 'Parqueadero Laureles Express', direccion: 'Cll. 33 #76-20, Laureles',
    barrio: 'Laureles', ciudad: 'Medellín', lat: 6.24800, lng: -75.59200,
    capacidad_total: 80, espacios_disponibles: 12, tarifa_hora: 3500, tarifa_dia: 28000,
    horario_apertura: '05:00', horario_cierre: '23:00', abierto_24h: false,
    rating_promedio: 4.2, total_calificaciones: 89, tiene_camaras: true, tiene_techado: false, activo: true,
  },
  {
    id: 3, nombre: 'Parqueadero 24/7 Estadio', direccion: 'Cra. 74 #44-50, Estadio',
    barrio: 'Estadio', ciudad: 'Medellín', lat: 6.25600, lng: -75.59800,
    capacidad_total: 200, espacios_disponibles: 87, tarifa_hora: 3000, tarifa_dia: 25000,
    horario_apertura: '00:00', horario_cierre: '23:59', abierto_24h: true,
    rating_promedio: 3.9, total_calificaciones: 214, tiene_camaras: true, tiene_techado: true, activo: true,
  },
  {
    id: 4, nombre: 'Parqueadero Premium Patio Bonito', direccion: 'Cll. 18 #43-20, Patio Bonito',
    barrio: 'Patio Bonito', ciudad: 'Medellín', lat: 6.23100, lng: -75.57800,
    capacidad_total: 60, espacios_disponibles: 3, tarifa_hora: 5000, tarifa_dia: 45000,
    horario_apertura: '07:00', horario_cierre: '21:00', abierto_24h: false,
    rating_promedio: 4.8, total_calificaciones: 56, tiene_camaras: true, tiene_techado: true, activo: true,
  },
  {
    id: 5, nombre: 'Parqueadero Envigado Sur', direccion: 'Cra. 48 #37 Sur-50, Envigado',
    barrio: 'Envigado', ciudad: 'Medellín', lat: 6.17400, lng: -75.59100,
    capacidad_total: 150, espacios_disponibles: 92, tarifa_hora: 3500, tarifa_dia: 30000,
    horario_apertura: '05:30', horario_cierre: '22:30', abierto_24h: false,
    rating_promedio: 4.1, total_calificaciones: 103, tiene_camaras: true, tiene_techado: false, activo: true,
  },
  {
    id: 6, nombre: 'Parqueadero Centro Histórico', direccion: 'Cll. 44 #52-30, La Candelaria',
    barrio: 'La Candelaria', ciudad: 'Medellín', lat: 6.25150, lng: -75.56900,
    capacidad_total: 90, espacios_disponibles: 0, tarifa_hora: 2500, tarifa_dia: 20000,
    horario_apertura: '06:00', horario_cierre: '20:00', abierto_24h: false,
    rating_promedio: 3.7, total_calificaciones: 77, tiene_camaras: false, tiene_techado: false, activo: true,
  },
];

const calcularDistancia = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c * 1000).toFixed(0); // metros
};

export const parqueaderosAPI = {
  listar: async () => {
    try {
      const { data, error } = await supabase.from('parqueaderos').select('*').eq('activo', true).order('nombre');
      if (error || !data?.length) return mockAxiosResponse(PARQUEADEROS_MEDELLIN);
      return mockAxiosResponse(data);
    } catch {
      return mockAxiosResponse(PARQUEADEROS_MEDELLIN);
    }
  },

  obtenerDetalle: async (id) => {
    try {
      const { data, error } = await supabase.from('parqueaderos').select('*').eq('id', id).single();
      if (error) {
        const local = PARQUEADEROS_MEDELLIN.find(p => p.id === parseInt(id));
        return mockAxiosResponse({ parqueadero: local || null });
      }
      return mockAxiosResponse({ parqueadero: data });
    } catch {
      const local = PARQUEADEROS_MEDELLIN.find(p => p.id === parseInt(id));
      return mockAxiosResponse({ parqueadero: local || null });
    }
  },

  buscarCercanos: async (userLat, userLng) => {
    const parqueaderos = PARQUEADEROS_MEDELLIN.map(p => ({
      ...p,
      distancia_metros: parseInt(calcularDistancia(userLat, userLng, p.lat, p.lng)),
    })).sort((a, b) => a.distancia_metros - b.distancia_metros);
    return mockAxiosResponse(parqueaderos);
  },

  obtenerEstado: (parqueadero) => {
    const pct = parqueadero.espacios_disponibles / parqueadero.capacidad_total;
    if (parqueadero.espacios_disponibles === 0) return 'completo';
    if (pct < 0.2) return 'pocos';
    return 'disponible';
  },
};

// ============================================
// SERVICIO DE RESERVAS — Supabase Real
// ============================================

/**
 * Genera un código de reserva único de 8 caracteres alfanuméricos.
 */
const generarCodigo = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * Enriquece una reserva con los datos del parqueadero anidados
 * bajo la clave `parqueaderos` que espera MisReservas.jsx.
 */
const formatReserva = (r) => ({
  ...r,
  parqueaderos: r.parqueaderos || {
    nombre: r.parqueadero_nombre || 'Sede GPA',
    direccion: r.parqueadero_direccion || 'Medellín, Colombia',
    lat: r.parqueadero_lat || null,
    lng: r.parqueadero_lng || null,
  },
});

export const reservasAPI = {
  /**
   * Crea una nueva reserva en Supabase.
   * Genera el código QR único y descuenta un espacio en el parqueadero.
   */
  crear: async (datos) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Debes iniciar sesión para reservar');

    // Recuperar id interno del usuario desde la tabla 'usuarios'
    const { data: usuarioRow } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', user.email)
      .single();

    const codigo_reserva = generarCodigo();

    const { data, error } = await supabase
      .from('reservas')
      .insert([{
        usuario_id: usuarioRow?.id || null,
        parqueadero_id: datos.parqueadero_id,
        vehiculo_placa: datos.vehiculo_placa,
        vehiculo_tipo: datos.vehiculo_tipo,
        fecha_inicio: datos.fecha_inicio,
        fecha_fin: datos.fecha_fin,
        horas_estimadas: datos.horas_estimadas,
        total: datos.total,
        metodo_pago: datos.metodo_pago || 'simulado',
        stripe_payment_intent_id: datos.stripe_payment_intent_id || null,
        pago_confirmado: !!datos.stripe_payment_intent_id,
        estado: 'confirmada',
        codigo_reserva,
        notas: datos.notas || null,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Descontar espacio disponible en el parqueadero
    await supabase
      .from('parqueaderos')
      .update({ espacios_disponibles: supabase.rpc ? undefined : undefined }) // handled via RPC below
      .eq('id', datos.parqueadero_id);

    // Decremento seguro usando RPC de Supabase
    await supabase.rpc('decrementar_espacio', { p_id: datos.parqueadero_id }).catch(() => {
      // Si el RPC no existe, hacemos una actualización directa como fallback
      supabase
        .from('parqueaderos')
        .select('espacios_disponibles')
        .eq('id', datos.parqueadero_id)
        .single()
        .then(({ data: pq }) => {
          if (pq && pq.espacios_disponibles > 0) {
            supabase.from('parqueaderos')
              .update({ espacios_disponibles: pq.espacios_disponibles - 1 })
              .eq('id', datos.parqueadero_id);
          }
        });
    });

    return mockAxiosResponse(data, 'reserva');
  },

  /**
   * Obtiene todas las reservas del usuario autenticado
   * con los datos del parqueadero anidados.
   */
  obtenerMisReservas: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return mockAxiosResponse([], 'reservas');

    const { data: usuarioRow } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!usuarioRow) return mockAxiosResponse([], 'reservas');

    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        parqueaderos (
          id,
          nombre,
          direccion,
          lat,
          lng
        )
      `)
      .eq('usuario_id', usuarioRow.id)
      .order('creado_en', { ascending: false });

    if (error) throw new Error(error.message);

    return mockAxiosResponse((data || []).map(formatReserva), 'reservas');
  },

  /**
   * Cancela una reserva y devuelve el espacio al parqueadero.
   */
  cancelar: async (id) => {
    const { data, error } = await supabase
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', id)
      .select('parqueadero_id')
      .single();

    if (error) throw new Error(error.message);

    // Incrementar espacio disponible al cancelar
    if (data?.parqueadero_id) {
      const { data: pq } = await supabase
        .from('parqueaderos')
        .select('espacios_disponibles, capacidad_total')
        .eq('id', data.parqueadero_id)
        .single();

      if (pq) {
        const nuevosEspacios = Math.min(
          (pq.espacios_disponibles || 0) + 1,
          pq.capacidad_total || 9999
        );
        await supabase
          .from('parqueaderos')
          .update({ espacios_disponibles: nuevosEspacios })
          .eq('id', data.parqueadero_id);
      }
    }

    return mockAxiosResponse({ reserva: { id, estado: 'cancelada' } });
  },

  /**
   * Confirma la llegada del usuario al parqueadero
   * (cambia estado de 'confirmada' → 'activa').
   */
  confirmarLlegada: async (id) => {
    const { error } = await supabase
      .from('reservas')
      .update({ estado: 'activa' })
      .eq('id', id);

    if (error) throw new Error(error.message);

    return mockAxiosResponse({ reserva: { id, estado: 'activa' } });
  },

  /**
   * Marca una reserva como completada cuando el tiempo termina.
   */
  completar: async (id) => {
    const { error } = await supabase
      .from('reservas')
      .update({ estado: 'completada' })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return mockAxiosResponse({ reserva: { id, estado: 'completada' } });
  },
};

// ============================================
// SERVICIO DE CALIFICACIONES — NUEVO
// ============================================
export const calificacionesAPI = {
  obtenerPorParqueadero: async (parqueaderoId) => {
    try {
      const { data, error } = await supabase
        .from('calificaciones')
        .select('*, usuarios(nombre)')
        .eq('parqueadero_id', parqueaderoId)
        .order('creado_en', { ascending: false })
        .limit(20);

      if (error || !data) return mockAxiosResponse([], 'calificaciones');
      return mockAxiosResponse(data, 'calificaciones');
    } catch {
      return mockAxiosResponse([], 'calificaciones');
    }
  },

  crear: async (datos) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: usuarioData } = await supabase.from('usuarios').select('id').eq('email', user?.email).single();
      const { data, error } = await supabase
        .from('calificaciones')
        .insert([{ ...datos, usuario_id: usuarioData?.id }])
        .select().single();
      if (error) throw new Error(error.message);

      // Actualizar rating promedio
      const { data: ratings } = await supabase
        .from('calificaciones')
        .select('puntuacion_general')
        .eq('parqueadero_id', datos.parqueadero_id);

      if (ratings?.length) {
        const promedio = ratings.reduce((acc, r) => acc + r.puntuacion_general, 0) / ratings.length;
        await supabase.from('parqueaderos').update({
          rating_promedio: Math.round(promedio * 10) / 10,
          total_calificaciones: ratings.length
        }).eq('id', datos.parqueadero_id);
      }

      return mockAxiosResponse({ calificacion: data });
    } catch (e) {
      return mockAxiosResponse({ calificacion: { ...datos, id: Date.now() } });
    }
  },
};

// ============================================
// SERVICIO DE PAGOS Y SUSCRIPCIONES (Node.js API)
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`
  };
};

export const pagosAPI = {
  crearPaymentIntent: async (datos) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/pagos/create-payment-intent`, {
        method: 'POST',
        headers,
        body: JSON.stringify(datos)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (error) {
      console.error('Error in crearPaymentIntent:', error);
      throw error;
    }
  }
};

export const suscripcionesAPI = {
  obtenerMisSuscripciones: async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/suscripciones/mis-suscripciones`, { headers });
      const data = await response.json();
      return mockAxiosResponse(data.data.suscripciones || [], 'suscripciones');
    } catch (error) {
      return mockAxiosResponse([], 'suscripciones');
    }
  },
  adquirir: async (datos) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/suscripciones/adquirir`, {
        method: 'POST',
        headers,
        body: JSON.stringify(datos)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return mockAxiosResponse(data.data, 'suscripcion');
    } catch (error) {
      throw error;
    }
  }
};

export default { authAPI, usuariosAPI, vehiculosAPI, movimientosAPI, plazasAPI, parqueaderosAPI, reservasAPI, calificacionesAPI, pagosAPI, suscripcionesAPI };
