/* eslint-disable no-useless-escape */
'use client'

// const SCRIPT = 'https://unpkg.com/decap-cms/dist/decap-cms.js'
// const SCRIPT = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js'

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
    <script src="https://unpkg.com/decap-cms/dist/decap-cms.js"></script>
    <script>
      const image = {
        label: 'Image666',
        id: 'image666',
        fromBlock: match =>
          match && {
            image: match[2],
            alt: match[1],
            title: match[4],
          },
        toBlock: (params, a, b) => {
          console.log('toBlock', params, a, b)
          const { alt, image, title } = params
          return \`![\${alt || ''}](\${image || ''}\${title ? \` "\${title.replace(/"/g, '\\"')}"\` : ''})\`
        },
        toPreview: ({ alt, image, title }, getAsset, fields) => {
          const imageField = fields?.find(f => f.get('widget') === 'image');
          const src = getAsset(image, imageField);
          return \`<img src="\${src || ''}" alt="\${alt || ''}" title="\${title || ''}" />\`;
        },
        pattern: /^!\[(.*)\]\((.*?)(\s"(.*)")?\)$/,
        fields: [
          {
            label: 'Image',
            name: 'image',
            widget: 'image',
            media_library: {
              allow_multiple: false,
            },
          },
          {
            label: 'Alt Text',
            name: 'alt',
          },
          {
            label: 'Title',
            name: 'title',
          },
        ],
      };
      CMS.registerEditorComponent(image);
    </script>    
  </body>
</html>`
      }}
    />
  )
}
