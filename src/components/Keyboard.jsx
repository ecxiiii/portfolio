import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { techStack } from '../data/techStack';
import { KeyboardScene } from './KeyboardScene';
import './Keyboard.css';

gsap.registerPlugin(ScrollTrigger);

// NOTE: WebGPURenderer (three/webgpu) currently has shading issues with classic
// MeshStandardMaterial/MeshBasicMaterial in three r0.183 — meshes render black.
// Once Three finishes migrating to NodeMaterials across the board, this can be
// swapped back to a WebGPU-first factory. Until then, default WebGL2 ships.

export function Keyboard() {
  const sectionRef = useRef(null);
  const bgTextRef = useRef(null);
  const detailBarRef = useRef(null);

  const [active, setActive] = useState(techStack[0]);

  useLayoutEffect(() => {
    if (!bgTextRef.current || !sectionRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgTextRef.current,
        { yPercent: 20 },
        {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!detailBarRef.current) return;
    gsap.to(detailBarRef.current, {
      width: `${active.proficiency}%`,
      duration: 0.7,
      ease: 'power3.out',
    });
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="keyboard-section py-16 md:py-24 lg:py-32"
      style={{ backgroundColor: 'var(--gradient-skills)' }}
    >
      <div ref={bgTextRef} className="keyboard-bg-text" aria-hidden="true">
        STACK
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-10 md:mb-14 text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent-400 mb-3">
            // tech_stack
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
            Sixteen keys, one workflow.
          </h2>
          <p className="mt-4 text-sm md:text-base text-text-secondary max-w-[52ch] mx-auto leading-relaxed">
            Drag to orbit the board. Hover a cap to light it up.
          </p>
        </div>

        <div className="keyboard-canvas">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 4.8, 7.2], fov: 38 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <KeyboardScene
              activeName={active.name}
              onActivate={(tech) => setActive(tech)}
            />
          </Canvas>
        </div>

        <div className="keyboard-detail" aria-live="polite">
          <div className="keyboard-detail-head">
            <span className="keyboard-detail-name">{active.name}</span>
            <span
              className="keyboard-detail-chip"
              style={{ '--chip-color': active.accent }}
            >
              {active.category}
            </span>
          </div>
          <p className="keyboard-detail-desc">{active.description}</p>
          <div className="keyboard-detail-prof">
            <span>Proficiency</span>
            <span className="keyboard-detail-bar">
              <span
                ref={detailBarRef}
                className="keyboard-detail-bar-fill"
                style={{ width: `${active.proficiency}%` }}
              />
            </span>
            <span>{active.proficiency}%</span>
          </div>
          <p className="keyboard-detail-hint">
            // drag to orbit ⋅ cursor steers the spotlight ⋅ tap a cap to pin it
          </p>
        </div>
      </div>
    </section>
  );
}
