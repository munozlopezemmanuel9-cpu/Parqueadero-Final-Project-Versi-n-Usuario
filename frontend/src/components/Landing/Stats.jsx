import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, MapPin, Shield, Car, DollarSign, Clock, Zap } from 'lucide-react';

const stats = [
  {
    label: 'Vehículos Gestionados',
    value: 2000000,
    suffix: '+',
    prefix: '',
    format: 'M',
    icon: Car,
    color: 'text-gpa-blue',
    glow: 'shadow-gpa-blue/20',
    bg: 'bg-gpa-blue/10',
    border: 'border-gpa-blue/20',
    description: 'Registros procesados exitosamente',
  },
  {
    label: 'Empresas Activas',
    value: 500,
    suffix: '+',
    prefix: '',
    format: 'K',
    icon: Users,
    color: 'text-gpa-purple',
    glow: 'shadow-gpa-purple/20',
    bg: 'bg-gpa-purple/10',
    border: 'border-gpa-purple/20',
    description: 'Parqueaderos confían en GPA',
  },
  {
    label: 'Plazas Optimizadas',
    value: 50000,
    suffix: '+',
    prefix: '',
    format: 'K',
    icon: MapPin,
    color: 'text-gpa-cyan',
    glow: 'shadow-gpa-cyan/20',
    bg: 'bg-gpa-cyan/10',
    border: 'border-gpa-cyan/20',
    description: 'Espacios bajo gestión inteligente',
  },
  {
    label: 'Satisfacción',
    value: 98,
    suffix: '%',
    prefix: '',
    format: 'plain',
    icon: Shield,
    color: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'Clientes satisfechos con el servicio',
  },
];

/* ── Animated counter ── */
function AnimatedCounter({ value, suffix, prefix, format }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2200;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNum = (n) => {
    if (format === 'M') return (n / 1000000).toFixed(1) + 'M';
    if (format === 'K') return n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toString();
    return n.toString();
  };

  return (
    <span ref={ref}>
      {prefix}{formatNum(display)}{suffix}
    </span>
  );
}

const Stats = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gpa-blue/3 to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gpa-blue/8 rounded-full blur-[120px]"
        />
        {/* Horizontal lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-badge mx-auto w-fit mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-gpa-blue" />
            Números que Hablan
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Resultados que{' '}
            <span className="text-gradient-blue-purple">demuestran</span>{' '}
            nuestro impacto
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.12, duration: 0.6, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className={`relative group p-7 rounded-2xl bg-white/[0.025] border ${stat.border} hover:bg-white/[0.04] transition-all duration-400 overflow-hidden`}
              >
                {/* Background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`relative z-10 w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-5 mx-auto`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </motion.div>

                {/* Value */}
                <div className={`relative z-10 text-4xl lg:text-5xl font-black text-white text-center mb-2 tracking-tighter`}>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    format={stat.format}
                  />
                </div>

                {/* Label */}
                <p className="relative z-10 text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-2">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="relative z-10 text-slate-600 text-[11px] text-center leading-relaxed">
                  {stat.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-transparent ${stat.color.replace('text-', 'via-')} to-transparent transition-all duration-500`} />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-card p-6 border-white/5 flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { icon: DollarSign, label: 'Ingresos Procesados', value: '$50B+ COP' },
            { icon: Clock, label: 'Tiempo Promedio Registro', value: '< 30 seg' },
            { icon: Zap, label: 'Uptime del Sistema', value: '99.9%' },
            { icon: Shield, label: 'Incidentes de Seguridad', value: '0' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 text-center md:text-left">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gpa-blue" />
                </div>
                <div>
                  <p className="text-white font-black text-sm">{item.value}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
