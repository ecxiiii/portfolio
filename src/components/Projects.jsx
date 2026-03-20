import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { SectionWrapper } from '../helpers/SectionWrapper';
import { AnimateOnScroll } from '../helpers/AnimateOnScroll';
import { LogoLoop } from './LogoLoop';

const loopItems = projects.map((project) => ({
  node: (
    <div className="w-[340px]">
      <ProjectCard project={project} />
    </div>
  ),
  ariaLabel: project.name,
}));

export function Projects() {
  return (
    <SectionWrapper id="projects" gradient="var(--gradient-projects)">
      <AnimateOnScroll direction="up">
        <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-12">
          Featured Projects
        </h2>
      </AnimateOnScroll>

      {/* Mobile — stacked cards */}
      <div className="md:hidden flex flex-col gap-6">
        {projects.map((project) => (
          <AnimateOnScroll key={project.id} direction="up">
            <ProjectCard project={project} />
          </AnimateOnScroll>
        ))}
      </div>

      {/* Desktop — LogoLoop marquee */}
      <div
        className="hidden md:block"
        role="region"
        aria-label="Featured projects"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <LogoLoop
          logos={loopItems}
          speed={35}
          direction="left"
          gap={24}
          pauseOnHover={true}
          fadeOut={false}
        />
      </div>
    </SectionWrapper>
  );
}
