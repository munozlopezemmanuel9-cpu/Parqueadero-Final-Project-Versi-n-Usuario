import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Landing/Hero';
import ScrollCaramel from '../components/Landing/ScrollCaramel';
import Features from '../components/Landing/Features';
import Stats from '../components/Landing/Stats';
import SaaSPreview from '../components/Landing/SaaSPreview';
import Testimonials from '../components/Landing/Testimonials';
import FAQ from '../components/Landing/FAQ';
import Pricing from '../components/Landing/Pricing';
import CTA from '../components/Landing/CTA';
import Footer from '../components/Landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#07070a] text-white selection:bg-gpa-blue/30 overflow-x-clip">
      {/* Global ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-gpa-blue/20 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.08, 0.13, 0.08] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gpa-purple/20 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-[45%] left-[45%] w-[25%] h-[25%] rounded-full bg-gpa-cyan/15 blur-[100px]"
        />
      </div>

      {/* Main content */}
      <main className="relative z-10">
        {/* 1. Hero principal impactante */}
        <Hero />

        {/* Caramel scroll transition — estadísticas animadas inmersivas */}
        <ScrollCaramel />

        {/* 2. Quiénes somos + 3. Qué hacemos + 4. Problemas que solucionamos + 6. Por qué somos diferentes */}
        <Features />

        {/* 7. Estadísticas animadas */}
        <Stats />

        {/* 8. Cómo funciona + 11. Dashboard preview */}
        <SaaSPreview />

        {/* 10. Testimonios */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* 5. Beneficios / Precios */}
        <Pricing />

        {/* 12. CTA final + Contacto */}
        <CTA />

        {/* 13. Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Landing;
