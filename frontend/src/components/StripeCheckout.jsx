import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { pagosAPI } from '../services/api';
import toast from 'react-hot-toast';

// Usar una clave pública de prueba si no existe en env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ monto, onConfirm, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Simular inicialización rápida para no depender del backend
    if (monto > 0) {
      setClientSecret('pi_mock_secret');
    }
  }, [monto]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setProcesando(true);
    setError(null);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      setProcesando(false);
      toast.success('Pago procesado correctamente (Simulación)');
      onConfirm('pi_mock_123456789');
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Datos de la tarjeta</label>
        <div className="p-3 bg-[#0a0a0d] rounded-lg border border-white/5">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#ef4444' },
            },
          }} />
        </div>
        {error && <div className="text-red-400 text-xs mt-2 font-medium">{error}</div>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={procesando}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!stripe || procesando || !clientSecret}
          className="flex-1 px-4 py-3 rounded-xl bg-gpa-blue text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
        >
          {procesando ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            `Pagar $${monto.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
};

export default function StripeCheckoutWrapper({ monto, onConfirm, onCancel }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm monto={monto} onConfirm={onConfirm} onCancel={onCancel} />
    </Elements>
  );
}
