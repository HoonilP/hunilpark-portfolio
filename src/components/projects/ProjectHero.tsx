import Badge from '@/components/ui/Badge';

interface ProjectHeroProps {
  title: string;
  subtitle: string;
  techStack: string[];
}

export default function ProjectHero({ title, subtitle, techStack }: ProjectHeroProps) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
        {title}
      </h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
        {subtitle}
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {techStack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
      <div className="w-full h-[300px] md:h-[400px] bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
        <span className="text-neutral-400 dark:text-neutral-500">Project Screenshot</span>
      </div>
    </div>
  );
}
