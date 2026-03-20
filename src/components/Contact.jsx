import { useState, useEffect } from 'react';
import { SectionWrapper } from '../helpers/SectionWrapper';
import { AnimateOnScroll } from '../helpers/AnimateOnScroll';
import { socials } from '../data/socials';
import { Check, SpinnerGap, LinkedinLogo, DiscordLogo, FacebookLogo, Briefcase } from '@phosphor-icons/react';

const iconMap = {
  linkedin: LinkedinLogo,
  discord: DiscordLogo,
  facebook: FacebookLogo,
  onlinejobs: Briefcase,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrors(formData) {
  const errors = {};
  if (formData.name.length < 2) errors.name = 'Name must be at least 2 characters';
  if (!EMAIL_REGEX.test(formData.email)) errors.email = 'Please enter a valid email';
  if (formData.message.length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', project: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [submitState, setSubmitState] = useState('idle');

  useEffect(() => {
    const draft = localStorage.getItem('contactDraft');
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch {
        // ignore invalid draft
      }
    }
  }, []);

  const errors = getErrors(formData);
  const isValid = Object.keys(errors).length === 0 && formData.name && formData.email && formData.message;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    localStorage.setItem('contactDraft', JSON.stringify(formData));

    try {
      setSubmitState('loading');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '47a84198-132b-4343-9eb7-359e59e676d9',
          name: formData.name,
          email: formData.email,
          subject: `Portfolio Contact: ${formData.name}`,
          project: formData.project || 'Not specified',
          message: formData.message,
          from_name: 'Portfolio Contact Form',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitState('success');
        localStorage.removeItem('contactDraft');
      } else {
        throw new Error(data.message || 'Submit failed');
      }
    } catch {
      setSubmitState('error');
    }
  };

  const inputClasses = (field) =>
    `w-full bg-bg-surface border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-caption outline-none transition-colors ${
      touched[field] && errors[field]
        ? 'border-red-400/50'
        : touched[field] && !errors[field]
        ? 'border-emerald-500/30'
        : 'border-zinc-800 focus:border-zinc-600'
    }`;

  if (submitState === 'success') {
    return (
      <SectionWrapper id="contact" gradient="var(--gradient-contact)">
        <AnimateOnScroll direction="up">
          <div className="max-w-[480px] mx-auto text-center py-12">
            <div className="mb-4"><Check size={48} weight="bold" className="text-accent-500 mx-auto" /></div>
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">
              Thanks!
            </h2>
            <p className="text-text-secondary">
              I'll respond within 24 hours.
            </p>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="contact" gradient="var(--gradient-contact)">
      <AnimateOnScroll direction="up">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-3 text-center">
          Let's Build Something Together
        </h2>
        <p className="text-text-secondary text-center mb-10 max-w-[480px] mx-auto">
          Have a project in mind? I'd love to hear about it. Reach out through any channel that works for you.
        </p>

        <div aria-live="polite">
          {submitState === 'error' && (
            <div className="max-w-[480px] mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-text-primary mb-2">
                Hmm, something went sideways. No worries — reach me directly:
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-400 text-sm hover:text-accent-300 transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="max-w-[480px] mx-auto flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="contact-name" className="sr-only">Your name</label>
            <div className="relative">
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={inputClasses('name')}
                aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
              />
              {touched.name && !errors.name && (
                <Check size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              )}
            </div>
            {touched.name && errors.name && (
              <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="sr-only">Your email</label>
            <div className="relative">
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={inputClasses('email')}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
              />
              {touched.email && !errors.email && (
                <Check size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              )}
            </div>
            {touched.email && errors.email && (
              <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-project" className="sr-only">Tell me about your project (optional)</label>
            <input
              id="contact-project"
              name="project"
              type="text"
              placeholder="Tell me about your project (optional)"
              value={formData.project}
              onChange={handleChange}
              className="w-full bg-bg-surface border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary placeholder:text-text-caption outline-none focus:border-accent-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="sr-only">Your message</label>
            <div className="relative">
              <textarea
                id="contact-message"
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                rows={5}
                className={`${inputClasses('message')} min-h-[120px] resize-y`}
                aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
              />
              {touched.message && !errors.message && (
                <Check size={16} weight="bold" className="absolute right-3 top-4 text-emerald-400" />
              )}
            </div>
            {touched.message && errors.message && (
              <p id="message-error" className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || submitState === 'loading'}
            aria-busy={submitState === 'loading'}
            className={`w-full py-3 rounded-xl font-semibold text-[0.95rem] transition-all ${
              isValid && submitState !== 'loading'
                ? 'bg-accent-500 text-bg-base hover:bg-accent-400 cursor-pointer'
                : 'bg-accent-500/50 text-bg-base/70 cursor-not-allowed'
            }`}
          >
            {submitState === 'loading' ? (
              <span className="inline-flex items-center gap-2">
                <SpinnerGap size={20} weight="bold" className="animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

      </AnimateOnScroll>
    </SectionWrapper>
  );
}
