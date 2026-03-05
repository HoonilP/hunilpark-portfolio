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
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6 bg-slate-50 dark:bg-slate-900/50">
        {/* Role */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t('sidebar.role')}
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t(`${translationKey}.role`)}
          </p>
        </div>

        {/* Team Size */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t('sidebar.teamSize')}
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t(`${translationKey}.teamSize`)}
          </p>
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t('sidebar.duration')}
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t(`${translationKey}.duration`)}
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
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
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {t('sidebar.links')}
            </h3>
            <div className="space-y-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
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
                  className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
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
