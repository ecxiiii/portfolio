import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    const visibleSections = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Return the first visible section in DOM order (closest to top)
        const active = sectionIds.find((id) => visibleSections.has(id));
        if (active) {
          setActiveSection(active);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-64px 0px 0px 0px',
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
