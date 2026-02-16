import { getTranslations } from 'next-intl/server';
import { Mail, Phone, Github, ExternalLink } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default async function ContactSection() {
  const t = await getTranslations('Contact');
  const nav = await getTranslations('Navigation');

  const navLinks = [
    { href: '#about', label: nav('about') },
    { href: '#skills', label: nav('skills') },
    { href: '#projects', label: nav('projects') },
    { href: '#experience', label: nav('experience') },
    { href: '#education', label: nav('education') },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/HoonilP',
    },
    {
      icon: ExternalLink,
      label: 'Velog',
      href: 'https://velog.io/@hoonilpark',
    },
  ];

  return (
    <section
      id="contact"
      className="bg-neutral-900 dark:bg-neutral-950 text-white py-24 lg:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Big heading */}
        <ScrollReveal>
          <h2 className="heading-display text-white mb-16 lg:mb-24">
            {t('description')}
          </h2>
        </ScrollReveal>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Navigation */}
          <ScrollReveal delay={0.1}>
            <div>
              <p className="label-museum text-neutral-500 mb-6">Navigate</p>
              <nav className="space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-lg text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Right: Contact Info */}
          <ScrollReveal delay={0.2}>
            <div>
              <p className="label-museum text-neutral-500 mb-6">{t('sectionTitle')}</p>
              <div className="space-y-6">
                {/* Email */}
                <a
                  href="mailto:phoonil0927@gmail.com"
                  className="flex items-center gap-3 text-lg text-neutral-300 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                  phoonil0927@gmail.com
                </a>

                {/* Phone */}
                <a
                  href="tel:010-5557-6835"
                  className="flex items-center gap-3 text-lg text-neutral-300 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                  010-5557-6835
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-10">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-400 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
