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
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-neutral-800" />

      <div className="space-y-10">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative pl-10 group/item"
          >
            {/* Dot with ring */}
            <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary-500 -translate-x-[5px] ring-4 ring-neutral-50 dark:ring-neutral-950 transition-all group-hover/item:ring-primary-500/20" />

            <div className="space-y-1.5 rounded-lg p-4 -ml-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
              <time className="text-sm text-neutral-500 dark:text-neutral-400 label-museum">
                {item.date}
              </time>
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
