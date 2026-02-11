import { getTranslations } from 'next-intl/server';
import { Mail, Phone, Github, ExternalLink } from 'lucide-react';

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
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
          {t('sectionTitle')}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          {t('description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <div className="flex-1">
                  <div className="text-sm text-neutral-500 dark:text-neutral-500">
                    {contact.label}
                  </div>
                  <div className="text-neutral-900 dark:text-neutral-100">
                    {contact.value}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
