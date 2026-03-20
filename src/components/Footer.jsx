import { socials } from '../data/socials';
import { LinkedinLogo, DiscordLogo, FacebookLogo, Briefcase } from '@phosphor-icons/react';

const iconMap = {
  linkedin: LinkedinLogo,
  discord: DiscordLogo,
  facebook: FacebookLogo,
  onlinejobs: Briefcase,
};

export function Footer() {
  return (
    <footer role="contentinfo" className="py-16 md:py-24 px-6 md:px-10 text-center border-t border-zinc-800/50">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {socials.map((social) => {
            const Icon = iconMap[social.icon];
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${social.name}`}
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-text-caption transition-all hover:border-zinc-600 hover:text-text-secondary hover:bg-white/[0.02]"
              >
                {Icon ? <Icon size={18} weight="regular" /> : social.name.slice(0, 2)}
              </a>
            );
          })}
        </div>

        <p className="text-text-caption text-xs font-mono tracking-wide">
          {new Date().getFullYear()} Rovic James
        </p>
      </div>
    </footer>
  );
}
