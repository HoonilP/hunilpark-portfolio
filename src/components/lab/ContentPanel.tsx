'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Image from 'next/image';
import {Mail, Phone, Github, ExternalLink} from 'lucide-react';

interface ContentPanelProps {
  activeSection: string | null;
}

const PROJECTS = [
  {id: '6', key: 'artWar', tech: ['Next.js', 'NestJS', 'Solidity', 'OpenClaw', 'Monad', 'Supabase'], color: '#8b5cf6', github: 'https://github.com/Moltiverse-MonArt'},
  {id: '2', key: 'dyCms', tech: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'], color: '#3b82f6'},
  {id: '1', key: 'joshua', tech: ['Electron', 'Angular', 'FastAPI', 'PostgreSQL', 'KoGPT-2', 'Stripe'], color: '#10b981'},
  {id: '3', key: 'retailAnalysis', tech: ['Pytorch', 'YOLO', 'VanillaJS'], color: '#f59e0b'},
  {id: '4', key: 'scholarlyChain', tech: ['Next.js', 'React', 'TypeScript', 'shadcn/ui', 'Firebase'], color: '#ec4899', github: 'https://github.com/Capstone-scholarly-chain'},
  {id: '5', key: 'dinoGo', tech: ['Next.js', 'Three.js', 'Move', 'Sui SDK'], color: '#06b6d4', github: 'https://github.com/Dino-Go', live: 'https://dinogo.vercel.app'},
];

const SKILLS = [
  {category: 'Frontend', items: ['TypeScript', 'React', 'Next.js', 'Angular', 'VanillaJS'], color: '#3b82f6'},
  {category: 'Backend', items: ['NestJS', 'FastAPI', 'Python'], color: '#10b981'},
  {category: 'DevOps', items: ['AWS', 'Docker', 'Kubernetes'], color: '#f59e0b'},
  {category: 'Database', items: ['MySQL', 'PostgreSQL'], color: '#8b5cf6'},
];

export default function ContentPanel({activeSection}: ContentPanelProps) {
  const t = useTranslations();

  if (!activeSection) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[80] w-full max-w-md pointer-events-none">
      <div className="h-full flex items-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto relative w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 p-6 animate-slide-in scrollbar-thin"
          style={{overscrollBehavior: 'contain'}}
        >
          {activeSection === 'about' && <AboutContent t={t} />}
          {activeSection === 'projects' && <ProjectsContent t={t} />}
          {activeSection === 'skills' && <SkillsContent t={t} />}
          {activeSection === 'contact' && <ContactContent t={t} />}
        </div>
      </div>
    </div>
  );
}

