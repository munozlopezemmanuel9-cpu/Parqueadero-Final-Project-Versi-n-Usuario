import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Zap, LayoutDashboard,
  ChevronDown, Play, Star, Car, Activity, TrendingUp, Search

} from 'lucide-react';

/* ── Floating metric card ── */
function MetricCard({ label, value, color, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', stiffness: 120 }}
      className={`absolute glass-card-premium px-4 py-3 flex items-center gap-3 ${className}`}
    >
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
        <Activity className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-white font-black text-lg leading-none">{value}</p>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Animated parking grid ── */
function ParkingGrid() {
  const spots = [
    { id: 1, status: 'occupied', type: 'car' },
    { id: 2, status: 'free', type: 'car' },
    { id: 3, status: 'occupied', type: 'car' },
    { id: 4, status: 'occupied', type: 'moto' },
    { id: 5, status: 'free', type: 'car' },
    { id: 6, status: 'maintenance', type: 'car' },
    { id: 7, status: 'occupied', type: 'car' },
    { id: 8, status: 'free', type: 'moto' },
    { id: 9, status: 'occupied', type: 'car' },
    { id: 10, status: 'free', type: 'car' },
    { id: 11, status: 'occupied', type: 'truck' },
    { id: 12, status: 'free', type: 'car' },
  ];

  const colors = {
    occupied: 'bg-gpa-blue/30 border-gpa-blue/50',
    free: 'bg-emerald-500/20 border-emerald-500/40',
    maintenance: 'bg-amber-500/20 border-amber-500/40',
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {spots.map((spot, i) => (
        <motion.div
          key={spot.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.05, type: 'spring', stiffness: 200 }}
          className={`h-12 rounded-lg border ${colors[spot.status]} flex items-center justify-center relative overflow-hidden`}
        >
          {spot.status === 'occupied' && (
            <Car className="w-5 h-5 text-gpa-blue/70" />
          )}
          {spot.status === 'free' && (
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
          {spot.status === 'maintenance' && (
            <span className="text-amber-400 text-[8px] font-black uppercase">MNT</span>
          )}
          <div className="absolute bottom-1 right-1 text-[7px] font-black text-white/30">
            {String.fromCharCode(64 + Math.ceil(spot.id / 4))}-0{((spot.id - 1) % 4) + 1}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ '--mouse-x': `${mousePos.x}%`, '--mouse-y': `${mousePos.y}%` }}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mouse-tracking glow */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.18] blur-[150px] transition-all duration-200 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-blue) 0%, transparent 70%)',
            left: 'calc(var(--mouse-x) - 400px)',
            top: 'calc(var(--mouse-y) - 400px)',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.10] blur-[120px] transition-all duration-500 ease-out"
          style={{
            background: 'radial-gradient(circle, var(--color-gpa-purple) 0%, transparent 70%)',
            left: 'calc(100% - var(--mouse-x) - 300px)',
            top: 'calc(100% - var(--mouse-y) - 300px)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -40, 0], x: [0, 20, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, delay: i * 0.7 }}
            className="absolute w-1.5 h-1.5 rounded-full bg-gpa-blue"
            style={{ top: `${15 + i * 10}%`, left: `${5 + i * 12}%` }}
          />
        ))}

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#07070a] to-transparent" />
      </div>

      {/* ── Navigation ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 flex justify-between items-center w-full max-w-7xl mx-auto px-6 lg:px-16 py-6"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-11 h-11 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-xl flex items-center justify-center shadow-lg shadow-gpa-blue/25"
          >
            <LayoutDashboard className="text-white w-6 h-6" />
          </motion.div>
          <div>
            <span className="text-xl font-bold tracking-tighter text-white">
              GPA<span className="text-gpa-blue">.</span>
            </span>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Parqueadero</p>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          {['Características', 'Precios', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:block px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/registro"
            className="group relative px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-gpa-blue to-gpa-purple rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gpa-blue/30 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Registrarse
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gpa-purple to-gpa-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 flex-1 flex items-center"
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 py-16 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gpa-blue/10 border border-gpa-blue/20 text-gpa-blue text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </motion.div>
                  Gestión Inteligente de Parqueaderos
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-gpa-cyan/20 text-gpa-cyan text-[9px] font-black">
                    v2.0
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[0.92]">
                  El Futuro de la
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.92]">
                  <span className="relative inline-block">
                    <span className="text-gradient">
                      Movilidad
                    </span>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
                      className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-gpa-blue to-gpa-cyan rounded-full origin-left"
                    />
                  </span>
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[0.92]">
                  Urbana
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-400 max-w-xl leading-relaxed"
              >
                Automatiza el control de vehículos, optimiza la rentabilidad y ofrece una{' '}
                <span className="text-white font-semibold">experiencia premium</span> a tus clientes con la plataforma de gestión más avanzada.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/registro"
                  className="group relative px-8 py-4 bg-gradient-to-r from-gpa-blue to-gpa-purple text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gpa-blue/40 flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Comenzar Gratis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
                </Link>

                <Link
                  to="/mapa"
                  className="group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-full bg-gpa-blue/15 flex items-center justify-center group-hover:bg-gpa-blue/25 transition-colors">
                    <Search className="w-4 h-4 text-gpa-blue" />
                  </div>
                  <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">
                    Buscar Parqueadero
                  </span>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-6 pt-2"
              >
                {[
                  { icon: ShieldCheck, label: 'Seguro y Escalable', color: 'text-emerald-400' },
                  { icon: Star, label: '+500 Empresas', color: 'text-amber-400' },
                  { icon: Zap, label: 'Tiempo Real', color: 'text-gpa-cyan' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-2 text-slate-500">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative hidden lg:block"
            >
              {/* Main card */}
              <div className="relative glass-card-premium p-1 rounded-[2rem] overflow-visible">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-[10px] text-slate-500 font-mono text-center">
                    app.gpa.com/dashboard
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gpa-blue/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gpa-blue animate-pulse" />
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="bg-[#0d0d12] rounded-b-[1.8rem] p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-black text-lg tracking-tight">Panel GPA</p>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sistema Operativo</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">En línea</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Plazas Libres', value: '8', color: 'text-emerald-400', bar: 'bg-emerald-500' },
                      { label: 'Ocupadas', value: '14', color: 'text-gpa-blue', bar: 'bg-gpa-blue' },
                      { label: 'Ingresos Hoy', value: '$84K', color: 'text-amber-400', bar: 'bg-amber-500' },
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="bg-white/[0.03] border border-white/8 rounded-xl p-3"
                      >
                        <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
                        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: i === 0 ? '36%' : i === 1 ? '64%' : '78%' }}
                            transition={{ delay: 1.2 + i * 0.1, duration: 0.8 }}
                            className={`h-full ${s.bar} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Parking grid */}
                  <div className="bg-white/[0.02] border border-white/8 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                      <span className="text-white text-xs font-black uppercase tracking-wider">Mapa de Plazas</span>
                      <span className="text-gpa-cyan text-[10px] font-bold">En vivo</span>
                    </div>
                    <ParkingGrid />
                  </div>

                  {/* Recent activity */}
                  <div className="space-y-2">
                    {[
                      { placa: 'ABC-123', tipo: 'Entrada', hora: '14:32', color: 'text-emerald-400' },
                      { placa: 'XYZ-789', tipo: 'Salida', hora: '14:28', color: 'text-red-400' },
                      { placa: 'DEF-456', tipo: 'Entrada', hora: '14:15', color: 'text-emerald-400' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + i * 0.1 }}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <Car className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-white text-xs font-black tracking-wider">{item.placa}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold ${item.color}`}>{item.tipo}</span>
                          <span className="text-slate-600 text-[10px]">{item.hora}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating metric cards */}
              <MetricCard
                label="Ocupación"
                value="84%"
                color="bg-gpa-blue"
                delay={1.0}
                className="-top-6 -right-8 shadow-2xl shadow-gpa-blue/20"
              />
              <MetricCard
                label="Vehículos Hoy"
                value="127"
                color="bg-emerald-500"
                delay={1.2}
                className="-bottom-4 -left-8 shadow-2xl shadow-emerald-500/20"
              />

              {/* Glow behind card */}
              <div className="absolute inset-0 -z-10 blur-[80px] opacity-30 bg-gradient-to-br from-gpa-blue/40 to-gpa-purple/40 rounded-[2rem]" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">Scroll</span>
          <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-gpa-blue transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
