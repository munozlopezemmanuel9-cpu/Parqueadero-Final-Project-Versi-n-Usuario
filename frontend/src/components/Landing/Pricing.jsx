import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Building, Crown, ArrowRight } from 'lucide-react';

const planes = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: 'Gratis',
    periodo: 'para siempre',
    descripcion: 'Perfecto para parqueaderos pequeños que están comenzando',
    icono: Zap,
    color: 'slate',
    border: 'border-slate-500/20',
    bg: 'bg-slate-500/10',
    textColor: 'text-slate-300',
    features: [
      { texto: 'Hasta 20 plazas', incluido: true },
      { texto: 'Registro de vehículos', incluido: true },
      { texto: 'Historial de movimientos', incluido: true },
      { texto: 'Cálculo automático de tarifas', incluido: true },
      { texto: 'Dashboard básico', incluido: true },
      { texto: '1 usuario administrador', incluido: true },
      { texto: 'Soporte por email', incluido: true },
      { texto: 'Reportes avanzados', incluido: false },
      { texto: 'Múltiples sucursales', incluido: false },
      { texto: 'API personalizada', incluido: false },
    ],
    cta: 'Comenzar Gratis',
    popular: false,
  },
  {
    id: 'pro',
    nombre: 'Profesional',
    precio: '$99.000',
    periodo: '/mes',
    descripcion: 'Ideal para parqueaderos medianos con necesidades de gestión avanzada',
    icono: Building,
    color: 'gpa-blue',
    border: 'border-gpa-blue/30',
    bg: 'bg-gpa-blue/10',
    textColor: 'text-gpa-blue',
    features: [
      { texto: 'Plazas ilimitadas', incluido: true },
      { texto: 'Todo lo del plan Básico', incluido: true },
      { texto: 'Usuarios ilimitados', incluido: true },
      { texto: 'Roles y permisos avanzados', incluido: true },
      { texto: 'Dashboard avanzado con métricas', incluido: true },
      { texto: 'Exportación a Excel y PDF', incluido: true },
      { texto: 'Soporte prioritario 24/7', incluido: true },
      { texto: 'Reportes automatizados', incluido: true },
      { texto: 'Integración con sistemas de pago', incluido: true },
      { texto: 'Múltiples sucursales', incluido: false },
    ],
    cta: 'Comenzar Prueba',
    popular: true,
  },
  {
    id: 'enterprise',
    nombre: 'Enterprise',
    precio: 'Personalizado',
    periodo: '',
    descripcion: 'Solución completa para grandes operaciones y cadenas de parqueaderos',
    icono: Crown,
    color: 'gpa-purple',
    border: 'border-gpa-purple/30',
    bg: 'bg-gpa-purple/10',
    textColor: 'text-gpa-purple',
    features: [
      { texto: 'Todo lo del plan Pro', incluido: true },
      { texto: 'Múltiples sucursales', incluido: true },
      { texto: 'API personalizada', incluido: true },
      { texto: 'Integración con sistemas existentes', incluido: true },
      { texto: 'Capacitación presencial', incluido: true },
      { texto: 'Gerente de cuenta dedicado', incluido: true },
      { texto: 'SLA garantizado', incluido: true },
      { texto: 'Backup automático', incluido: true },
      { texto: 'Hosting dedicado', incluido: true },
      { texto: 'Desarrollo a medida', incluido: true },
    ],
    cta: 'Contactar Ventas',
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="precios" className="py-24 px-6 lg:px-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-gpa-blue/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-gpa-purple/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            <Zap className="w-4 h-4" />
            Planes y Precios
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-6"
          >
            Elige el plan perfecto para{' '}
            <span className="bg-gradient-to-r from-gpa-blue to-gpa-purple bg-clip-text text-transparent">
              tu negocio
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Sin contratos largos. Cancela cuando quieras. Todos los planes incluyen actualizaciones gratuitas.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planes.map((plan, index) => {
            const IconComponent = plan.icono;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-gpa-blue/10 to-transparent border-2 border-gpa-blue/30'
                    : `bg-white/[0.02] border ${plan.border}`
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 bg-gpa-blue text-white text-xs font-bold rounded-full shadow-lg shadow-gpa-blue/30">
                      MÁS POPULAR
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 ${plan.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <IconComponent className={`w-7 h-7 ${plan.textColor}`} />
                </div>

                {/* Plan name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.nombre}</h3>
                <p className="text-slate-500 text-sm mb-6">{plan.descripcion}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl font-black text-white">{plan.precio}</span>
                  <span className="text-slate-500 text-sm">{plan.periodo}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.incluido ? (
                        <div className={`w-5 h-5 rounded-full ${plan.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Check className={`w-3 h-3 ${plan.textColor}`} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-slate-600" />
                        </div>
                      )}
                      <span className={feature.incluido ? 'text-slate-300' : 'text-slate-600'}>
                        {feature.texto}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group ${
                    plan.popular
                      ? 'bg-gpa-blue text-white hover:bg-gpa-blue/80 shadow-lg shadow-gpa-blue/30'
                      : `bg-white/5 text-white border ${plan.border} hover:bg-white/10`
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-500 text-sm mt-12"
        >
          Todos los precios son en pesos colombianos (COP). IVA incluido donde aplique.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
