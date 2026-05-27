import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Github, Twitter, Linkedin, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const links = {
  Producto: [
    { label: 'Características', href: '#características' },
    { label: 'Precios', href: '#precios' },
    { label: 'Dashboard', href: '/login' },
    { label: 'Changelog', href: '#' },
  ],
  Empresa: [
    { label: 'Quiénes Somos', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Carreras', href: '#' },
    { label: 'Contacto', href: '#contacto' },
  ],
  Legal: [
    { label: 'Privacidad', href: '#' },
    { label: 'Términos', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'Seguridad', href: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gpa-blue/4 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-10 h-10 bg-gradient-to-br from-gpa-blue to-gpa-purple rounded-xl flex items-center justify-center shadow-lg shadow-gpa-blue/20"
              >
                <LayoutDashboard className="text-white w-5 h-5" />
              </motion.div>
              <div>
                <span className="text-xl font-bold tracking-tighter text-white">
                  GPA<span className="text-gpa-blue">.</span>
                </span>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Parqueadero</p>
              </div>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              La plataforma de gestión de parqueaderos más avanzada de Latinoamérica. Automatiza, optimiza y crece.
            </p>

            <div className="space-y-2.5">
              {[
                { icon: MapPin, text: 'Bogotá, Colombia' },
                { icon: Mail, text: 'contacto@gpaparqueadero.com' },
                { icon: Phone, text: '+57 (1) 234-5678' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 text-slate-500 text-xs">
                    <Icon className="w-3.5 h-3.5 text-gpa-blue shrink-0" />
                    {item.text}
                  </div>
                );
              })}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={i}
                    href={s.href}
                    whileHover={{ scale: 1.15, y: -2 }}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-gpa-blue/30 hover:bg-gpa-blue/10 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items], i) => (
            <div key={category} className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item, j) => (
                  <li key={j}>
                    <a
                      href={item.href}
                      className="text-slate-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} GPA Parqueadero. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Todos los sistemas operativos
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacidad</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Términos</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
