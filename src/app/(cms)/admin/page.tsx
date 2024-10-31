/* eslint-disable no-useless-escape */
'use client'

// const SCRIPT = 'https://unpkg.com/decap-cms/dist/decap-cms.js'
const SCRIPT = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js'

export default function AdminPage() {
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
    <link href="/cms-config.yml" type="text/yaml" rel="cms-config-url">
    <title>Content Manager</title>
  </head>
  <body>
    <script src="${SCRIPT}"></script>
  </body>
</html>`
      }}
    />
  )
}
