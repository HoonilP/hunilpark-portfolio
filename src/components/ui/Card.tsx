import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'museum';
}

export default function Card({
  hover = false,
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-8 transition-all duration-300',
        {
          'border border-neutral-200 dark:border-neutral-800 group-hover:border-primary-500':
            variant === 'default',
          'bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:-translate-y-1':
            variant === 'elevated',
          'border border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1':
            variant === 'museum',
        },
        hover && 'hover:border-primary-500 hover:shadow-lg hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
