import { getTranslations } from 'next-intl/server';
import { Github, ExternalLink, Calendar, Users, Briefcase } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface ProjectSidebarProps {
  meta: {
    translationKey: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
  };
}

export default async function ProjectSidebar({ meta }: ProjectSidebarProps) {
  const t = await getTranslations('ProjectDetail');
  const { translationKey, techStack, githubUrl, liveUrl } = meta;

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit space-y-6">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6 bg-white dark:bg-neutral-950">
        {/* Role */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t('sidebar.role')}
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t(`${translationKey}.role`)}
          </p>
        </div>

        {/* Team Size */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t('sidebar.teamSize')}
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t(`${translationKey}.teamSize`)}
          </p>
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t('sidebar.duration')}
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t(`${translationKey}.duration`)}
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            {t('sidebar.techStack')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>

        {/* Links */}
        {(githubUrl || liveUrl) && (
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              {t('sidebar.links')}
            </h3>
            <div className="space-y-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
