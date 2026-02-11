import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'border border-neutral-200 dark:border-neutral-800 rounded-lg p-6',
        hover && 'transition-colors hover:border-primary-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
