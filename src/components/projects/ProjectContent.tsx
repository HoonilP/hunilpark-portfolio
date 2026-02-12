import { getTranslations } from 'next-intl/server';

interface ProjectContentProps {
  translationKey: string;
}

export default async function ProjectContent({ translationKey }: ProjectContentProps) {
  const t = await getTranslations('ProjectDetail');

  // Feature keys to check for implementation section
  const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'];
  const issueKeys = ['issue1', 'issue2', 'issue3', 'issue4', 'issue5'];

  return (
    <main className="space-y-12">
      {/* Overview Section */}
      {t.has(`${translationKey}.overview.title`) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t(`${translationKey}.overview.title`)}
          </h2>
          {t.has(`${translationKey}.overview.background`) && (
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {t(`${translationKey}.overview.background`)}
            </p>
          )}
          {t.has(`${translationKey}.overview.contribution`) && (
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {t(`${translationKey}.overview.contribution`)}
            </p>
          )}
        </section>
      )}

      {/* Architecture Diagram Placeholder */}
      <div className="w-full h-[200px] bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
        <span className="text-neutral-400 dark:text-neutral-500">Architecture Diagram</span>
      </div>

      {/* Implementation Section */}
      {t.has(`${translationKey}.implementation.title`) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t(`${translationKey}.implementation.title`)}
          </h2>

          {featureKeys.map((featureKey) => {
            const hasFeature = t.has(`${translationKey}.implementation.${featureKey}.title`);
            if (!hasFeature) return null;

            return (
              <div key={featureKey} className="space-y-3">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {t(`${translationKey}.implementation.${featureKey}.title`)}
                </h3>
                {t.has(`${translationKey}.implementation.${featureKey}.problem`) && (
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t(`${translationKey}.implementation.${featureKey}.problem`)}
                  </p>
                )}
                {t.has(`${translationKey}.implementation.${featureKey}.solution`) && (
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t(`${translationKey}.implementation.${featureKey}.solution`)}
                  </p>
                )}
                {t.has(`${translationKey}.implementation.${featureKey}.result`) && (
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t(`${translationKey}.implementation.${featureKey}.result`)}
                  </p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Troubleshooting Section */}
      {t.has(`${translationKey}.troubleshooting.title`) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t(`${translationKey}.troubleshooting.title`)}
          </h2>

          {issueKeys.map((issueKey) => {
            const hasIssue = t.has(`${translationKey}.troubleshooting.${issueKey}.title`);
            if (!hasIssue) return null;

            return (
              <div key={issueKey} className="space-y-3">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {t(`${translationKey}.troubleshooting.${issueKey}.title`)}
                </h3>
                {t.has(`${translationKey}.troubleshooting.${issueKey}.problem`) && (
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t(`${translationKey}.troubleshooting.${issueKey}.problem`)}
                  </p>
                )}
                {t.has(`${translationKey}.troubleshooting.${issueKey}.solution`) && (
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t(`${translationKey}.troubleshooting.${issueKey}.solution`)}
                  </p>
                )}
                {t.has(`${translationKey}.troubleshooting.${issueKey}.result`) && (
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t(`${translationKey}.troubleshooting.${issueKey}.result`)}
                  </p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Retrospective Section */}
      {t.has(`${translationKey}.retrospective.title`) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t(`${translationKey}.retrospective.title`)}
          </h2>
          {t.has(`${translationKey}.retrospective.growth`) && (
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {t(`${translationKey}.retrospective.growth`)}
            </p>
          )}
          {t.has(`${translationKey}.retrospective.improvement`) && (
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {t(`${translationKey}.retrospective.improvement`)}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
