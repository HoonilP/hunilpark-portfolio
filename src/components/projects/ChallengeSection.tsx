interface ChallengeSectionProps {
  translationKey: string;
  challengeKey: string;
  t: {
    (key: string): string;
    has: (key: string) => boolean;
  };
}

export default function ChallengeSection({ translationKey, challengeKey, t }: ChallengeSectionProps) {
  const prefix = `${translationKey}.challenges.${challengeKey}`;

  // Sub-fields in narrative order
  const fields = [
    { key: 'context', labelKo: '문제 정의', labelEn: 'Problem' },
    { key: 'alternatives', labelKo: '시도한 접근법', labelEn: 'Approaches' },
    { key: 'decision', labelKo: '비교/결정', labelEn: 'Decision' },
    { key: 'implementation', labelKo: '구현', labelEn: 'Implementation' },
    { key: 'outcome', labelKo: '성과', labelEn: 'Outcome' },
  ];

  return (
    <div className="space-y-4 border-l-2 border-neutral-200 dark:border-neutral-700 pl-6">
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {t(`${prefix}.title`)}
      </h3>
      {fields.map(({ key }) => {
        if (!t.has(`${prefix}.${key}`)) return null;
        return (
          <div key={key} className="space-y-1">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {t(`${prefix}.${key}`)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
