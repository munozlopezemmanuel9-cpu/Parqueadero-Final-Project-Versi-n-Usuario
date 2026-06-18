import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Inicializar Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API no está soportada en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-CO'; // Español Colombia (ajustable)

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Escuchando...', { id: 'voice-status', icon: '🎤' });
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.toLowerCase();
          setTranscript(text);
          procesarComando(text);
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      if (event.error === 'not-allowed') {
        toast.error('Permiso de micrófono denegado', { id: 'voice-status' });
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Si se detiene por inactividad pero queremos seguir escuchando, podríamos reiniciarlo
      // Por ahora lo dejamos manual o lo reiniciamos si isListening es true en estado, 
      // pero para evitar bucles infinitos en errores, simplemente actualizamos estado.
      setIsListening(false);
      toast.dismiss('voice-status');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const procesarComando = (texto) => {
    console.log("Comando escuchado:", texto);

    // Detección de Preguntas Frecuentes / Ayuda
    if (texto.includes('pregunta') || texto.includes('ayuda') || texto.includes('información') || texto.includes('faq')) {
      toast.success('Abriendo preguntas frecuentes...', { icon: '🤖' });
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: { type: 'faq' } }));
      return;
    }

    // Detección de Registro de Placa
    // Ej: "ingresar placa abc 123" o "placa moto xyz 456"
    if (texto.includes('placa') || texto.includes('carro') || texto.includes('moto') || texto.includes('camioneta')) {
      // Extraer tipo
      let tipo = 'carro';
      if (texto.includes('moto')) tipo = 'moto';
      if (texto.includes('camioneta')) tipo = 'camioneta';

      // Extraer placa
      // Convertir números en texto a dígitos, y quitar toda la puntuación y espacios
      let textoLimpio = texto
        .replace(/uno/g, '1')
        .replace(/dos/g, '2')
        .replace(/tres/g, '3')
        .replace(/cuatro/g, '4')
        .replace(/cinco/g, '5')
        .replace(/seis/g, '6')
        .replace(/siete/g, '7')
        .replace(/ocho/g, '8')
        .replace(/nueve/g, '9')
        .replace(/cero/g, '0')
        .replace(/\ba\b/gi, 'a')
        .replace(/\bbe\b/gi, 'b')
        .replace(/\bce\b/gi, 'c')
        .replace(/[^a-z0-9]/gi, ''); // Quita TODO excepto letras y números (comas, puntos, espacios)

      // Ahora el texto es todo junto, ej: "ingresarmotoxyz123"
      // Buscar patrón de 3 letras + 2 o 3 números + letra opcional
      const match = textoLimpio.match(/[a-z]{3}[\d]{2,3}[a-z]?/i);
      
      if (match) {
        let placaEncontrada = match[0].toUpperCase();
        // Insertar guión
        if (placaEncontrada.length === 6) {
          placaEncontrada = placaEncontrada.slice(0, 3) + '-' + placaEncontrada.slice(3);
        } else if (placaEncontrada.length === 5) {
           placaEncontrada = placaEncontrada.slice(0, 3) + '-' + placaEncontrada.slice(3);
        }
        
        toast.success(`Placa detectada: ${placaEncontrada}`, { icon: '🤖' });
        window.dispatchEvent(new CustomEvent('voiceCommand', { 
          detail: { type: 'plate', data: placaEncontrada, vehicleType: tipo } 
        }));
        
        // Redirigir a vehículos si no está ahí
        if (location.pathname !== '/vehiculos') {
            navigate('/vehiculos');
        }
      } else {
        // Si no detectó patrón exacto pero escuchó placa
        const parts = textoLimpio.split('placa');
        if (parts.length > 1) {
            let possiblePlate = parts[1].replace(/[^a-z0-9]/gi, '').toUpperCase();
            if(possiblePlate.length >= 5) {
                if (possiblePlate.length === 6) {
                    possiblePlate = possiblePlate.slice(0, 3) + '-' + possiblePlate.slice(3);
                }
                toast.success(`Intentando con placa: ${possiblePlate}`, { icon: '🤖' });
                window.dispatchEvent(new CustomEvent('voiceCommand', { 
                    detail: { type: 'plate', data: possiblePlate, vehicleType: tipo } 
                }));
                
                // Redirigir a vehículos si no está ahí
                if (location.pathname !== '/vehiculos') {
                    navigate('/vehiculos');
                }
            }
        }
      }
    }
  };

  const toggleListen = () => {
    if (!recognitionRef.current) {
      toast.error('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end flex-col gap-3">
        {/* Helper popup if listening */}
        {isListening && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-gpa-blue/30 p-3 rounded-2xl shadow-[0_0_20px_rgba(var(--color-gpa-blue),0.2)] animate-fade-in text-sm text-slate-300 w-64 mb-2">
                <p className="font-bold text-white mb-1">Dí un comando:</p>
                <ul className="list-disc pl-4 space-y-1 text-xs opacity-80">
                    <li>"Placa ABC 123"</li>
                    <li>"Ingresar moto XYZ 987"</li>
                    <li>"Preguntas frecuentes"</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-white/10 italic text-gpa-cyan/80 text-xs">
                    {transcript ? `"${transcript}"` : "Escuchando..."}
                </div>
            </div>
        )}

      <button
        onClick={toggleListen}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isListening 
            ? 'bg-gpa-blue border-2 border-white text-white scale-110 shadow-[0_0_30px_rgba(var(--color-gpa-blue),0.6)]' 
            : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-gpa-blue/50 hover:bg-slate-800'
        }`}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-full animate-ping bg-gpa-blue opacity-40"></span>
        )}
        
        {isListening ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default VoiceAssistant;
