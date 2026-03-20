import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { personal } from '../data/personal';
import { ArrowRight, DownloadSimple } from '@phosphor-icons/react';
import { Orb } from './Orb';

const spring = { type: 'spring', stiffness: 100, damping: 20 };

function Wrap({ anim, children, ...motionProps }) {
  if (!anim) return <div>{children}</div>;
  return <motion.div {...motionProps}>{children}</motion.div>;
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const anim = !prefersReducedMotion;

  const handleViewProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--gradient-hero)' }}
    >
      {/* Orb — full background, centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] md:w-[900px] md:h-[900px] opacity-25">
          <Orb
            hue={0}
            hoverIntensity={0}
            rotateOnHover={false}
            backgroundColor="#09090b"
          />
        </div>
      </div>

      {/* Content — on top of orb */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 w-full py-20 md:py-0 text-center">
        {personal.availability && (
          <Wrap anim={anim} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 text-accent-400 text-xs font-mono tracking-wide mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[statusPulse_2s_ease-in-out_infinite]" aria-hidden="true" />
              Available for work
            </div>
          </Wrap>
        )}

        <Wrap anim={anim} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }}>
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter leading-none text-text-primary mb-4">
            {personal.name}
          </h1>
          <p className="text-xl md:text-2xl text-text-caption font-medium tracking-tight mb-8">
            {personal.tagline}
          </p>
        </Wrap>

        <Wrap anim={anim} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.5 }}>
          <p className="text-base text-text-secondary leading-relaxed max-w-[55ch] mx-auto mb-10">
            {personal.subtitle}
          </p>
        </Wrap>

        <Wrap anim={anim} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.7 }}>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleViewProjects}
              className="cursor-target group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-bg-base font-semibold text-sm cursor-pointer transition-all hover:bg-accent-400 active:scale-[0.98]"
            >
              View Projects
              <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href={personal.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-text-primary font-medium text-sm transition-all hover:border-zinc-500 hover:bg-white/[0.03] active:scale-[0.98]"
            >
              <DownloadSimple size={16} weight="bold" />
              Resume
            </a>
          </div>
        </Wrap>
      </div>
    </section>
  );
}
