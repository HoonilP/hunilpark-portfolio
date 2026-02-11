import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-md',
        'bg-neutral-100 text-neutral-700 border border-neutral-200',
        'dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
        className
      )}
    >
      {children}
    </span>
  );
}
