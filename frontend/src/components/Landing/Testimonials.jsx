import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Building2, Car, Clock, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    cargo: 'Gerente General',
    empresa: 'Parqueadero Central Plaza',
    rating: 5,
    testimonio: 'Desde que implementamos GPA, hemos reducido los errores de registro en un 95% y aumentado la eficiencia operativa significativamente. El personal aprendió a usarlo en minutos.',
    destacado: 'Reducción del 95% en errores',
    icono: Building2,
    color: 'text-gpa-blue',
    bg: 'bg-gpa-blue/10',
    border: 'border-gpa-blue/20',
  },
  {
    id: 2,
    nombre: 'María García',
    cargo: 'Administradora',
    empresa: 'Parking Premium Norte',
    rating: 5,
    testimonio: 'El dashboard en tiempo real nos permite tomar decisiones informadas al instante. Podemos ver la ocupación, ingresos y flujo vehicular desde cualquier lugar.',
    destacado: 'Visibilidad total en tiempo real',
    icono: TrendingUp,
    color: 'text-gpa-purple',
    bg: 'bg-gpa-purple/10',
    border: 'border-gpa-purple/20',
  },
  {
    id: 3,
    nombre: 'Roberto Silva',
    cargo: 'Director de Operaciones',
    empresa: 'Estacionamientos del Valle',
    rating: 5,
    testimonio: 'El cálculo automático de tarifas eliminó por completo las disputas con clientes. El sistema es transparente, preciso y los clientes están más satisfechos.',
    destacado: 'Clientes 100% satisfechos',
    icono: Clock,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    id: 4,
    nombre: 'Ana Torres',
    cargo: 'Supervisora',
    empresa: 'Parqueadero Metro Center',
    rating: 5,
    testimonio: 'La gestión de usuarios por roles nos da control total. Los empleados solo ven lo que necesitan y los administradores tenemos visión completa del sistema.',
    destacado: 'Control total por roles',
    icono: Car,
    color: 'text-gpa-cyan',
    bg: 'bg-gpa-cyan/10',
    border: 'border-gpa-cyan/20',
  },
];

const Testimonials = () => {
  return (
    <section className="py-28 px-6 lg:px-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute top-[20%] left-[-5%] w-[35%] h-[50%] rounded-full bg-gpa-blue/4 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[50%] rounded-full bg-gpa-purple/4 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-badge mx-auto w-fit">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Testimonios
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Lo que dicen nuestros{' '}
            <span className="text-gradient-blue-purple">clientes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Empresas de toda la región confían en GPA para optimizar sus operaciones diarias
          </motion.p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => {
            const Icon = t.icono;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="testimonial-card group"
              >
                {/* Quote icon */}
                <Quote className="absolute top-5 right-5 w-8 h-8 text-white/4 group-hover:text-gpa-blue/10 transition-colors" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-300 leading-relaxed mb-5 text-sm">
                  "{t.testimonio}"
                </p>

                {/* Highlight */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${t.bg} border ${t.border} text-sm font-semibold mb-5`}>
                  <Icon className={`w-4 h-4 ${t.color}`} />
                  <span className={t.color}>{t.destacado}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gpa-blue to-gpa-purple flex items-center justify-center text-white font-black text-base shrink-0">
                    {t.nombre.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.nombre}</h4>
                    <p className="text-slate-500 text-xs">{t.cargo} · {t.empresa}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '500+', label: 'Empresas Activas' },
            { value: '98%', label: 'Satisfacción' },
            { value: '2M+', label: 'Vehículos Gestionados' },
            { value: '24/7', label: 'Soporte Técnico' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="text-center glass-card p-5 border-white/5 hover:border-white/15 transition-colors"
            >
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
