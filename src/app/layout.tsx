import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { isDevelopment } from '~/lib/env';
import { getOptions } from '#/content';

const { title, url, description, locale } = getOptions([
  'title',
  'url',
  'description',
  'locale',
]);

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`,
  },
  description: description,
  alternates: {
    canonical: url,
  },
  metadataBase: new URL(url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: title,
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang={locale} suppressHydrationWarning={isDevelopment}>
      <body>{children}</body>
    </html>
  );
}
