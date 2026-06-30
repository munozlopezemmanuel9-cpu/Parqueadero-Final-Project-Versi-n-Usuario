/**
 * MapaParqueaderos.jsx — v2
 * Página premium con mapa interactivo (dinámico) y buscador de parqueaderos
 * Usa Leaflet cargado dinámicamente para evitar problemas de SSR/init en Vite
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Navigation, Star, Shield, Umbrella, Clock, X, ChevronRight, Map } from 'lucide-react';
import { parqueaderosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CENTRO_MEDELLIN = [6.2442, -75.5780];

export default function MapaParqueaderos() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [parqueaderos, setParqueaderos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('todos');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState(6000);
  const [filtroAmenidades, setFiltroAmenidades] = useState({ camaras: false, techado: false, abierto24h: false });
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    cargarParqueaderos();
  }, []);

  const cargarParqueaderos = async () => {
    try {
      const res = await parqueaderosAPI.listar();
      const lista = res?.data?.data;
      if (Array.isArray(lista)) {
        setParqueaderos(lista);
      } else {
        setParqueaderos([]);
      }
    } catch (e) {
      console.error('Error al cargar parqueaderos:', e);
      setParqueaderos([]);
    } finally {
      setCargando(false);
    }
  };

  // Inicializar el mapa DESPUÉS de que el DOM esté listo
  useEffect(() => {
    if (cargando || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        // leaflet.css ya está cargado en index.html via CDN

        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
          center: CENTRO_MEDELLIN,
          zoom: 13,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap, © CARTO',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.error('Error al inicializar el mapa:', err);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cargando]);

  // Actualizar marcadores cuando cambien los parqueaderos o el mapa esté listo
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const actualizarMarcadores = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Limpiar marcadores anteriores
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      parqueaderosFiltrados.forEach((p) => {
        const color = p.espacios_disponibles === 0 ? '#ef4444'
          : p.espacios_disponibles < 10 ? '#f59e0b' : '#3b82f6';

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:${color};opacity:0.2;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="width:32px;height:32px;border-radius:50%;background:${color};border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${color}99;cursor:pointer;">
                <span style="color:white;font-size:9px;font-weight:900;line-height:1;">${p.espacios_disponibles}</span>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.on('click', () => {
          setSeleccionado(p);
          map.setView([p.lat, p.lng], 16, { animate: true });
        });
        markersRef.current.push(marker);
      });
    };

    actualizarMarcadores();
  }, [mapReady, parqueaderos, busqueda, filtroDisponibilidad, filtroPrecioMax, filtroAmenidades]);

  const irAReservar = (parqueadero) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }
    navigate(`/reservar/${parqueadero.id}`);
  };

  const centrarEnMi = () => {
    if (!mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstanceRef.current.setView([pos.coords.latitude, pos.coords.longitude], 15, { animate: true });
        toast.success('Mapa centrado en tu ubicación');
      },
      () => toast.error('No se pudo obtener tu ubicación')
    );
  };

  const parqueaderosFiltrados = parqueaderos.filter(p => {
    const q = busqueda.toLowerCase();
    const coincideBusqueda = !busqueda ||
      p.nombre.toLowerCase().includes(q) ||
      p.direccion.toLowerCase().includes(q) ||
      p.barrio?.toLowerCase().includes(q);
    const coincideDisponibilidad = filtroDisponibilidad === 'todos' || p.espacios_disponibles > 0;
    const coincidePrecio = p.tarifa_hora <= filtroPrecioMax;
    const coincideCamaras = !filtroAmenidades.camaras || p.tiene_camaras;
    const coincideTechado = !filtroAmenidades.techado || p.tiene_techado;
    const coincide24h = !filtroAmenidades.abierto24h || p.abierto_24h;
    return coincideBusqueda && coincideDisponibilidad && coincidePrecio && coincideCamaras && coincideTechado && coincide24h;
  });

  const getEstadoColor = (p) => {
    if (p.espacios_disponibles === 0) return { text: 'Lleno', cls: 'text-red-400 bg-red-500/10 border-red-500/20' };
    if (p.espacios_disponibles < 10) return { text: `${p.espacios_disponibles} cupos`, cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { text: `${p.espacios_disponibles} cupos`, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 64px)' }}>

      {/* SIDEBAR */}
      <div className="w-full lg:w-[400px] shrink-0 flex flex-col border-r border-white/8 bg-[#07070a] overflow-hidden" style={{ height: '100%' }}>

        {/* Header del sidebar */}
        <div className="p-5 border-b border-white/8 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-white uppercase italic tracking-tight">
                ENCONTRAR <span style={{ color: '#3b82f6' }}>PARQUEADERO</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{parqueaderosFiltrados.length} sedes en Medellín</p>
            </div>
            <button
              onClick={centrarEnMi}
              title="Mi ubicación"
              className="p-2 rounded-xl border transition-all cursor-pointer"
              style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.25)', color: '#3b82f6' }}
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Buscador */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Nombre, dirección o barrio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <button
              onClick={() => setFiltrosOpen(!filtrosOpen)}
              className="p-2.5 rounded-xl border transition-all cursor-pointer"
              style={{
                background: filtrosOpen ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                borderColor: filtrosOpen ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.1)',
                color: filtrosOpen ? '#3b82f6' : '#94a3b8'
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros expandibles */}
          {filtrosOpen && (
            <div className="p-4 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Disponibilidad</span>
                <div className="flex gap-2">
                  {['todos', 'libres'].map(op => (
                    <button
                      key={op}
                      onClick={() => setFiltroDisponibilidad(op)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      style={{
                        background: filtroDisponibilidad === op ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                        color: filtroDisponibilidad === op ? 'white' : '#94a3b8'
                      }}
                    >
                      {op === 'todos' ? 'Todos' : 'Con cupo'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tarifa máx / hora</span>
                  <span className="text-[10px] font-bold" style={{ color: '#22d3ee' }}>${filtroPrecioMax.toLocaleString()}</span>
                </div>
                <input
                  type="range" min="2000" max="6000" step="500"
                  value={filtroPrecioMax}
                  onChange={(e) => setFiltroPrecioMax(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Servicios</span>
                <div className="flex gap-2">
                  {[
                    { key: 'camaras', label: 'Cámaras' },
                    { key: 'techado', label: 'Techado' },
                    { key: 'abierto24h', label: '24/7' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFiltroAmenidades(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer"
                      style={{
                        background: filtroAmenidades[key] ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                        borderColor: filtroAmenidades[key] ? 'rgba(59,130,246,0.4)' : 'transparent',
                        color: filtroAmenidades[key] ? '#3b82f6' : '#94a3b8'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de parqueaderos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          {/* Banner para usuarios no autenticados */}
          {!isAuthenticated && (
            <div className="rounded-2xl p-4 mb-2" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.10))', border: '1px solid rgba(59,130,246,0.25)' }}>
              <p className="text-xs font-black text-white mb-1">¡Reserva en 2 minutos! 🚀</p>
              <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Crea tu cuenta gratis y reserva tu cupo con código QR de acceso.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/registro')}
                  className="flex-1 py-2 rounded-xl text-xs font-black text-white transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
                >
                  Crear Cuenta
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          )}
          {cargando ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-t-blue-500 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#3b82f6' }} />
            </div>
          ) : parqueaderosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <Map className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">No hay sedes con esos filtros</p>
            </div>
          ) : (
            parqueaderosFiltrados.map((p) => {
              const estado = getEstadoColor(p);
              const isSelected = seleccionado?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSeleccionado(p);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([p.lat, p.lng], 16, { animate: true });
                    }
                  }}
                  className="rounded-2xl p-4 cursor-pointer transition-all"
                  style={{
                    background: isSelected ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {/* Cabecera */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white text-sm leading-tight truncate">{p.nombre}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />{p.direccion}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-black px-2 py-1 rounded-lg border ${estado.cls}`}>
                      {estado.text}
                    </span>
                  </div>

                  {/* Datos */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {p.rating_promedio?.toFixed(1) || '–'}
                      </span>
                      {p.tiene_camaras && <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" />Cámaras</span>}
                      {p.tiene_techado && <span className="flex items-center gap-1"><Umbrella className="w-3 h-3 text-purple-400" />Techado</span>}
                    </div>
                    <span className="text-sm font-black" style={{ color: '#22d3ee' }}>
                      ${(p.tarifa_hora || 0).toLocaleString()}<span className="text-[9px] text-slate-500 font-bold">/h</span>
                    </span>
                  </div>

                  {/* Botón reservar */}
                  {isSelected && (
                    <button
                      onClick={(e) => { e.stopPropagation(); irAReservar(p); }}
                      disabled={p.espacios_disponibles === 0}
                      className="mt-3 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        background: p.espacios_disponibles === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        color: 'white'
                      }}
                    >
                      {p.espacios_disponibles === 0 ? 'Sin Cupos' : <>Reservar Aquí <ChevronRight className="w-3.5 h-3.5" /></>}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MAPA */}
      <div className="flex-1 relative" style={{ height: '100%', minHeight: '400px' }}>
        {/* Overlay de carga del mapa */}
        {!mapReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: '#07070a' }}>
            <div className="text-center">
              <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#3b82f6' }} />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Cargando mapa...</p>
            </div>
          </div>
        )}

        {/* Contenedor del mapa */}
        <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#07070a' }} />

        {/* Overlay de selección en el mapa */}
        {seleccionado && mapReady && (
          <div className="absolute bottom-6 right-6 w-[320px] z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="rounded-3xl p-5 shadow-2xl" style={{ background: 'rgba(10,10,14,0.95)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-base leading-tight">{seleccionado.nombre}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />{seleccionado.direccion}
                  </p>
                </div>
                <button onClick={() => setSeleccionado(null)} className="ml-2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Cupos</p>
                  <p className={`text-base font-black ${seleccionado.espacios_disponibles === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {seleccionado.espacios_disponibles}
                  </p>
                </div>
                <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Tarifa/h</p>
                  <p className="text-base font-black text-blue-400">${(seleccionado.tarifa_hora || 0).toLocaleString()}</p>
                </div>
                <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Rating</p>
                  <p className="text-base font-black text-amber-400">{seleccionado.rating_promedio?.toFixed(1) || '–'}</p>
                </div>
              </div>

              <button
                onClick={() => irAReservar(seleccionado)}
                disabled={seleccionado.espacios_disponibles === 0}
                className="w-full py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40"
                style={{
                  background: seleccionado.espacios_disponibles === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: 'white'
                }}
              >
                {seleccionado.espacios_disponibles === 0 ? 'Sede Llena' : '🚗 Reservar Ahora'}
              </button>
            </div>
          </div>
        )}

        {/* Leyenda */}
        {mapReady && (
          <div className="absolute top-4 right-4 z-[1000] rounded-2xl p-3 space-y-1.5" style={{ background: 'rgba(7,7,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Disponibilidad</p>
            {[
              { color: '#3b82f6', label: 'Disponible' },
              { color: '#f59e0b', label: 'Pocos cupos' },
              { color: '#ef4444', label: 'Lleno' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-[10px] text-slate-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
