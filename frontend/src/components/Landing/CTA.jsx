import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, MessageCircle, Phone, Mail,
  Clock, Send, Zap, CheckCircle2,
} from 'lucide-react';

const CTA = () => {
  return (
    <section id="contacto" className="py-28 px-6 lg:px-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gpa-blue/3 to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-gpa-blue/8 blur-[150px]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-1 mb-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gpa-blue/30 via-gpa-purple/30 to-gpa-cyan/30 rounded-3xl" />
          <div className="relative glass-card-premium rounded-[1.4rem] p-10 md:p-16 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gpa-blue/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
              <div className="section-badge mx-auto w-fit">
                <Zap className="w-3.5 h-3.5 text-gpa-cyan fill-current" />
                Comienza Hoy
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                ¿Listo para transformar
                <br />
                <span className="text-gradient">tu parqueadero?</span>
              </h2>

              <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                Únete a más de 500 empresas que ya están optimizando sus operaciones con GPA. Sin contratos, sin complicaciones.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {['Sin tarjeta de crédito', 'Configuración en 5 min', 'Soporte incluido'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gpa-blue" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/registro"
                  className="group relative px-10 py-4 bg-gradient-to-r from-gpa-blue to-gpa-purple text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gpa-blue/40 flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Comenzar Gratis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
                </Link>

                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="section-badge w-fit mb-4">
                <MessageCircle className="w-3.5 h-3.5" />
                Contáctanos
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                ¿Tienes preguntas?
                <br />
                <span className="text-gradient-blue-purple">Estamos aquí.</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Nuestro equipo está disponible para ayudarte a implementar la solución perfecta para tu negocio.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  label: 'Teléfono',
                  value: '+57 (1) 234-5678',
                  color: 'text-gpa-blue',
                  bg: 'bg-gpa-blue/10',
                  border: 'border-gpa-blue/20',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'contacto@gpaparqueadero.com',
                  color: 'text-gpa-purple',
                  bg: 'bg-gpa-purple/10',
                  border: 'border-gpa-purple/20',
                },
                {
                  icon: Clock,
                  label: 'Horario',
                  value: 'Lun - Vie: 8:00 AM - 6:00 PM',
                  color: 'text-gpa-cyan',
                  bg: 'bg-gpa-cyan/10',
                  border: 'border-gpa-cyan/20',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="text-slate-200 font-medium text-sm mt-0.5">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="https://wa.me/5712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-bold transition-all duration-300 group"
            >
              <MessageCircle className="w-5 h-5" />
              Chatear por WhatsApp
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <div className="glass-card-premium p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">Envíanos un mensaje</h3>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      className="glass-input"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Empresa</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="Nombre de tu parqueadero"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mensaje</label>
                  <textarea
                    rows={4}
                    className="glass-input resize-none"
                    placeholder="¿Cómo podemos ayudarte?"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-premium w-full flex items-center justify-center gap-2"
                >
                  Enviar Mensaje
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
