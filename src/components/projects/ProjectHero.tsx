import Image from 'next/image';
import Badge from '@/components/ui/Badge';

interface ProjectHeroProps {
  title: string;
  subtitle: string;
  techStack: string[];
  projectId: string;
}

export default function ProjectHero({ title, subtitle, techStack, projectId }: ProjectHeroProps) {
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
      <div className="w-full aspect-video relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        <Image
          src={`/projects/${projectId}/hero.webp`}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          quality={90}
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
