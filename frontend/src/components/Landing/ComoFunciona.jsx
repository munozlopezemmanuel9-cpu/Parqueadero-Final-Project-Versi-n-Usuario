/**
 * ComoFunciona.jsx
 * Sección "¿Cómo Funciona?" para la Landing — 3 pasos visuales animados
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, CalendarCheck, QrCode, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const pasos = [
  {
    numero: '01',
    titulo: 'Busca tu parqueadero',
    descripcion: 'Explora el mapa interactivo y encuentra sedes cercanas a ti con disponibilidad en tiempo real.',
    icono: Search,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    numero: '02',
    titulo: 'Reserva tu cupo',
    descripcion: 'Selecciona fecha, hora y vehículo. Paga en línea o en la sede. Todo en menos de 2 minutos.',
    icono: CalendarCheck,
    color: '#8b5cf6',
    gradient: 'from-purple-500/20 to-purple-600/5',
  },
  {
    numero: '03',
    titulo: 'Llega y escanea tu QR',
    descripcion: 'Presenta tu código QR al llegar. Sin filas, sin estrés. Tu cupo está garantizado.',
    icono: QrCode,
    color: '#22d3ee',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
  },
];

export default function ComoFunciona() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gpa-purple/10 border border-gpa-purple/20 text-gpa-purple text-xs font-bold tracking-widest uppercase backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple y Rápido
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[0.95]">
            ¿Cómo <span className="text-gradient">funciona</span>?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mt-5 leading-relaxed">
            En solo 3 pasos tienes tu parqueadero reservado. Sin llamadas, sin esperar, sin sorpresas.
          </p>
        </motion.div>

        {/* Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
          {/* Línea conectora (desktop) */}
          <div className="hidden md:block absolute top-[72px] left-[16%] right-[16%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.5, duration: 1.2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-cyan-500/40 origin-left"
            />
          </div>

          {pasos.map((paso, i) => {
            const Icono = paso.icono;
            return (
              <motion.div
                key={paso.numero}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative group"
              >
                <div className={`glass-card rounded-3xl p-8 border-white/5 hover:border-white/15 transition-all duration-500 bg-gradient-to-br ${paso.gradient} hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]`}>
                  {/* Número */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                      style={{ background: `${paso.color}15`, boxShadow: `0 0 20px ${paso.color}22` }}
                    >
                      <Icono className="w-7 h-7" style={{ color: paso.color }} />
                    </div>
                    <span className="text-5xl font-black text-white/[0.05] tracking-tighter">{paso.numero}</span>
                  </div>

                  {/* Contenido */}
                  <h3 className="text-xl font-black text-white tracking-tight mb-3">{paso.titulo}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{paso.descripcion}</p>

                  {/* Flecha (solo en las primeras 2) */}
                  {i < 2 && (
                    <div className="hidden md:flex absolute -right-5 top-[72px] w-10 h-10 rounded-full bg-[#0a0a0d] border border-white/10 items-center justify-center z-10">
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-14"
        >
          <Link
            to="/mapa"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gpa-blue to-gpa-purple text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gpa-blue/30"
          >
            <MapPin className="w-5 h-5" />
            Ver Parqueaderos Disponibles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
