/* eslint-disable no-useless-escape */
'use client'

import pkg from '../../../../package.json'

// const CMS = 'https://unpkg.com/decap-cms/dist/decap-cms.js'
const CMS = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js'

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
    <script src="${CMS}"></script>
    <script type="importmap">
      {
        "imports": {
          "yaml": "https://esm.sh/yaml@2.6.0",
          "prettier": "https://esm.sh/prettier@3.3.3",
          "prettierMarkdown": "https://esm.sh/prettier@3.3.3/plugins/markdown.mjs"
        }
      }
    </script>
    <script type="module">
      import YAML from 'yaml'
      import prettier from 'prettier'
      import prettierMarkdown from 'prettierMarkdown'

      const prettierConfig = ${JSON.stringify(pkg.prettier)}

      const formatYAML = (content) => {
        for (const [k, c] of Object.entries(content)) {
          if (k === 'excerpt' && c === '') {
            delete content[k];
          }
        }

        return YAML.stringify(content, null, {
          lineWidth: 0,
          defaultKeyType: 'PLAIN',
          defaultStringType: 'PLAIN',
          singleQuote: true
        }).trim();
      }

      const toFile = async ({body, ...content}) => {
        const delimiter = '---';
        
        body = body ? body + '\\n' : '';
        const out = delimiter + '\\n' + formatYAML(content) + '\\n' + delimiter + '\\n\\n' + body;

        return prettier.format(out, {
          parser: 'markdown',
          plugins: [prettierMarkdown],
          ...prettierConfig
        })
      }

      CMS.registerCustomFormat('yaml-frontmatter', 'md', {toFile});
      CMS.registerCustomFormat('frontmatter', 'mdx', {toFile});
    </script>
  </body>
</html>`
      }}
    />
  )
}
