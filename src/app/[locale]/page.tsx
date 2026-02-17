import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';
import HorizontalScrollWrapper from '@/components/HorizontalScrollWrapper';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <HorizontalScrollWrapper>
        <div className="lg:w-screen lg:h-screen lg:shrink-0 lg:overflow-hidden">
          <HeroSection />
        </div>
        <div className="lg:w-screen lg:h-screen lg:shrink-0 lg:overflow-hidden lg:flex lg:items-center">
          <div className="w-full">
            <AboutSection />
          </div>
        </div>
        <div className="lg:w-screen lg:h-screen lg:shrink-0 lg:overflow-hidden lg:flex lg:items-center">
          <div className="w-full">
            <SkillsSection />
          </div>
        </div>
      </HorizontalScrollWrapper>
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </>
  );
}
