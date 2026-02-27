import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  transpilePackages: ['three'],
  images: {
    formats: ['image/webp'],
  },
});
