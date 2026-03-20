import { useState, useEffect } from 'react';
import { Tilt } from 'react-tilt';
import { useReducedMotion } from '../hooks/useReducedMotion';

const tiltOptions = {
  max: 10,
  scale: 1,
  speed: 300,
};

export function ProjectCard({ project }) {
  const [canHover, setCanHover] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  const enableTilt = canHover && !prefersReducedMotion;

  const cardContent = (
    <div
      role="article"
      className="cursor-target bg-bg-surface border border-zinc-800 rounded-2xl p-6 h-full transition-all duration-200 hover:border-zinc-700 hover:-translate-y-[2px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)]"
    >
      <p className="text-lg font-semibold text-text-primary leading-snug mb-2">
        {project.problem}
      </p>

      <p className="font-mono text-sm text-accent-400 mb-3">
        {project.name}
      </p>

      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 font-mono text-xs text-text-secondary"
          >
            {tech}
          </span>
        ))}
      </div>

      {!project.featured && (
        <div className="flex gap-3">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View live demo for ${project.name}`}
            className="text-sm text-accent-400 font-medium hover:text-accent-300 transition-colors"
          >
            Live Demo →
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View GitHub repository for ${project.name}`}
            className="text-sm text-accent-400 font-medium hover:text-accent-300 transition-colors"
          >
            GitHub →
          </a>
        </div>
      )}
    </div>
  );

  if (enableTilt) {
    return <Tilt options={tiltOptions}>{cardContent}</Tilt>;
  }

  return cardContent;
}
