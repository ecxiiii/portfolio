import { useState, useEffect, useRef } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { EcxiiLogo } from './EcxiiLogo';

const SECTION_IDS = ['hero', 'chatbot', 'about', 'skills', 'projects', 'contact'];

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'chatbot', label: 'Chat' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const activeSection = useScrollSpy(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }
      if (e.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll('a, button');
        if (!focusableElements?.length) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    menuRef.current?.querySelector('a, button')?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-500 focus:text-bg-base focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      <nav
        role="navigation"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled
            ? 'top-4'
            : 'top-6'
        }`}
      >
        {/* Floating glass pill */}
        <div className="flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl bg-white/[0.06] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="cursor-target cursor-pointer bg-transparent border-none px-3"
          >
            <EcxiiLogo size="sm" />
          </button>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-white/10" />

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link.id)}
                  aria-current={activeSection === link.id ? 'page' : undefined}
                  className={`text-sm px-3 py-1.5 rounded-full bg-transparent border-none cursor-pointer transition-all ${
                    activeSection === link.id
                      ? 'text-text-primary bg-white/[0.08]'
                      : 'text-text-caption hover:text-text-secondary hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-white/10" />

          {/* Desktop resume button */}
          <a
            href="https://pdflink.to/cc692495/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex px-4 py-1.5 rounded-full bg-white/[0.08] text-text-secondary text-sm font-medium hover:bg-white/[0.12] hover:text-text-primary transition-all"
          >
            Resume
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden flex flex-col gap-1.5 p-2.5 bg-transparent border-none cursor-pointer"
          >
            <span aria-hidden="true" className={`block w-5 h-0.5 bg-text-primary transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span aria-hidden="true" className={`block w-5 h-0.5 bg-text-primary transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span aria-hidden="true" className={`block w-5 h-0.5 bg-text-primary transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile slide-out panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 w-72 bg-zinc-950/95 backdrop-blur-xl border-l border-white/[0.06] z-50 md:hidden transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-8 pt-20 gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              aria-current={activeSection === link.id ? 'page' : undefined}
              className={`text-left py-3 px-4 rounded-xl text-base font-medium bg-transparent border-none cursor-pointer transition-colors ${
                activeSection === link.id
                  ? 'text-text-primary bg-white/[0.06]'
                  : 'text-text-caption hover:text-text-secondary hover:bg-white/[0.03]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://pdflink.to/cc692495/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 py-3 px-4 rounded-xl bg-accent-500 text-bg-base text-base font-semibold text-center hover:bg-accent-400 transition-colors"
          >
            Resume
          </a>
        </div>
      </div>
    </>
  );
}
