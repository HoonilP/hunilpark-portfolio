'use client';

import {useTranslations} from 'next-intl';

interface ContentPanelProps {
  activeSection: string | null;
  onClose: () => void;
}

const PROJECTS = [
  {id: '6', title: 'Ministry of Truth', tech: ['Next.js', 'NestJS', 'Solidity', 'Monad']},
  {id: '2', title: 'DY CMS', tech: ['Next.js', 'NestJS', 'PostgreSQL']},
  {id: '1', title: 'Joshua', tech: ['Electron', 'Angular', 'FastAPI', 'KoGPT-2']},
  {id: '3', title: 'Retail Analysis', tech: ['Pytorch', 'YOLO', 'VanillaJS']},
  {id: '4', title: 'Scholarly Chain', tech: ['Next.js', 'React', 'Firebase']},
  {id: '5', title: 'Dino Go', tech: ['Next.js', 'Three.js', 'Move', 'Sui']},
];

const SKILLS = [
  {category: 'Frontend', items: ['TypeScript', 'React', 'Next.js', 'Angular', 'VanillaJS']},
  {category: 'Backend', items: ['NestJS', 'FastAPI', 'Python']},
  {category: 'DevOps', items: ['AWS', 'Docker', 'Kubernetes']},
  {category: 'Database', items: ['MySQL', 'PostgreSQL']},
];

export default function ContentPanel({activeSection, onClose}: ContentPanelProps) {
  const t = useTranslations();

  if (!activeSection) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[80] w-full max-w-md pointer-events-none">
      <div className="h-full flex items-center p-6 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 p-6 animate-slide-in"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            &times;
          </button>

          {activeSection === 'about' && <AboutContent t={t} />}
          {activeSection === 'projects' && <ProjectsContent t={t} />}
          {activeSection === 'skills' && <SkillsContent t={t} />}
          {activeSection === 'contact' && <ContactContent t={t} />}
        </div>
      </div>
    </div>
  );
}

function AboutContent({t}: {t: any}) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">About</p>
      <h2 className="text-2xl font-bold text-white">{t('Hero.name')}</h2>
      <p className="text-sm text-white/60">{t('Hero.title')}</p>
      <div className="h-px bg-white/10 my-4" />
      <p className="text-sm text-white/70 leading-relaxed">{t('About.paragraph1')}</p>
      <p className="text-sm text-white/70 leading-relaxed">{t('About.paragraph2')}</p>
    </div>
  );
}

function ProjectsContent({t}: {t: any}) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Projects</p>
      <h2 className="text-xl font-bold text-white">{t('Projects.sectionTitle')}</h2>
      <div className="space-y-3">
        {PROJECTS.map((p) => (
          <div key={p.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-white/30">{String(PROJECTS.indexOf(p) + 1).padStart(2, '0')}</span>
              <h3 className="text-sm font-semibold text-white">{p.title}</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {p.tech.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsContent({t}: {t: any}) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Skills & Experience</p>
      <h2 className="text-xl font-bold text-white">{t('Skills.sectionTitle')}</h2>
      <div className="space-y-4">
        {SKILLS.map((cat) => (
          <div key={cat.category}>
            <h3 className="text-sm font-semibold text-white/80 mb-2">{cat.category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="h-px bg-white/10 my-4" />
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Experience</p>
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-white/40">2022.05 - 2024.03</p>
          <p className="text-sm font-semibold text-white">{t('Experience.paymentInApp.title')}</p>
          <p className="text-xs text-white/50">{t('Experience.paymentInApp.company')}</p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-white/40">2024.07 - 2025.06</p>
          <p className="text-sm font-semibold text-white">{t('Experience.dyAccounting.title')}</p>
          <p className="text-xs text-white/50">{t('Experience.dyAccounting.company')}</p>
        </div>
      </div>
    </div>
  );
}

function ContactContent({t}: {t: any}) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Contact</p>
      <h2 className="text-xl font-bold text-white">{t('Contact.sectionTitle')}</h2>
      <div className="space-y-3 mt-4">
        <a href="mailto:phoonil0927@gmail.com" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <span className="text-lg">@</span>
          <span className="text-sm text-white/80">phoonil0927@gmail.com</span>
        </a>
        <a href="tel:010-5557-6835" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <span className="text-lg">T</span>
          <span className="text-sm text-white/80">010-5557-6835</span>
        </a>
        <a href="https://github.com/HoonilP" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <span className="text-lg">G</span>
          <span className="text-sm text-white/80">github.com/HoonilP</span>
        </a>
        <a href="https://velog.io/@hoonilpark" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <span className="text-lg">V</span>
          <span className="text-sm text-white/80">velog.io/@hoonilpark</span>
        </a>
      </div>
    </div>
  );
}