/* ─── About (Door) ─── */
function AboutContent({t}: {t: any}) {
  return (
    <div className="space-y-5">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
          <Image src="/profile.webp" alt="Profile" width={64} height={64} className="object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{t('Hero.name')}</h2>
          <p className="text-sm text-white/50">{t('Hero.title')}</p>
        </div>
      </div>

      <p className="text-xs text-white/80 leading-relaxed italic border-l-2 border-white/20 pl-3">
        {t('Hero.intro')}
      </p>

      <div className="h-px bg-white/10" />

      {/* About */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">{t('About.sectionTitle')}</p>
        <p className="text-xs text-white/70 leading-relaxed mb-3">{t('About.paragraph1')}</p>
        <p className="text-xs text-white/70 leading-relaxed">{t('About.paragraph2')}</p>
      </div>

      <div className="h-px bg-white/10" />

      {/* Education */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">{t('Education.sectionTitle')}</p>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-[10px] text-white/30">{t('Education.sangmyung.date')}</p>
            <p className="text-xs font-semibold text-white mt-0.5">{t('Education.sangmyung.title')}</p>
            <p className="text-[10px] text-white/50 mt-0.5">{t('Education.sangmyung.description')}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-[10px] text-white/30">{t('Education.yangon.date')}</p>
            <p className="text-xs font-semibold text-white mt-0.5">{t('Education.yangon.title')}</p>
            <p className="text-[10px] text-white/50 mt-0.5">{t('Education.yangon.description')}</p>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('Education.certificationsTitle')}</p>
        <div className="flex flex-wrap gap-1.5">
          {(['computerSkills', 'accounting', 'fsi', 'toeic'] as const).map((key) => (
            <span key={key} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
              {t(`Education.certifications.${key}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Projects (Computer) ─── */
function ProjectsContent({t}: {t: any}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">{t('Projects.sectionTitle')}</p>
        <p className="text-xs text-white/40">6 projects</p>
      </div>

      <div className="space-y-3">
        {PROJECTS.map((p, i) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="block group"
          >
            <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
              {/* Thumbnail */}
              <div className="relative w-full h-28 rounded-lg overflow-hidden mb-3">
                <Image
                  src={`/projects/${p.id}/thumbnail.webp`}
                  alt={t(`Projects.${p.key}.title`)}
                  fill
                  sizes="350px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/50 font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-sm font-semibold text-white mb-0.5">{t(`Projects.${p.key}.title`)}</h3>
              <p className="text-[10px] text-white/40 mb-2">{t(`Projects.${p.key}.period`)}</p>
              <p className="text-xs text-white/60 leading-relaxed mb-2 line-clamp-2">{t(`Projects.${p.key}.description`)}</p>

              {/* Tech */}
              <div className="flex flex-wrap gap-1">
                {p.tech.slice(0, 4).map((tech) => (
                  <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">{tech}</span>
                ))}
                {p.tech.length > 4 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/30">+{p.tech.length - 4}</span>
                )}
              </div>

              {/* Links */}
              {(p.github || p.live) && (
                <div className="flex gap-2 mt-2">
                  {p.github && (
                    <span className="text-[10px] text-white/30 flex items-center gap-1">
                      <Github className="w-3 h-3" /> GitHub
                    </span>
                  )}
                  {p.live && (
                    <span className="text-[10px] text-white/30 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Live
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Skills & Experience (Bed) ─── */
function SkillsContent({t}: {t: any}) {
  return (
    <div className="space-y-5">
      {/* Skills */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">{t('Skills.sectionTitle')}</p>
        <div className="space-y-4">
          {SKILLS.map((cat, i) => (
            <div key={cat.category}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: cat.color}} />
                <h3 className="text-xs font-semibold text-white/80">{t(`Skills.${cat.category.toLowerCase()}`)}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full border text-white/70"
                    style={{borderColor: cat.color + '40', backgroundColor: cat.color + '10'}}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Experience */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">{t('Experience.sectionTitle')}</p>
        <div className="space-y-3">
          <div className="relative pl-4 border-l border-white/10">
            <div className="absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
            <p className="text-[10px] text-white/30 mb-0.5">{t('Experience.paymentInApp.date')}</p>
            <p className="text-xs font-semibold text-white">{t('Experience.paymentInApp.title')}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{t('Experience.paymentInApp.company')}</p>
            <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{t('Experience.paymentInApp.description')}</p>
          </div>
          <div className="relative pl-4 border-l border-white/10">
            <div className="absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full bg-green-400" />
            <p className="text-[10px] text-white/30 mb-0.5">{t('Experience.dyAccounting.date')}</p>
            <p className="text-xs font-semibold text-white">{t('Experience.dyAccounting.title')}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{t('Experience.dyAccounting.company')}</p>
            <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{t('Experience.dyAccounting.description')}</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Activities */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('Education.activitiesTitle')}</p>
        <div className="space-y-1">
          {(['bay', 'aiCourse'] as const).map((key) => (
            <p key={key} className="text-[10px] text-white/50">
              {t(`Education.activities.${key}`)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Contact (Cat) ─── */
function ContactContent({t}: {t: any}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">{t('Contact.sectionTitle')}</p>
        <h2 className="text-lg font-bold text-white">Get in touch</h2>
      </div>

      <div className="space-y-2">
        <a
          href="mailto:phoonil0927@gmail.com"
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Mail className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-[10px] text-white/30">{t('Contact.email')}</p>
            <p className="text-sm text-white/80">phoonil0927@gmail.com</p>
          </div>
        </a>

        <a
          href="tel:010-5557-6835"
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Phone className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-[10px] text-white/30">{t('Contact.phone')}</p>
            <p className="text-sm text-white/80">010-5557-6835</p>
          </div>
        </a>

        <a
          href="https://github.com/HoonilP"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Github className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-[10px] text-white/30">{t('Contact.github')}</p>
            <p className="text-sm text-white/80">github.com/HoonilP</p>
          </div>
        </a>

        <a
          href="https://velog.io/@hoonilpark"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ExternalLink className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-[10px] text-white/30">{t('Contact.velog')}</p>
            <p className="text-sm text-white/80">velog.io/@hoonilpark</p>
          </div>
        </a>
      </div>
    </div>
  );
}
