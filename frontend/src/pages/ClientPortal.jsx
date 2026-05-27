import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { movimientosAPI } from '../services/api';
import {
  Car,
  Clock,
  Calendar,
  Receipt,
  ShieldCheck,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

const ClientPortal = () => {
  const { usuario } = useAuth();
  const [myVehicles, setMyVehicles] = useState([]);
  const [myHistory, setMyHistory] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fetchData = async () => {
    setCargando(true);
    try {
      const [vehiclesRes, historyRes] = await Promise.all([
        movimientosAPI.getMyVehicles(), // We need to implement this in API service
        movimientosAPI.getMyHistory(),   // We need to implement this in API service
      ]);
      setMyVehicles(vehiclesRes.data.data.vehiculos);
      setMyHistory(historyRes.data.data.historial);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gpa-blue/20 rounded-3xl flex items-center justify-center border border-gpa-blue/30">
            <User className="w-8 h-8 text-gpa-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              MI <span className="text-gpa-blue">PORTAL</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-widest">Bienvenido, {usuario?.nombre}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right mr-4">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado de Cuenta</p>
             <p className="text-xs font-bold text-emerald-400 uppercase">Al día</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl glass-card border-white/10 text-white text-xs font-black uppercase transition-all hover:bg-white/10 active:scale-95">
            Configuración
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* My Vehicles - Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <Car className="w-5 h-5 text-gpa-blue" />
            Mis Vehículos
          </h2>

          {cargando ? (
            <div className="h-64 flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/5">
              <div className="w-8 h-8 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin" />
            </div>
          ) : myVehicles.length > 0 ? (
            <div className="space-y-4">
              {myVehicles.map((veh) => (
                <div key={veh.id} className="glass-card p-5 border-white/5 rounded-3xl group hover:border-gpa-blue/30 transition-all duration-300 cursor-pointer bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Car className="w-5 h-5 text-slate-400 group-hover:text-gpa-blue" />
                      </div>
                      <div>
                        <p className="font-black text-white uppercase tracking-tight">{veh.placa}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{veh.marca} {veh.modelo}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card border-white/5 rounded-3xl bg-white/[0.02]">
              <p className="text-slate-500 text-sm font-medium">No tienes vehículos registrados.</p>
            </div>
          )}
        </div>

        {/* My History - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gpa-blue" />
            Historial de Estacionamiento
          </h2>

          {cargando ? (
            <div className="h-96 flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/5">
              <div className="w-8 h-8 border-4 border-white/10 border-t-gpa-blue rounded-full animate-spin" />
            </div>
          ) : myHistory.length > 0 ? (
            <div className="overflow-hidden rounded-3xl glass-card border-white/5 bg-white/[0.02]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10">
                    <th className="px-6 py-4">Vehículo</th>
                    <th className="px-6 py-4">Entrada</th>
                    <th className="px-6 py-4">Salida</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {myHistory.map((mov) => (
                    <tr key={mov.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <Car className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="text-sm font-black text-white uppercase">{mov.placa}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {new Date(mov.fecha_entrada).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {mov.fecha_salida ? new Date(mov.fecha_salida).toLocaleDateString() : 'En curso'}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-gpa-cyan">
                        ${mov.total_pagar?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-white">
                          <Receipt className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 glass-card border-white/5 rounded-3xl bg-white/[0.02]">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-white font-bold uppercase italic">Sin registros</h4>
              <p className="text-slate-500 text-sm mt-2">Aún no tienes movimientos registrados en el sistema.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
