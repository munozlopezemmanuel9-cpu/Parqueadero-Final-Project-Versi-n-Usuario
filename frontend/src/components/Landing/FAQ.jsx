import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    pregunta: "¿Cómo funciona el sistema de registro de vehículos?",
    respuesta: "El proceso es muy sencillo. Cuando un vehículo llega, el operador ingresa la placa en el sistema. Si el vehículo ya está registrado, los datos se cargan automáticamente. Si es nuevo, se registran los datos básicos (tipo, marca, modelo, color). Luego se asigna una plaza disponible y el sistema genera un registro de entrada con la fecha y hora exactas.",
  },
  {
    pregunta: "¿Cómo se calcula el costo del estacionamiento?",
    respuesta: "El sistema calcula automáticamente el costo basándose en el tiempo de permanencia y la tarifa de la plaza asignada. Las tarifas varían según el tipo de vehículo: motos, carros, camionetas y espacios para discapacitados tienen tarifas diferenciadas. El tiempo se cobra por horas, con un mínimo de una hora, y el sistema redondea hacia arriba las fracciones de hora.",
  },
  {
    pregunta: "¿Qué diferencia hay entre el rol de Administrador y Empleado?",
    respuesta: "El Administrador tiene acceso total al sistema: puede gestionar usuarios, ver estadísticas completas, generar reportes, configurar tarifas y gestionar plazas. El Empleado tiene acceso únicamente a las funciones operativas: registrar entradas y salidas, consultar el estado de plazas y ver el historial de movimientos. NO puede acceder a la gestión de usuarios ni a configuraciones administrativas.",
  },
  {
    pregunta: "¿Puedo ver estadísticas de mi parqueadero en tiempo real?",
    respuesta: "Sí, el dashboard muestra estadísticas en tiempo real incluyendo: plazas disponibles y ocupadas, vehículos actualmente en el parqueadero, ingresos del día, distribución por tipo de vehículo, y flujo de movimientos. Los datos se actualizan automáticamente cada vez que se registra una entrada o salida.",
  },
  {
    pregunta: "¿Es seguro el sistema? ¿Cómo protegen los datos?",
    respuesta: "El sistema implementa múltiples capas de seguridad: autenticación con tokens JWT, contraseñas encriptadas con bcrypt, validación de datos en todos los inputs, y control de acceso basado en roles. Los datos se almacenan de forma segura y solo los usuarios autorizados pueden acceder a información sensible.",
  },
  {
    pregunta: "¿Puedo exportar los datos de movimientos?",
    respuesta: "Sí, el sistema permite exportar el historial de movimientos en formato CSV. Puedes filtrar por fechas, placa o estado del movimiento antes de exportar. Esto facilita la generación de reportes para contabilidad y análisis de operaciones.",
  },
  {
    pregunta: "¿Qué pasa si se equivocan al registrar un vehículo?",
    respuesta: "Los administradores pueden corregir errores en los registros de movimientos y vehículos. El sistema mantiene un historial de cambios para auditoría. Los empleados pueden solicitar correcciones a un administrador si cometen un error durante el registro.",
  },
  {
    pregunta: "¿El sistema funciona en dispositivos móviles?",
    respuesta: "Sí, GPA Parqueadero está diseñado con responsive design, lo que significa que se adapta automáticamente a cualquier tamaño de pantalla. Puedes acceder desde computadoras, tablets y celulares sin perder funcionalidad. La interfaz está optimizada para uso en dispositivos móviles.",
  },
];

const FAQItem = ({ faq, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
      >
        <span className="font-semibold text-white group-hover:text-gpa-blue transition-colors pr-4">
          {faq.pregunta}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-gpa-blue text-white' : 'bg-white/5 text-slate-400'
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <p className="text-slate-400 leading-relaxed">
                {faq.respuesta}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 lg:px-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] right-[-5%] w-[30%] h-[30%] rounded-full bg-gpa-cyan/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            <HelpCircle className="w-4 h-4" />
            Preguntas Frecuentes
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-6"
          >
            ¿Tienes dudas?{' '}
            <span className="bg-gradient-to-r from-gpa-blue to-gpa-cyan bg-clip-text text-transparent">
              Aquí te ayudamos
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-gpa-blue" />
              <span className="text-slate-300">¿No encontraste lo que buscabas?</span>
            </div>
            <a
              href="mailto:soporte@gpaparqueadero.com"
              className="px-6 py-2.5 bg-gpa-blue text-white font-bold rounded-xl hover:bg-gpa-blue/80 transition-colors"
            >
              Contáctanos
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
