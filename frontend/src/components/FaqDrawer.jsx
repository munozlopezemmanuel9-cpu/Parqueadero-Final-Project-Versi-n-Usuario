import React, { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "¿Cómo ingreso un vehículo con comando de voz?",
    a: "Haz clic en el botón del micrófono y di: 'placa ABC 123'. Automáticamente se abrirá el formulario con la placa llena."
  },
  {
    q: "¿Qué tipos de vehículos reconoce?",
    a: "Puedes especificar 'carro', 'moto' o 'camioneta' en tu comando, por ejemplo: 'Ingresar moto XYZ 987'."
  },
  {
    q: "¿Cómo calculan las tarifas?",
    a: "El sistema calcula las tarifas automáticamente basado en el tipo de vehículo y el tiempo transcurrido desde el ingreso. Puedes verlo al dar salida."
  },
  {
    q: "¿Cómo se asigna una plaza?",
    a: "Una vez introducida la placa, el sistema te mostrará las plazas disponibles para ese tipo de vehículo. Solo debes seleccionar una."
  }
];

const FaqDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const handleVoiceCommand = (e) => {
      if (e.detail && e.detail.type === 'faq') {
        setIsOpen(true);
      }
    };

    window.addEventListener('voiceCommand', handleVoiceCommand);
    return () => window.removeEventListener('voiceCommand', handleVoiceCommand);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0c0c10] border-l border-white/10 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gpa-blue/10 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-gpa-blue" />
                </div>
                <h2 className="text-xl font-bold text-white">Ayuda y FAQ</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <p className="text-slate-400 text-sm mb-6">
                Encuentra respuestas rápidas a las preguntas más comunes sobre el uso de la plataforma y comandos de voz.
              </p>

              {faqs.map((faq, i) => (
                <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-slate-200 text-sm pr-4">{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-gpa-blue transition-transform ${openIndex === i ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5 text-center">
               <p className="text-xs text-slate-500 font-medium">Asistente de Voz activado. Di <span className="text-gpa-cyan">"Ayuda"</span> para abrir este panel.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FaqDrawer;
