/**
 * SistemaCalificacion.jsx
 * Componente interactivo de calificación por estrellas para parqueaderos
 */

import { useState } from 'react';
import { Star, MessageSquare, Shield, UserCheck, Accessibility } from 'lucide-react';
import toast from 'react-hot-toast';
import { calificacionesAPI } from '../services/api';

export default function SistemaCalificacion({ parqueaderoId, reservaId, onCalificado }) {
  const [general, setGeneral] = useState(5);
  const [seguridad, setSeguridad] = useState(5);
  const [atencion, setAtencion] = useState(5);
  const [acceso, setAcceso] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await calificacionesAPI.crear({
        parqueadero_id: parqueaderoId,
        reserva_id: reservaId,
        puntuacion_general: general,
        puntuacion_seguridad: seguridad,
        puntuacion_atencion: atencion,
        puntuacion_acceso: acceso,
        comentario: comentario.trim()
      });

      toast.success('¡Muchas gracias por tu calificación!');
      if (onCalificado) onCalificado();
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar la calificación');
    } finally {
      setEnviando(false);
    }
  };

  const StarSelector = ({ value, onChange, label, icon: Icon }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-gpa-blue" />}
            {label}
          </span>
          <span className="text-xs font-black text-gpa-cyan">{value} / 5</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 hover:scale-110 transition-transform cursor-pointer"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hover || value)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-700'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-black text-white uppercase italic tracking-tight">
          Califica tu <span className="text-gpa-blue">Experiencia</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">Tu opinión ayuda a mejorar la comunidad GPA</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StarSelector
          value={general}
          onChange={setGeneral}
          label="Puntuación General"
          icon={Star}
        />
        <StarSelector
          value={seguridad}
          onChange={setSeguridad}
          label="Seguridad"
          icon={Shield}
        />
        <StarSelector
          value={atencion}
          onChange={setAtencion}
          label="Atención al Cliente"
          icon={UserCheck}
        />
        <StarSelector
          value={acceso}
          onChange={setAcceso}
          label="Facilidad de Acceso"
          icon={Accessibility}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Comentarios opcionales
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Cuéntanos qué te gustó o qué podemos mejorar..."
          rows={3}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/8 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gpa-blue focus:ring-1 focus:ring-gpa-blue transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full py-3.5 bg-gradient-to-r from-gpa-blue to-gpa-purple hover:shadow-lg hover:shadow-gpa-blue/20 text-white font-bold rounded-2xl text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
      >
        {enviando ? 'Enviando...' : 'Enviar Calificación'}
      </button>
    </form>
  );
}
