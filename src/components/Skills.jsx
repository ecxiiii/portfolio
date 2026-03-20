import { skills } from '../data/skills';
import { SectionWrapper } from '../helpers/SectionWrapper';
import { AnimateOnScroll } from '../helpers/AnimateOnScroll';

export function Skills() {
  return (
    <SectionWrapper id="skills" gradient="var(--gradient-skills)">
      <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-12">
        Stack
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {skills.map((skill, index) => (
          <AnimateOnScroll key={skill.name} direction="up" delay={index * 0.08}>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-zinc-800 bg-bg-surface/50 transition-all hover:border-zinc-700 hover:bg-bg-surface">
              <div
                role="progressbar"
                aria-valuenow={skill.proficiency}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name} proficiency`}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(var(--color-accent-500) ${skill.proficiency}%, rgba(255,255,255,0.04) 0)`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-bg-base"
                >
                  <span className="font-mono text-xs text-text-secondary">
                    {skill.proficiency}%
                  </span>
                </div>
              </div>
              <span className="font-mono text-sm text-text-primary text-center">
                {skill.name}
              </span>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </SectionWrapper>
  );
}
