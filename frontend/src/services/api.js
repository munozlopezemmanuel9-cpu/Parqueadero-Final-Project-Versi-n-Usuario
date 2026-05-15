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

/**
 * Servicio de Autenticación
 */
export const authAPI = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    
    // Obtener perfil adicional de la tabla usuarios
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
    
    // Crear el registro en la tabla pública
    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert([{ email, nombre, password_hash: 'auth_managed', rol: 'admin' }])
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

/**
 * Servicio de Usuarios
 */
export const usuariosAPI = {
  listar: async () => {
    const { data, error } = await supabase.from('usuarios').select('*').order('id');
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'usuarios');
  },
  crear: async (datos) => {
    const { email, password, nombre, rol } = datos;
    // Creamos el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw new Error(authError.message);
    
    // Insertamos el perfil en la tabla usuarios
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
    
    // Nota: La actualización de email/password requeriría lógica adicional o permisos de admin
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

/**
 * Servicio de Vehículos
 */
export const vehiculosAPI = {
  registrar: async (datos) => {
    // 1. Verificar si ya existe el vehículo para evitar duplicados
    const { data: existing } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('placa', datos.placa)
      .maybeSingle();

    if (existing) {
      // Si existe pero los datos cambiaron (marca/modelo), podríamos actualizarlo
      const { data: updated, error: updateError } = await supabase
        .from('vehiculos')
        .update(datos)
        .eq('id', existing.id)
        .select()
        .single();
      if (updateError) throw new Error(updateError.message);
      return mockAxiosResponse(updated, 'vehiculo');
    }

    // 2. Si no existe, insertar nuevo
    const { data, error } = await supabase.from('vehiculos').insert([datos]).select().single();
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'vehiculo');
  },
  buscarPorPlaca: async (placa) => {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('placa', placa)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return mockAxiosResponse({ vehiculo: data });
  },
  obtenerHistorial: async () => {
    const { data, error } = await supabase.from('vehiculos').select('*').order('creado_en', { ascending: false });
    if (error) throw new Error(error.message);
    return mockAxiosResponse(data, 'vehiculos');
  },
};

/**
 * Servicio de Movimientos
 */
