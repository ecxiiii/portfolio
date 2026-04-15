import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { About } from './components/About';
import { Keyboard } from './components/Keyboard';
import { Projects } from './components/Projects';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Chatbot } from './components/Chatbot';
import { Footer } from './components/Footer';
import { HireBadge } from './components/HireBadge';
import { TargetCursor } from './components/TargetCursor';
import { SectionReveal } from './helpers/SectionReveal';

export function App() {
  return (
    <div className="overflow-x-clip">
      <TargetCursor
        targetSelector=".cursor-target"
        spinDuration={2.8}
        hoverDuration={0.45}
      />
      <Navbar />

      <main id="main-content" className="pt-16">
        <SectionReveal>
          <Hero />
        </SectionReveal>

        <Chatbot />

        <SectionReveal>
          <About />
        </SectionReveal>

        <Keyboard />

        <SectionReveal>
          <Projects />
        </SectionReveal>

        <SectionReveal>
          <Testimonials />
        </SectionReveal>

        <SectionReveal>
          <Contact />
        </SectionReveal>
      </main>

      <SectionReveal>
        <Footer />
      </SectionReveal>
      <HireBadge />
    </div>
  );
}
