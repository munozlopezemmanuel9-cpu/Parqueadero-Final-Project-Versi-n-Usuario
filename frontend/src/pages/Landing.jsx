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
        <div
          className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translateZ(0)' }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', transform: 'translateZ(0)' }}
        />
        <div
          className="absolute top-[45%] left-[45%] w-[25%] h-[25%] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', transform: 'translateZ(0)' }}
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
