import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/ScrollReveal';

interface Project {
  id: string;
  translationKey: string;
  techStack: string[];
}

export default async function ProjectsSection() {
  const t = await getTranslations('Projects');

  const projects: Project[] = [
    {
      id: '2',
      translationKey: 'dyCms',
      techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
    },
    {
      id: '1',
      translationKey: 'joshua',
      techStack: ['Electron', 'Angular', 'FastAPI', 'PostgreSQL', 'KoGPT-2', 'Stripe'],
    },
    {
      id: '3',
      translationKey: 'retailAnalysis',
      techStack: ['Pytorch', 'YOLO', 'VanillaJS'],
    },
    {
      id: '4',
      translationKey: 'scholarlyChain',
      techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Firebase'],
    },
    {
      id: '5',
      translationKey: 'dinoGo',
      techStack: ['Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Move', 'Sui SDK'],
    },
  ];

  const numCards = projects.length;

  return (
    <section id="projects" className="py-24 lg:py-32">
      {/* Section Header */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <ScrollReveal line>
          <div className="section-divider mb-12 text-neutral-900 dark:text-neutral-100" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="label-museum text-neutral-500 dark:text-neutral-400 mb-4">
            Collections
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <h2 className="heading-section text-neutral-900 dark:text-neutral-100">
            {t('sectionTitle')}
          </h2>
        </ScrollReveal>
      </div>

      {/* Project Sticky Stack */}
      <div
        className="stack-cards"
        style={{ '--numcards': numCards } as React.CSSProperties}
      >
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={project.id}
              className="stack-card"
              style={{
                top: `calc(5rem + ${index * 0.5}rem)`,
                zIndex: index + 1,
              }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="group block"
              >
                <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden flex items-center rounded-t-2xl shadow-2xl border border-neutral-200/30 dark:border-neutral-700/30">
                  {/* Background Image */}
                  <Image
                    src={`/projects/${project.id}/hero.webp`}
                    alt={t(`${project.translationKey}.title`)}
                    fill
                    sizes="100vw"
                    quality={60}
                    loading="lazy"
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/45 transition-colors duration-300" />

                  {/* Card */}
                  <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
                    <div
                      className={`max-w-md ${
                        isEven ? 'mr-auto' : 'ml-auto'
                      }`}
                    >
                      <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-xl p-8 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                        <span className="label-museum text-neutral-400 dark:text-neutral-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-2xl font-bold mt-2 mb-2 text-neutral-900 dark:text-neutral-100">
                          {t(`${project.translationKey}.title`)}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                          {t(`${project.translationKey}.period`)}
                        </p>
                        <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-5">
                          {t(`${project.translationKey}.description`)}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.techStack.map((tech) => (
                            <Badge key={tech}>{tech}</Badge>
                          ))}
                        </div>
                        <span className="label-museum text-primary-500 dark:text-primary-400 group-hover:tracking-[0.15em] transition-all">
                          {t('viewDetails')} →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
