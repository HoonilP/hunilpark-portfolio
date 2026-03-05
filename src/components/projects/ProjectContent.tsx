import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import ChallengeSection from './ChallengeSection';

interface ProjectContentProps {
  translationKey: string;
  projectId: string;
}

const CHALLENGE_KEYS = ['challenge1', 'challenge2', 'challenge3'];

export default async function ProjectContent({ translationKey, projectId }: ProjectContentProps) {
  const t = await getTranslations('ProjectDetail');

  return (
    <main className="space-y-12">
      {/* Overview Section */}
      {t.has(`${translationKey}.overview.title`) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t(`${translationKey}.overview.title`)}
          </h2>
          {t.has(`${translationKey}.overview.background`) && (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {t(`${translationKey}.overview.background`)}
            </p>
          )}
          {t.has(`${translationKey}.overview.contribution`) && (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {t(`${translationKey}.overview.contribution`)}
            </p>
          )}
        </section>
      )}

      {/* Architecture/Content Image */}
      <div className="w-full aspect-video relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <Image
          src={`/projects/${projectId}/hero.webp`}
          alt={`${t(`${translationKey}.title`)} architecture`}
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          quality={75}
          className="object-contain"
          loading="lazy"
        />
      </div>

      {/* Engineering Challenges Section */}
      {t.has(`${translationKey}.challenges.title`) && (
        <section className="space-y-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t(`${translationKey}.challenges.title`)}
          </h2>
          {CHALLENGE_KEYS.map((key) => {
            if (!t.has(`${translationKey}.challenges.${key}.title`)) return null;
            return (
              <ChallengeSection
                key={key}
                translationKey={translationKey}
                challengeKey={key}
                t={t}
              />
            );
          })}
        </section>
      )}

      {/* Retrospective Section */}
      {t.has(`${translationKey}.retrospective.title`) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t(`${translationKey}.retrospective.title`)}
          </h2>
          {t.has(`${translationKey}.retrospective.growth`) && (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {t(`${translationKey}.retrospective.growth`)}
            </p>
          )}
          {t.has(`${translationKey}.retrospective.improvement`) && (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {t(`${translationKey}.retrospective.improvement`)}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
