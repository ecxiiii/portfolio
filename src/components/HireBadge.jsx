import { personal } from '../data/personal';

export function HireBadge() {
  if (!personal.availability) return null;

  return (
    <div
      aria-label="Currently open to work opportunities"
      className="fixed bottom-6 right-6 z-40 hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-950/80 backdrop-blur-sm transition-all hover:border-zinc-600"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[statusPulse_2s_ease-in-out_infinite]" aria-hidden="true" />
      <span className="text-text-secondary text-xs font-mono">Available</span>
    </div>
  );
}
