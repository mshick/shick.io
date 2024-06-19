'use client'

export default function AdminPage() {
  const config = {
    // local_backend: true,

    backend: {
      name: 'github',
      repo: 'mshick/shick.io',
      branch: 'main',
      // site_domain: 'new-shick-io.vercel.app',
      // base_url: 'https://new-shick-io.vercel.app',
      site_domain: 'localhost:1337',
      base_url: 'http://localhost:1337',
      auth_endpoint: 'oauth'
    },

    media_folder: 'public/static',
    public_folder: '/',
    show_preview_links: false,

    editor: {
      preview: false
    },

    collections: [
      {
        name: 'posts',
        label: 'Posts',
        label_singular: 'Post',
        folder: 'content/posts',
        create: true,
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          { label: 'Date', name: 'date', widget: 'datetime' },
          { label: 'Body', name: 'body', widget: 'markdown' }
        ]
      },
      {
        name: 'pages',
        label: 'Pages',
        label_singular: 'Page',
        folder: 'content/pages',
        extension: 'mdx',
        format: 'frontmatter',
        create: true,
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          { label: 'Date', name: 'date', widget: 'datetime' },
          { label: 'Body', name: 'body', widget: 'markdown' }
        ]
      }
    ]
  }

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
    <script is:inline>
      window.CMS_MANUAL_INIT = true;
    </script>

    <script src="https://unpkg.com/decap-cms@^3.1.10/dist/decap-cms.js" type="module"></script>

    <script type="module">
      const config = ${JSON.stringify(config)};
      window.initCMS({ config });
    </script>
  </body>
</html>`
      }}
    />
  )
}
