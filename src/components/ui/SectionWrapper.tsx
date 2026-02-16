import { cn } from '@/lib/utils';
import ScrollReveal from '@/components/ScrollReveal';

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
        <ScrollReveal line>
          <div className="section-divider mb-12 text-neutral-900 dark:text-neutral-100" />
        </ScrollReveal>

        {/* Label */}
        {label && (
          <ScrollReveal delay={0.1}>
            <p className={cn('label-museum text-neutral-500 dark:text-neutral-400 mb-4', centered && 'text-center')}>
              {label}
            </p>
          </ScrollReveal>
        )}

        {/* Heading */}
        {heading && (
          <ScrollReveal delay={0.2}>
            <h2 className={cn('heading-section text-neutral-900 dark:text-neutral-100 mb-12', centered && 'text-center')}>
              {heading}
            </h2>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.3}>
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
}
