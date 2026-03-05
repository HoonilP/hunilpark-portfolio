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

  // Sub-fields in narrative order
  const fields = [
    { key: 'context', labelKo: '문제 정의', labelEn: 'Problem' },
    { key: 'alternatives', labelKo: '시도한 접근법', labelEn: 'Approaches' },
    { key: 'decision', labelKo: '비교/결정', labelEn: 'Decision' },
    { key: 'implementation', labelKo: '구현', labelEn: 'Implementation' },
    { key: 'outcome', labelKo: '성과', labelEn: 'Outcome' },
  ];

  // Check for optional code snippet
  const hasCode = t.has(`${prefix}.code`);

  return (
    <div className="space-y-4 border-l-2 border-slate-300 dark:border-slate-700 pl-6">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        {t(`${prefix}.title`)}
      </h3>
      {fields.map(({ key }) => {
        if (!t.has(`${prefix}.${key}`)) return null;
        return (
          <div key={key} className="space-y-1">
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
