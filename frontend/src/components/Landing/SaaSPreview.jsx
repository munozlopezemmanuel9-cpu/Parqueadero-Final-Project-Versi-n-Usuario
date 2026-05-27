import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  BarChart3, LayoutGrid, UserCircle, Settings, Car,
  ArrowRight, CheckCircle2, Clock, DollarSign, Activity,
  PlusCircle, LogOut, MapPin, Zap,
} from 'lucide-react';

/* ── How it works steps ── */
const pasos = [
  {
    numero: '01',
    titulo: 'Registra la Entrada',
    descripcion: 'El operador ingresa la placa del vehículo. El sistema busca automáticamente si ya existe y asigna la plaza disponible más adecuada.',
    icon: PlusCircle,
    color: 'text-gpa-blue',
    bg: 'bg-gpa-blue/10',
    border: 'border-gpa-blue/20',
  },
  {
    numero: '02',
    titulo: 'Monitoreo en Tiempo Real',
    descripcion: 'El dashboard muestra todos los vehículos activos, tiempo de permanencia, plazas disponibles y métricas del día al instante.',
    icon: Activity,
    color: 'text-gpa-purple',
    bg: 'bg-gpa-purple/10',
    border: 'border-gpa-purple/20',
  },
  {
    numero: '03',
    titulo: 'Calcula el Costo',
    descripcion: 'Al registrar la salida, el sistema calcula automáticamente el total basado en horas de permanencia y tarifa de la plaza.',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    numero: '04',
    titulo: 'Procesa el Pago',
    descripcion: 'Selecciona el método de pago (efectivo, tarjeta o transferencia), confirma y el sistema libera la plaza automáticamente.',
    icon: CheckCircle2,
    color: 'text-gpa-cyan',
    bg: 'bg-gpa-cyan/10',
    border: 'border-gpa-cyan/20',
  },
];

