import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id: string;
  label?: string;
  heading?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  centered?: boolean;
}

export default function SectionWrapper({
  id,
  label,
  heading,
  children,
  maxWidth = 'max-w-5xl',
  className,
  centered = false,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-24 lg:py-32', className)}>
      <div className={cn(maxWidth, 'mx-auto px-6')}>
        {/* Divider */}
        <div className="section-divider mb-12 text-neutral-900 dark:text-neutral-100" />

        {/* Label */}
        {label && (
          <p className={cn('label-museum text-neutral-500 dark:text-neutral-400 mb-4', centered && 'text-center')}>
            {label}
          </p>
        )}

        {/* Heading */}
        {heading && (
          <h2 className={cn('heading-section text-neutral-900 dark:text-neutral-100 mb-12', centered && 'text-center')}>
            {heading}
          </h2>
        )}

        {children}
      </div>
    </section>
  );
}
