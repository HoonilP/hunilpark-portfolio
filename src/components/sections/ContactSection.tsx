import { getTranslations } from 'next-intl/server';
import { Mail, Phone, Github, ExternalLink } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

export default async function ContactSection() {
  const t = await getTranslations('Contact');

  const contacts = [
    {
      icon: Mail,
      label: t('email'),
      value: 'phoonil0927@gmail.com',
      href: 'mailto:phoonil0927@gmail.com',
    },
    {
      icon: Phone,
      label: t('phone'),
      value: '010-5557-6835',
      href: 'tel:010-5557-6835',
    },
    {
      icon: Github,
      label: t('github'),
      value: '@HoonilP',
      href: 'https://github.com/HoonilP',
      external: true,
    },
    {
      icon: ExternalLink,
      label: t('velog'),
      value: 'velog.io/@hoonilpark',
      href: 'https://velog.io/@hoonilpark',
      external: true,
    },
  ];

  return (
    <SectionWrapper
      id="contact"
      label="Contact"
      heading={t('sectionTitle')}
      centered
      maxWidth="max-w-3xl"
    >
      <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12">
        {t('description')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((contact, index) => {
          const Icon = contact.icon;
          return (
            <a
              key={index}
              href={contact.href}
              {...(contact.external && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
              className="text-center p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <Icon className="w-5 h-5 mx-auto mb-3 text-neutral-400 group-hover:text-primary-500 transition-colors" />
              <p className="label-museum text-neutral-500 dark:text-neutral-400 mb-2">
                {contact.label}
              </p>
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {contact.value}
              </p>
            </a>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