/* ── Mini dashboard preview ── */
function DashboardPreview() {
  const bars = [35, 60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 88];

  return (
    <div className="bg-[#0a0a0f] rounded-[1.8rem] overflow-hidden border border-white/8">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
        </div>
        <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-[10px] text-slate-500 font-mono text-center">
          app.gpa.com/dashboard
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-[9px] font-black">LIVE</span>
        </div>
      </div>

      {/* Dashboard layout */}
      <div className="flex h-[520px]">
        {/* Sidebar */}
        <div className="w-52 border-r border-white/8 p-4 hidden md:flex flex-col gap-2">
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm">GPA</p>
              <p className="text-slate-600 text-[9px] font-bold uppercase tracking-wider">Parqueadero</p>
            </div>
          </div>

          {[
            { icon: LayoutGrid, label: 'Dashboard', active: true },
            { icon: Car, label: 'Vehículos' },
            { icon: BarChart3, label: 'Historial' },
            { icon: UserCircle, label: 'Usuarios' },
            { icon: Settings, label: 'Ajustes' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                item.active
                  ? 'bg-gpa-blue/15 border border-gpa-blue/25 text-gpa-blue'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon size={16} />
              <span className="text-xs font-semibold">{item.label}</span>
            </motion.div>
          ))}

          <div className="mt-auto">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-7 h-7 rounded-full bg-gpa-blue/20 flex items-center justify-center">
                <span className="text-gpa-blue text-xs font-black">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">Admin</p>
                <p className="text-slate-600 text-[9px]">Administrador</p>
              </div>
              <LogOut size={12} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 overflow-hidden space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-black text-base tracking-tight">Panel de Control</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Sistema Operativo</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-gpa-blue/10 border border-gpa-blue/20 text-gpa-blue text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                Sincronizado
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Plazas Libres', value: '8', color: 'text-emerald-400', bar: 'bg-emerald-500', pct: '36%' },
              { label: 'Ocupadas', value: '14', color: 'text-gpa-blue', bar: 'bg-gpa-blue', pct: '64%' },
              { label: 'Flujo Hoy', value: '127', color: 'text-purple-400', bar: 'bg-purple-500', pct: '85%' },
              { label: 'Ingresos', value: '$84K', color: 'text-amber-400', bar: 'bg-amber-500', pct: '72%' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="bg-white/[0.03] border border-white/8 rounded-xl p-3"
              >
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-slate-600 text-[9px] font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: s.pct }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.8 }}
                    className={`h-full ${s.bar} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/[0.02] border border-white/8 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-xs font-black uppercase tracking-wider">Ingresos Diarios</p>
              <span className="text-emerald-400 text-[10px] font-black">+18.5% ↑</span>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ delay: 0.7 + i * 0.04, duration: 0.5 }}
                  className="flex-1 rounded-t-sm relative overflow-hidden"
                  style={{ background: `linear-gradient(to top, oklch(0.70 0.20 250 / 0.6), oklch(0.70 0.20 250 / 0.2))` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent vehicles */}
          <div className="space-y-1.5">
            {[
              { placa: 'ABC-123', tipo: 'Carro', plaza: 'A-03', hora: '14:32', estado: 'entrada' },
              { placa: 'XYZ-789', tipo: 'Moto', plaza: 'M-02', hora: '14:28', estado: 'salida' },
              { placa: 'DEF-456', tipo: 'Camioneta', plaza: 'C-01', hora: '14:15', estado: 'entrada' },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-white text-xs font-black tracking-wider">{v.placa}</span>
                  <span className="text-slate-600 text-[9px]">{v.tipo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 text-[9px]">{v.plaza}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    v.estado === 'entrada'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {v.estado.toUpperCase()}
                  </span>
                  <span className="text-slate-600 text-[9px]">{v.hora}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SaaSPreview = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const smoothY = useSpring(y, { stiffness: 80, damping: 25 });

  return (
    <>
      {/* ── How it works ── */}
      <section className="py-28 px-6 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gpa-blue/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-badge mx-auto w-fit">
                <Clock className="w-3.5 h-3.5 text-gpa-cyan" />
                Cómo Funciona
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
            >
              De la entrada a la salida,{' '}
              <span className="text-gradient-blue-purple">todo automatizado</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto"
            >
              Un flujo de trabajo diseñado para ser rápido, preciso y sin fricciones para el operador y el cliente.
            </motion.p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-gpa-blue/30 via-gpa-purple/30 to-gpa-cyan/30 z-0" />

            {pasos.map((paso, i) => {
              const Icon = paso.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="step-card relative z-10 group"
                >
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-xl ${paso.bg} border ${paso.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${paso.color}`} />
                    </div>
                    <span className="text-3xl font-black text-white/10 font-mono">{paso.numero}</span>
                  </div>

                  <h3 className="text-white font-bold text-base mb-2">{paso.titulo}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{paso.descripcion}</p>

                  {/* Arrow for non-last items */}
                  {i < pasos.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-10 z-20 w-6 h-6 rounded-full bg-[#0a0a0f] border border-white/10 items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Dashboard preview ── */}
      <section ref={containerRef} className="py-24 px-6 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>

        <motion.div style={{ y: smoothY }} className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-badge mx-auto w-fit">
                <BarChart3 className="w-3.5 h-3.5 text-gpa-blue" />
                Panel de Control
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
            >
              Una interfaz diseñada para{' '}
              <span className="text-gradient-blue-purple">la eficiencia total</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto"
            >
              Diseño premium tipo SaaS moderno. Minimalista, tecnológico y extremadamente funcional.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-gpa-blue/15 via-gpa-purple/10 to-gpa-cyan/15 rounded-[2.5rem] blur-[40px] -z-10" />

            {/* Frame */}
            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-white/10 via-white/5 to-white/10 shadow-2xl shadow-black/50">
              <DashboardPreview />
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default SaaSPreview;