export const movimientosAPI = {
  registrarEntrada: async (datos) => {
    // Asegurar que tenemos fecha de entrada y estado inicial
    const insertData = {
      ...datos,
      tipo_movimiento: 'entrada',
      fecha_entrada: datos.fecha_entrada || new Date().toISOString(),
      estado: 'en_parqueadero'
    };

    const { data, error } = await supabase.from('movimientos').insert([insertData]).select().single();
    if (error) throw new Error(error.message);
    
    // Marcar plaza como ocupada
    await supabase.from('plazas').update({ estado: 'ocupada' }).eq('id', datos.plaza_id);
    
    return mockAxiosResponse(data, 'movimiento');
  },
  registrarSalida: async (movimientoId, datos) => {
    const fechaSalida = new Date().toISOString();
    
    // 1. Obtener el movimiento para saber qué plaza liberar
    const { data: movimiento, error: movError } = await supabase
      .from('movimientos')
      .select('plaza_id')
      .eq('id', movimientoId)
      .single();
      
    if (movError) throw new Error(movError.message);

    // 2. Calcular costo final (puedes llamar a calcularCosto o hacerlo aquí)
    const costoData = await movimientosAPI.calcularCosto(movimientoId);
    
    // 3. Actualizar el movimiento
    const { data, error } = await supabase
      .from('movimientos')
      .update({
        tipo_movimiento: 'salida',
        fecha_salida: fechaSalida,
        estado: 'finalizado',
        metodo_pago: datos.metodo_pago,
        notas: datos.notas,
        total_pagar: costoData.data.data.costo_estimado
      })
      .eq('id', movimientoId)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    // 4. Liberar la plaza
    await supabase.from('plazas').update({ estado: 'libre' }).eq('id', movimiento.plaza_id);
    
    return mockAxiosResponse(data, 'movimiento');
  },
  calcularCosto: async (movimientoId) => {
    // Obtener movimiento y plaza (para la tarifa)
    const { data, error } = await supabase
      .from('movimientos')
      .select('*, plazas(tarifa_por_hora)')
      .eq('id', movimientoId)
      .single();
      
    if (error) throw new Error(error.message);
    
    const fechaEntrada = new Date(data.fecha_entrada);
    const fechaSalida = new Date();
    const diffMs = fechaSalida - fechaEntrada;
    const diffHoras = Math.ceil(diffMs / (1000 * 60 * 60)); // Redondear hacia arriba
    
    const tarifa = data.plazas?.tarifa_por_hora || 5000;
    const costoEstimado = diffHoras * tarifa;
    
    return mockAxiosResponse({
      costo_estimado: costoEstimado,
      horas_transcurridas: (diffMs / (1000 * 60 * 60)).toFixed(1),
      horas_cobrar: diffHoras
    });
  },
  obtenerEnParqueadero: async () => {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*, vehiculos(*), plazas(*)')
      .eq('estado', 'en_parqueadero')
      .order('fecha_entrada', { ascending: false });
    if (error) throw new Error(error.message);
    
    const formattedData = data.map(m => ({
      ...m,
      movimiento_id: m.id, // O m.movimiento_id según la DB, pero Supabase usa id por defecto
      placa: m.vehiculos?.placa || m.placa,
      vehiculo_tipo: m.vehiculos?.tipo || m.vehiculo_tipo,
      plaza_nombre: m.plazas?.nombre || m.plaza_nombre,
      usuario_registro: m.usuario_id || 'Admin'
    }));
    
    return mockAxiosResponse(formattedData, 'movimientos');
  },
  obtenerHistorico: async (filtros) => {
    let query = supabase.from('movimientos').select('*, vehiculos(*), plazas(*)');

    if (filtros?.placa) {
      // Filtrar por placa en la tabla relacionada vehiculos
      query = query.filter('vehiculos.placa', 'ilike', `%${filtros.placa}%`);
    }

    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado);
    }

    if (filtros?.fecha_desde) {
      query = query.gte('fecha_entrada', filtros.fecha_desde);
    }

    if (filtros?.fecha_hasta) {
      // Añadir un día para incluir todo el día 'hasta'
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
    // Para simplificar, obtenemos conteos básicos
    // En una app real, podrías usar una función de base de datos o RPC
    
    const { count: plazasTotales } = await supabase.from('plazas').select('*', { count: 'exact', head: true });
    const { count: plazasLibres } = await supabase.from('plazas').select('*', { count: 'exact', head: true }).eq('estado', 'libre');
    const { count: plazasOcupadas } = await supabase.from('plazas').select('*', { count: 'exact', head: true }).eq('estado', 'ocupada');
    
    // Obtener movimientos de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const { count: movimientosHoy } = await supabase
      .from('movimientos')
      .select('*', { count: 'exact', head: true })
      .gte('fecha_entrada', hoy.toISOString());

    // Obtener recaudado hoy (esto es más complejo, simplificamos a 0 por ahora o sumamos si hay datos)
    const { data: pagosHoy } = await supabase
      .from('movimientos')
      .select('total_pagar')
      .eq('estado', 'finalizado')
      .gte('fecha_salida', hoy.toISOString());
      
    const recaudadoHoy = pagosHoy?.reduce((acc, curr) => acc + (Number(curr.total_pagar) || 0), 0) || 0;

    // Conteo por tipo de vehículo
    const { data: vehiculosActuales } = await supabase
      .from('movimientos')
      .select('vehiculo_tipo')
      .eq('estado', 'en_parqueadero');
      
    const ocupacionPorTipo = {
      carro: vehiculosActuales?.filter(v => v.vehiculo_tipo === 'carro').length || 0,
      moto: vehiculosActuales?.filter(v => v.vehiculo_tipo === 'moto').length || 0,
      camioneta: vehiculosActuales?.filter(v => v.vehiculo_tipo === 'camioneta').length || 0,
    };

    return mockAxiosResponse({
      general: {
        plazas_totales: plazasTotales || 0,
        plazas_libres: plazasLibres || 0,
        plazas_ocupadas: plazasOcupadas || 0,
        movimientos_hoy: movimientosHoy || 0,
        recaudado_hoy: recaudadoHoy,
        ocupacion_por_tipo: ocupacionPorTipo
      }
    });
  },
};

/**
 * Servicio de Plazas
 */
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
