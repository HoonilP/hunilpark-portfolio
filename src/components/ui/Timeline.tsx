export interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="relative pl-8">
            {/* Dot */}
            <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary-500 -translate-x-1/2" />

            <div className="space-y-1">
              <time className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.date}
              </time>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
