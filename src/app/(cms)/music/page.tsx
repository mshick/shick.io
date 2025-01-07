'use client';

const developerToken = '';

export default function MusicPage() {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      dangerouslySetInnerHTML={{
        __html: `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Content Manager</title>
  </head>
  <body>
    <script src="https://js-cdn.music.apple.com/musickit/v3/musickit.js" data-web-components async></script>
    <script type="module">      
      document.addEventListener('musickitloaded', async function () {
        try {
          await MusicKit.configure({
            developerToken: '${developerToken}',
            app: {
              name: 'My Cool Web App',
              build: '1978.4.1',
            },
          });
        } catch (err) {
          // Handle configuration error
        }

        // MusicKit instance is available
        const music = MusicKit.getInstance();

        music.authorize().then(musicUserToken => {
          console.log(musicUserToken);
        });
      });
    </script>
  </body>
</html>`,
      }}
    />
  );
}
