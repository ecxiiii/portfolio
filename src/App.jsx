import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { About } from './components/About';
import { Skills } from './components/Skills';
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

        <SectionReveal>
          <About />
        </SectionReveal>

        <SectionReveal>
          <Skills />
        </SectionReveal>

        <SectionReveal>
          <Projects />
        </SectionReveal>

        <SectionReveal>
          <Testimonials />
        </SectionReveal>

        <SectionReveal>
          <Contact />
        </SectionReveal>

        <SectionReveal>
          <Chatbot />
        </SectionReveal>
      </main>

      <SectionReveal>
        <Footer />
      </SectionReveal>
      <HireBadge />
    </div>
  );
}
