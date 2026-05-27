import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Car,
  TrendingUp,
  Clock,
  Users,
  Zap,
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";

/* ── Animated counter hook ── */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, start: () => setStarted(true) };
}

/* ── Stat Card for Horizontal Scroll ── */
function HorizontalStatCard({
  value,
  suffix = "",
  label,
  icon: Icon,
  accentColor,
  delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 100px 0px 100px" });
  const { count, start } = useCountUp(value, 2000);

  useEffect(() => {
    if (inView) start();
  }, [inView, start]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "0px 100px 0px 100px" }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, scale: 1.05, transition: { duration: 0.3 } }}
      className="relative group cursor-default select-none min-w-[280px] w-full max-w-[320px] mx-4"
    >
      <div className="relative rounded-[2rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] p-8 overflow-hidden h-full shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:border-white/[0.2]">
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${accentColor}25, transparent 70%)`,
          }}
        />

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
            border: `1px solid ${accentColor}44`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>

        {/* Value */}
        <div className="flex items-end gap-1.5 mb-3">
          <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
            {value >= 100000 ? (count / 1000000).toFixed(1) : count.toLocaleString()}
          </span>
          <span
            className="text-2xl font-black mb-1"
            style={{ color: accentColor }}
          >
            {value >= 100000 ? "M+" : suffix}
          </span>
        </div>

        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.15em]">
          {label}
        </p>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.6, duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 h-1 origin-left"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── Floating Particles Layer ── */
const ParticleLayer = () => {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    color: Math.random() > 0.5 ? "#f59e0b" : "#fbbf24",
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: ["-20%", "20%", "-20%"],
            x: ["-10%", "10%", "-10%"],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ── Main Parallax Component ── */
const ScrollCaramel = () => {
  const targetRef = useRef(null);

  // Track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll for a more premium feel
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  // Calculate translation: we have 4 screens (each 100vw) so we translate by -75% of the total width
  const x = useTransform(springProgress, [0, 1], ["0%", "-75%"]);

  // Parallax elements in the background
  const bgX1 = useTransform(springProgress, [0, 1], ["0%", "-20%"]);
  const bgX2 = useTransform(springProgress, [0, 1], ["0%", "-40%"]);

  const stats = [
    { value: 500, suffix: "+", label: "Parqueaderos", icon: Car, accentColor: "#f59e0b", delay: 0.1 },
    { value: 2000000, suffix: "M+", label: "Vehículos", icon: TrendingUp, accentColor: "#fbbf24", delay: 0.2 },
    { value: 99, suffix: ".9%", label: "Uptime", icon: Zap, accentColor: "#d97706", delay: 0.3 },
    { value: 28, suffix: "s", label: "Registro", icon: Clock, accentColor: "#f59e0b", delay: 0.4 },
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#030305]">
      {/* The sticky container that holds the horizontal sliding track */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Ambient Caramel Glows */}
        <motion.div style={{ x: bgX1, willChange: 'transform' }} className="absolute inset-0 z-0 pointer-events-none w-[200vw]">
          <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform: 'translateZ(0)' }} />
          <div className="absolute bottom-[-10%] left-[40%] w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)', transform: 'translateZ(0)' }} />
          <div className="absolute top-[20%] left-[80%] w-[700px] h-[700px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #eab308 0%, transparent 70%)', transform: 'translateZ(0)' }} />
        </motion.div>

        {/* Floating Particles */}
        <ParticleLayer />

        {/* Horizontal Track */}
        <motion.div style={{ x }} className="flex w-[400vw] h-full z-10">
          
          {/* SLIDE 1: Hero Intro */}
          <div className="w-screen h-full flex flex-col items-center justify-center px-6 lg:px-20 relative">
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm mb-8"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 text-xs font-black uppercase tracking-[0.25em]">
                  Métricas de Éxito
                </span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </motion.div>

              <h2 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-white leading-[1.05] mb-8">
                La plataforma en la que{" "}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600">
                  confían los mejores
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed">
                Descubre por qué más de 500 parqueaderos han revolucionado su operación, multiplicando ingresos y eliminando filas.
              </p>
              
              <div className="mt-12 flex items-center gap-4 text-amber-500/80">
                 <span className="uppercase text-xs font-bold tracking-[0.3em]">Desliza para ver más</span>
                 <ArrowRight className="w-5 h-5 animate-bounce-x" />
              </div>
            </div>
          </div>

          {/* SLIDE 2: Stats Grid */}
          <div className="w-screen h-full flex items-center justify-center px-6 relative">
             <div className="flex flex-wrap md:flex-nowrap justify-center gap-8 w-full max-w-7xl">
                {stats.map((s, i) => (
                  <HorizontalStatCard key={i} {...s} />
                ))}
             </div>
          </div>

          {/* SLIDE 3: Features & Testimonial */}
          <div className="w-screen h-full flex flex-col md:flex-row items-center justify-center px-6 lg:px-20 gap-16 relative">
             {/* Features */}
             <div className="w-full md:w-5/12 space-y-8">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-10">
                   Control total en <span className="text-amber-500">tiempo real</span>
                </h3>
                {[
                  { title: "Cero papel, cero errores", desc: "Digitaliza el 100% de tus registros desde el primer día." },
                  { title: "Pagos automáticos", desc: "Calcula tarifas al segundo y genera recibos instantáneos." },
                  { title: "Dashboard en vivo", desc: "Monitorea ingresos y ocupación desde tu celular." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 100px" }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className="flex gap-5 items-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                       <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                       <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
             </div>

             {/* Testimonial Card */}
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 100px" }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-6/12 max-w-xl"
             >
                <div className="relative rounded-[2.5rem] bg-[#0c0c10] border border-amber-500/20 p-10 md:p-14 shadow-2xl">
                   <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />
                   <div className="text-[100px] leading-none font-serif text-amber-500/40 absolute top-4 left-6">
                      "
                   </div>
                   <p className="relative z-10 text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 mt-6">
                      Desde que implementamos GPA, el tiempo de atención bajó de 3 minutos a <span className="text-amber-400 font-bold">28 segundos</span>. Los ingresos subieron 40%.
                   </p>
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-black text-lg">
                         CM
                      </div>
                      <div>
                         <p className="text-white font-bold text-lg">Carlos Morales</p>
                         <p className="text-amber-500/80 text-sm">Director Operativo · ParkCenter</p>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>

          {/* SLIDE 4: Call to Action */}
          <div className="w-screen h-full flex flex-col items-center justify-center px-6 relative">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "0px 100px" }}
               transition={{ duration: 0.8 }}
               className="text-center max-w-3xl"
            >
               <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8">
                  Lleva tu parqueadero al <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">siguiente nivel</span>
               </h2>
               <p className="text-2xl text-slate-400 mb-12">
                  Únete a la red de parqueaderos más eficiente de Colombia. Empieza gratis hoy.
               </p>
               <a
                  href="/registro"
                  className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-bold text-black text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
               >
                  <span className="relative z-10">Crear mi cuenta gratis</span>
                  <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               </a>
            </motion.div>
          </div>

        </motion.div>
      </div>

      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(25%); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default ScrollCaramel;
