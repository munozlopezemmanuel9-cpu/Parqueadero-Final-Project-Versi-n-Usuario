import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Clock, CreditCard, ShieldAlert, Zap,
  BarChart3, Lock, Target, Users, Lightbulb, TrendingUp,
  AlertTriangle, XCircle, ArrowRight, Building2,
} from 'lucide-react';

/* ── Animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
});

/* ── Who we are ── */
function QuienesSomos() {
  return (
    <section className="py-28 px-6 lg:px-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gpa-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div {...fadeUp(0)} className="space-y-6">
            <div className="section-badge">
              <Building2 className="w-3.5 h-3.5" />
              Quiénes Somos
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Somos el equipo que{' '}
              <span className="text-gradient-blue-purple">
                reinventa
              </span>{' '}
              la gestión vehicular
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              GPA nació de la necesidad real de modernizar los parqueaderos colombianos. Somos un equipo de ingenieros y diseñadores apasionados por crear tecnología que transforma negocios.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Nuestra misión es simple: eliminar el caos administrativo y reemplazarlo con un sistema inteligente, elegante y eficiente que cualquier operador pueda dominar en minutos.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { value: '500+', label: 'Empresas activas' },
                { value: '2M+', label: 'Vehículos gestionados' },
                { value: '98%', label: 'Satisfacción del cliente' },
                { value: '24/7', label: 'Soporte técnico' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(0.1 + i * 0.08)}
                  className="glass-card p-4 border-white/5"
                >
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — visual */}
          <motion.div
            {...fadeUp(0.2)}
            className="relative"
          >
            <div className="glass-card-premium p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-2xl flex items-center justify-center shadow-lg shadow-gpa-blue/25">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Nuestra Visión</h3>
                  <p className="text-slate-500 text-sm">Tecnología al servicio del negocio</p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                "Creemos que cada parqueadero merece herramientas de clase mundial. No importa si tienes 10 plazas o 1,000 — GPA escala contigo."
              </p>

              <div className="divider-glow" />

              <div className="space-y-3">
                {[
                  'Tecnología cloud-native y escalable',
                  'Diseño centrado en el usuario',
                  'Actualizaciones continuas sin costo',
                  'Soporte en español 24/7',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-gpa-blue shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-gpa-blue/10 to-gpa-purple/10 rounded-[2rem] blur-[40px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Problems we solve ── */
const problemas = [
  {
    icon: AlertTriangle,
    titulo: 'Desorden Administrativo',
    descripcion: 'Registros en papel, cuadernos perdidos y datos inconsistentes que generan caos operativo.',
    solucion: 'Digitalización total con registros automáticos y trazabilidad completa.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    icon: XCircle,
    titulo: 'Errores Humanos Costosos',
    descripcion: 'Cálculos manuales incorrectos, cobros equivocados y pérdida de ingresos por descuidos.',
    solucion: 'Cálculo automático de tarifas con precisión al segundo.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Clock,
    titulo: 'Procesos Lentos e Ineficientes',
    descripcion: 'Largas filas, clientes frustrados y operadores desbordados por procesos manuales.',
    solucion: 'Registro de entrada/salida en menos de 30 segundos.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: BarChart3,
    titulo: 'Cero Visibilidad del Negocio',
    descripcion: 'Sin datos en tiempo real, imposible tomar decisiones informadas sobre el negocio.',
    solucion: 'Dashboard con métricas en vivo: ocupación, ingresos y flujo vehicular.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

function ProblemasSolucionamos() {
  return (
    <section className="py-28 px-6 lg:px-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gpa-purple/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div {...fadeUp(0)}>
            <div className="section-badge mx-auto w-fit">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Problemas que Solucionamos
            </div>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            ¿Reconoces alguno de{' '}
            <span className="text-gradient-blue-purple">estos problemas?</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-slate-400 text-lg max-w-2xl mx-auto">
            Cada uno de estos desafíos tiene una solución concreta en GPA. Así es como transformamos tu operación.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {problemas.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.08)}
                className="group relative p-6 rounded-2xl bg-white/[0.025] border border-white/8 hover:border-white/15 transition-all duration-400 overflow-hidden"
              >
                {/* Problem side */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${p.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{p.titulo}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{p.descripcion}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                {/* Solution side */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gpa-blue/15 border border-gpa-blue/25 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-gpa-blue" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gpa-blue uppercase tracking-wider mb-1">Nuestra Solución</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{p.solucion}</p>
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gpa-blue/0 to-gpa-blue/0 group-hover:from-gpa-blue/3 group-hover:to-transparent transition-all duration-500 pointer-events-none rounded-2xl" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── What we do / Features ── */
const features = [
  {
    title: 'Control de Vehículos en Tiempo Real',
    description: 'Registra entradas y salidas en segundos. Busca por placa, asigna plazas automáticamente y monitorea todo desde un solo panel.',
    icon: Zap,
    color: 'text-gpa-blue',
    bg: 'bg-gpa-blue/10',
    border: 'border-gpa-blue/20',
  },
  {
    title: 'Cálculo Automático de Tarifas',
    description: 'El sistema calcula el costo exacto basado en tiempo de permanencia y tipo de plaza. Sin errores, sin disputas con clientes.',
    icon: Clock,
    color: 'text-gpa-cyan',
    bg: 'bg-gpa-cyan/10',
    border: 'border-gpa-cyan/20',
  },
  {
    title: 'Gestión de Roles y Permisos',
    description: 'Administradores con visión total y empleados con herramientas operativas. Cada usuario ve exactamente lo que necesita.',
    icon: Lock,
    color: 'text-gpa-purple',
    bg: 'bg-gpa-purple/10',
    border: 'border-gpa-purple/20',
  },
  {
    title: 'Pagos Múltiples y Transparentes',
    description: 'Efectivo, tarjeta o transferencia. Cada transacción queda registrada con fecha, hora y método de pago para auditoría completa.',
    icon: CreditCard,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    title: 'Dashboard Analítico Avanzado',
    description: 'Métricas de ocupación, ingresos brutos, flujo vehicular y distribución por tipo. Toma decisiones basadas en datos reales.',
    icon: BarChart3,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    title: 'Reportes y Exportación',
    description: 'Historial completo con filtros avanzados. Exporta a CSV para contabilidad, auditorías o análisis externos en un clic.',
    icon: TrendingUp,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
];

function QueHacemos() {
  return (
    <section id="características" className="py-28 px-6 lg:px-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gpa-blue/4 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div {...fadeUp(0)}>
            <div className="section-badge mx-auto w-fit">
              <Lightbulb className="w-3.5 h-3.5 text-gpa-cyan" />
              Qué Hacemos
            </div>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Todo lo que necesitas para{' '}
            <span className="text-gradient-blue-purple">gestionar tu parqueadero</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-slate-400 text-lg max-w-2xl mx-auto">
            Un ecosistema completo diseñado para maximizar la eficiencia operativa y elevar la percepción de valor de tu negocio.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                {...fadeUp(0.05 + i * 0.07)}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="feature-card group"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className={`text-lg font-bold text-white mb-3 group-hover:${f.color} transition-colors duration-300`}>
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {f.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-white transition-colors">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${f.color}`} />
                  Implementado y Optimizado
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why different */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-20 relative overflow-hidden rounded-3xl p-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gpa-blue/20 via-gpa-purple/20 to-gpa-cyan/20 rounded-3xl" />
          <div className="relative glass-card-premium rounded-[1.4rem] p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="section-badge w-fit">
                  <Users className="w-3.5 h-3.5" />
                  Por Qué Somos Diferentes
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  No somos solo software.
                  <br />
                  <span className="text-gradient">Somos tu socio tecnológico.</span>
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Mientras otros ofrecen herramientas genéricas, nosotros construimos una plataforma específicamente diseñada para la realidad del mercado latinoamericano, con soporte en español y precios accesibles.
                </p>
                <a href="#precios" className="inline-flex items-center gap-2 text-gpa-blue font-bold hover:text-gpa-cyan transition-colors group">
                  Ver planes y precios
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldAlert, label: 'Seguridad Empresarial', desc: 'JWT + bcrypt + roles' },
                  { icon: Zap, label: 'Ultra Rápido', desc: 'Respuesta < 200ms' },
                  { icon: BarChart3, label: 'Analytics Real', desc: 'Datos en tiempo real' },
                  { icon: Users, label: 'Multi-usuario', desc: 'Roles ilimitados' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="glass-card p-4 border-white/5 hover:border-gpa-blue/20 transition-colors">
                      <Icon className="w-5 h-5 text-gpa-blue mb-2" />
                      <p className="text-white font-bold text-sm">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Main export ── */
const Features = () => (
  <>
    <QuienesSomos />
    <ProblemasSolucionamos />
    <QueHacemos />
  </>
);

export default Features;
