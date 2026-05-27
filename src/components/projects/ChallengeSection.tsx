import CodeBlock from './CodeBlock';

interface ChallengeSectionProps {
  translationKey: string;
  challengeKey: string;
  t: {
    (key: string): string;
    has: (key: string) => boolean;
    raw: (key: string) => string;
  };
}

export default async function ChallengeSection({ translationKey, challengeKey, t }: ChallengeSectionProps) {
  const prefix = `${translationKey}.challenges.${challengeKey}`;

  const fields = [
    { key: 'problem', label: 'Problem' },
    { key: 'solution', label: 'Solution' },
    { key: 'result', label: 'Result' },
  ];

  const hasCode = t.has(`${prefix}.code`);

  return (
    <div className="space-y-4 border-l-2 border-slate-300 dark:border-slate-700 pl-6">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        {t(`${prefix}.title`)}
      </h3>
      {fields.map(({ key, label }) => {
        if (!t.has(`${prefix}.${key}`)) return null;
        return (
          <div key={key} className="space-y-1">
            <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {label}
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {t(`${prefix}.${key}`)}
            </p>
          </div>
        );
      })}
      {hasCode && (
        <CodeBlock
          code={t.raw(`${prefix}.code`)}
          lang={t.has(`${prefix}.codeLang`) ? t(`${prefix}.codeLang`) : undefined}
        />
      )}
    </div>
  );
}
