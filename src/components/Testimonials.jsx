import { testimonials } from '../data/testimonials';
import { SectionWrapper } from '../helpers/SectionWrapper';
import { AnimateOnScroll } from '../helpers/AnimateOnScroll';
import { LogoLoop } from './LogoLoop';
import { Quotes } from '@phosphor-icons/react';

function TestimonialCard({ testimonial }) {
  return (
    <div className="w-[320px] p-6 rounded-2xl border border-zinc-800 bg-bg-surface/50 flex flex-col gap-4">
      <Quotes size={24} weight="fill" className="text-accent-500/40" />

      <p className="text-sm text-text-secondary leading-relaxed flex-1">
        {testimonial.text}
      </p>

      <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/50">
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono text-text-caption">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm text-text-primary font-medium leading-tight">
            {testimonial.name}
          </p>
          <p className="text-xs text-text-caption leading-tight">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

const loopItems = testimonials.map((t) => ({
  node: <TestimonialCard testimonial={t} />,
  ariaLabel: `Testimonial from ${t.name}`,
}));

export function Testimonials() {
  return (
    <SectionWrapper id="testimonials" gradient="var(--gradient-projects)">
      <AnimateOnScroll direction="up">
        <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
          What people say
        </h2>
        <p className="text-text-caption text-base mb-12 max-w-[45ch]">
          From clients, colleagues, and the builders I work with.
        </p>
      </AnimateOnScroll>

      {/* Mobile — stacked */}
      <div className="md:hidden flex flex-col gap-4">
        {testimonials.map((t) => (
          <AnimateOnScroll key={t.name} direction="up">
            <TestimonialCard testimonial={t} />
          </AnimateOnScroll>
        ))}
      </div>

      {/* Desktop — LogoLoop */}
      <div
        className="hidden md:block"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <LogoLoop
          logos={loopItems}
          speed={25}
          direction="right"
          gap={20}
          pauseOnHover={true}
          fadeOut={false}
        />
      </div>
    </SectionWrapper>
  );
}
