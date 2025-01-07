import localFont from 'next/font/local';

export const plexMono = localFont({
  src: [
    {
      path: '../../node_modules/@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../node_modules/@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../node_modules/@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Regular.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../node_modules/@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Italic.woff2',
      weight: '300',
      style: 'italic',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-plex-mono',
});
