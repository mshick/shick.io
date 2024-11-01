/* eslint-disable no-useless-escape */
'use client'

// const SCRIPT = 'https://unpkg.com/decap-cms/dist/decap-cms.js'
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
          "prettier": "https://esm.sh/prettier@2.8.8",
          "prettierMarkdownParser": "https://esm.sh/prettier@2.8.8/parser-markdown.mjs"
        }
      }
    </script>
    <script type="module">
      import YAML from 'yaml'
      import prettier from 'prettier'
      import prettierMarkdownParser from 'prettierMarkdownParser'

      const formatYAML = (value) =>
        YAML.stringify(value, null, {
          lineWidth: 0,
          defaultKeyType: 'PLAIN',
          defaultStringType: 'PLAIN',
          singleQuote: true
        }).trim();      

      CMS.registerCustomFormat('yaml-frontmatter', 'md', {
        // fromFile: text => JSON5.parse(text),
        toFile(content) {
          const delimiter = '---';
          const body = content.body ? content.body + '\\n' : '';

          delete content.body;

          const out = delimiter + '\\n' + formatYAML(content) + '\\n' + delimiter + '\\n\\n' + body;

          return prettier.format(out, {
            parser: 'markdown',
            plugins: [prettierMarkdownParser],
            arrowParens: 'always',
            endOfLine: 'lf',
            printWidth: 80,
            proseWrap: 'preserve',
            semi: false,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: 'none'
          })
        }
      });
    </script>
  </body>
</html>`
      }}
    />
  )
}
