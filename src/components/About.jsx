import { personal } from '../data/personal';
import { SectionWrapper } from '../helpers/SectionWrapper';
import { AnimateOnScroll } from '../helpers/AnimateOnScroll';

export function About() {
  return (
    <SectionWrapper id="about" gradient="var(--gradient-about)">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-20 items-start">
        {/* Bio — left */}
        <AnimateOnScroll direction="left">
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-8">
            About
          </h2>

          {personal.bio.map((paragraph, index) => (
            <p key={index} className="text-text-secondary mb-4 leading-relaxed max-w-[65ch]">
              {paragraph}
            </p>
          ))}

          {/* Currently working on */}
          {personal.currentWork && (
            <div className="mt-8 border-t border-zinc-800 pt-8">
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 tracking-tight">
                Right now
              </h3>
              <ul className="space-y-2">
                {personal.currentWork.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            {personal.workingStyle.map((style) => (
              <span
                key={style}
                className="inline-flex px-3 py-1 rounded-full border border-zinc-700 text-text-secondary text-sm"
              >
                {style}
              </span>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Photo — right */}
        <AnimateOnScroll direction="right" delay={0.2}>
          <picture>
            <source srcSet={personal.photoPath} type="image/webp" />
            <img
              src={personal.photoFallback}
              alt={personal.photoAlt}
              className="rounded-[2rem] w-full max-w-[360px] mx-auto border border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
              width="360"
              height="360"
              loading="lazy"
            />
          </picture>
        </AnimateOnScroll>
      </div>
    </SectionWrapper>
  );
}
