/**
 * Skeleton.jsx
 * Componente de carga tipo skeleton (shimmer) para reemplazar spinners
 */

export function SkeletonPulse({ className = '', style = {} }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.05)', ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 border-white/5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-8 w-20" />
          <SkeletonPulse className="h-3 w-32" />
        </div>
        <SkeletonPulse className="w-14 h-14 rounded-2xl shrink-0" />
      </div>
    </div>
  );
}

export function SkeletonStatCards({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonReservaCard() {
  return (
    <div className="glass-card border-white/8 rounded-3xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <SkeletonPulse className="h-4 w-40" />
          <SkeletonPulse className="h-3 w-56" />
        </div>
        <SkeletonPulse className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2">
            <SkeletonPulse className="h-2.5 w-16" />
            <SkeletonPulse className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <SkeletonPulse className="h-10 flex-1 rounded-xl" />
        <SkeletonPulse className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonVehicleRow() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-4">
        <SkeletonPulse className="w-11 h-11 rounded-xl" />
        <div className="space-y-2">
          <SkeletonPulse className="h-3.5 w-24" />
          <SkeletonPulse className="h-2.5 w-32" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <SkeletonPulse className="h-3 w-12 ml-auto" />
        <SkeletonPulse className="h-2.5 w-16 ml-auto" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-8 border-white/5 space-y-6" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="space-y-2">
        <SkeletonPulse className="h-5 w-40" />
        <SkeletonPulse className="h-3 w-56" />
      </div>
      <div className="flex items-end gap-3 h-48">
        {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
          <SkeletonPulse key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  const widths = ['w-full', 'w-4/5', 'w-3/5', 'w-full', 'w-2/3'];
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse key={i} className={`h-3 ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 'w-12 h-12' }) {
  return <SkeletonPulse className={`${size} rounded-full shrink-0`} />;
}

export function SkeletonTableRow({ cols = 5 }) {
  return (
    <div className="flex items-center gap-6 px-6 py-4 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.01)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonPulse key={i} className={`h-3.5 ${i === 0 ? 'w-32' : i === cols - 1 ? 'w-16 ml-auto' : 'w-20'} flex-shrink-0`} />
      ))}
    </div>
  );
}
